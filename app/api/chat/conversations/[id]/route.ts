import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import { getOrCreateWorkspaceForCurrentUser } from "@/app/api/workspace/helpers";
import { ChatConversation } from "@/app/api/models/ChatConversationModel";
import { ChatMessage } from "@/app/api/models/ChatMessageModel";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        const conversation = await ChatConversation.findOne({
            _id: id,
            workspaceId: workspace._id,
        }).lean();

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const [messages, widget] = await Promise.all([
            ChatMessage.find({ conversationId: id })
                .sort({ createdAt: 1 })
                .lean()
                .exec(),
            ChatWidget.findById(conversation.widgetId).lean(),
        ]);

        return NextResponse.json({
            id: conversation._id.toString(),
            widgetId: conversation.widgetId.toString(),
            visitorId: conversation.visitorId,
            visitorPage: conversation.visitorPage,
            status: conversation.status,
            lastMessageAt: conversation.lastMessageAt,
            createdAt: conversation.createdAt,
            widget: widget
                ? {
                    domain: widget.domain,
                    accentColor: widget.accentColor,
                    welcomeMessage: widget.welcomeMessage,
                }
                : null,
            widgetKey: widget?.activationKey || null,
            messages: messages.map((m) => ({
                id: m._id.toString(),
                sender: m.sender,
                body: m.body,
                type: m.type || "text",
                mediaUrl: m.mediaUrl || "",
                createdAt: m.createdAt,
            })),
        });
    } catch (error) {
        console.error("GET /api/chat/conversations/[id] error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await dbConnect();
        const workspace = await getOrCreateWorkspaceForCurrentUser();

        // 1. Verify the conversation belongs to the user
        const conversation = await ChatConversation.findOne({
            _id: id,
            workspaceId: workspace._id,
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        // 2. Find all messages with media to delete from Cloudinary
        const messagesWithMedia = await ChatMessage.find({
            conversationId: id,
            mediaUrl: { $exists: true, $ne: "" }
        }).lean();

        // 3. Delete files from Cloudinary
        if (messagesWithMedia.length > 0) {
            const deletePromises = messagesWithMedia.map(msg => {
                if (msg.mediaUrl) {
                    // Extract public_id from cloudinary URL
                    // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/chat_uploads/filename.jpg
                    try {
                        const urlParts = msg.mediaUrl.split('/');
                        const fileWithExt = urlParts[urlParts.length - 1]; // filename.jpg
                        const folder = urlParts[urlParts.length - 2];      // chat_uploads

                        if (folder === "chat_uploads") {
                            const isPdf = msg.type === "pdf";
                            // PDFs: public_id includes extension (raw resource type)
                            // Images: strip the last extension Cloudinary appended
                            const publicId = isPdf
                                ? `chat_uploads/${fileWithExt}`
                                : `chat_uploads/${fileWithExt.replace(/\.[^.]+$/, "")}`;
                            const resourceType = isPdf ? "raw" : "image";

                            return new Promise((resolve) => {
                                cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
                                    if (error) console.error(`Failed to delete Cloudinary asset ${publicId}:`, error);
                                    resolve(result);
                                });
                            });
                        }
                    } catch (e) {
                        console.error("Error parsing Cloudinary URL for deletion:", e);
                    }
                }
                return Promise.resolve();
            });

            await Promise.allSettled(deletePromises);
        }

        // 4. Delete all messages from the database
        await ChatMessage.deleteMany({ conversationId: id });

        // 5. Delete the conversation itself
        await ChatConversation.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/chat/conversations/[id] error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
