import { NextResponse } from "next/server";

// GET /api/chat/download-proxy?url=...&filename=...
// Proxies file downloads to bypass CORS restrictions on cross-origin
// resources (e.g., Cloudinary raw/PDF files that block client-side fetch).
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const filename = searchParams.get("filename") || "download";

    if (!url) {
        return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
        }

        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const headers = new Headers();
        headers.set("Content-Type", contentType);
        headers.set("Content-Disposition", `attachment; filename="${filename}"`);
        headers.set("Content-Length", arrayBuffer.byteLength.toString());

        return new NextResponse(Buffer.from(arrayBuffer), { headers });
    } catch {
        return NextResponse.json({ error: "Download failed" }, { status: 500 });
    }
}
