import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ChatWidget } from "@/app/api/models/ChatWidgetModel";
import { uploadToR2 } from "@/lib/r2";

// POST /api/chat/visitor-upload
// PUBLIC endpoint (no Clerk auth) — called by the visitor chat widget.
// Validates the activation key, then uploads the file server-side via R2.
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const key = formData.get("key") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!key) {
            return NextResponse.json({ error: "Activation key is required" }, { status: 400 });
        }

        // Validate activation key
        await dbConnect();
        const widget = await ChatWidget.findOne({
            activationKey: key,
            status: "active",
        }).lean();

        if (!widget) {
            return NextResponse.json({ error: "Invalid or inactive key" }, { status: 401 });
        }

        // Validate file type
        const allowedTypes = [
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Only images (jpg, png, gif, webp) and PDFs are allowed" },
                { status: 400 }
            );
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
        }

        const fileType = file.type === "application/pdf" ? "pdf" : "image";

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const publicUrl = await uploadToR2(buffer, file.name, file.type);

        return NextResponse.json({
            url: publicUrl,
            type: fileType,
            filename: file.name,
        });
    } catch (error) {
        console.error("POST /api/chat/visitor-upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
