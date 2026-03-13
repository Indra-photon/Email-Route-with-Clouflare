import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/chat/upload
// Agent-side file upload — requires Clerk auth.
// Accepts multipart/form-data with a 'file' field.
// Returns { url, type: 'image'|'pdf', filename }
export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

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

        // Convert File to Buffer for Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        const uploadResult = await new Promise<{ secure_url: string; public_id: string }>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "chat_uploads",
                        resource_type: fileType === "pdf" ? "raw" : "image",
                        public_id: `${Date.now()}_${file.name.replace(/\s+/g, "_")}`,
                        access_mode: "public",
                    },
                    (err, result) => {
                        if (err || !result) return reject(err);
                        resolve(result as { secure_url: string; public_id: string });
                    }
                );
                uploadStream.end(buffer);
            }
        );

        return NextResponse.json({
            url: uploadResult.secure_url,
            type: fileType,
            filename: file.name,
        });
    } catch (error) {
        console.error("POST /api/chat/upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
