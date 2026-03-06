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

        const blob = await response.blob();
        const headers = new Headers();
        headers.set("Content-Type", blob.type || "application/octet-stream");
        headers.set("Content-Disposition", `attachment; filename="${filename}"`);
        headers.set("Content-Length", blob.size.toString());

        return new NextResponse(blob, { headers });
    } catch {
        return NextResponse.json({ error: "Download failed" }, { status: 500 });
    }
}
