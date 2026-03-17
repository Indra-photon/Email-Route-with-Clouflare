import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

export async function uploadToR2(
    buffer: Buffer,
    filename: string,
    contentType: string
): Promise<string> {
    const key = `chat_uploads/${Date.now()}_${filename.replace(/\s+/g, "_")}`;

    await r2Client.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        })
    );

    return `${PUBLIC_URL}/${key}`;
}

export async function deleteFromR2(publicUrl: string): Promise<void> {
    // Extract the key by stripping the public URL prefix
    // e.g. https://pub-xxx.r2.dev/chat_uploads/file.jpg → chat_uploads/file.jpg
    const key = publicUrl.replace(`${PUBLIC_URL}/`, "");
    if (!key || key === publicUrl) return; // Unrecognized URL, skip

    await r2Client.send(
        new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: key,
        })
    );
}
