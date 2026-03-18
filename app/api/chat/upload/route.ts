import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { uploadToR2 } from "@/lib/r2";

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

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const publicUrl = await uploadToR2(buffer, file.name, file.type);

        return NextResponse.json({
            url: publicUrl,
            type: fileType,
            filename: file.name,
        });
    } catch (error) {
        console.error("POST /api/chat/upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
