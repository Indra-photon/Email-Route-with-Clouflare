/**
 * Slack Live Chat Integration Helpers
 * 
 * These functions handle posting visitor and agent messages to Slack channels
 * as threaded conversations for the live chat feature.
 */

interface SlackPostMessageParams {
    channelId: string;
    botToken: string;
    message: string;
    threadTs?: string; // If provided, posts as a thread reply
    visitorId?: string;
    domain?: string;
    mediaUrl?: string; // Cloudinary image/PDF URL
    mediaType?: 'text' | 'image' | 'pdf';
}

interface SlackPostMessageResult {
    ok: boolean;
    threadTs?: string;
    error?: string;
}

/**
 * Posts a message to Slack (creates new thread or replies to existing)
 */
export async function postToSlackLiveChat(
    params: SlackPostMessageParams
): Promise<SlackPostMessageResult> {
    const { channelId, botToken, message, threadTs, visitorId, domain, mediaUrl, mediaType } = params;

    try {
        // Build the fallback text
        const fallbackText = mediaUrl ? `${message} ${mediaUrl}` : message;

        // If threadTs is provided, post as thread reply; otherwise create new thread
        const payload: Record<string, unknown> = {
            channel: channelId,
            text: fallbackText,
        };

        if (threadTs) {
            // Reply in existing thread
            payload.thread_ts = threadTs;

            // If there's an image, use blocks to display it inline
            if (mediaUrl && mediaType === 'image') {
                const blocks: Record<string, unknown>[] = [];
                if (message && message !== '[file attachment]') {
                    blocks.push({
                        type: "section",
                        text: { type: "mrkdwn", text: `👤 *Visitor:* ${message}` },
                    });
                }
                blocks.push({
                    type: "image",
                    image_url: mediaUrl,
                    alt_text: "Shared image",
                });
                payload.blocks = blocks;
            } else if (mediaUrl && mediaType === 'pdf') {
                // PDFs can't be displayed inline — send a link
                payload.text = `👤 *Visitor:* ${message || ''} <${mediaUrl}|📄 View PDF>`;
            }
        } else {
            // New thread - add rich formatting with visitor info
            const blocks: Record<string, unknown>[] = [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `💬 *New Live Chat*\n\n*Visitor:* ${visitorId || "Unknown"}\n*Domain:* \`${domain || "Unknown"}\``,
                    },
                },
                {
                    type: "divider",
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `👤 *Visitor:* ${message}`,
                    },
                },
            ];

            // Add image block if the first message has an image
            if (mediaUrl && mediaType === 'image') {
                blocks.push({
                    type: "image",
                    image_url: mediaUrl,
                    alt_text: "Shared image",
                });
            } else if (mediaUrl && mediaType === 'pdf') {
                blocks.push({
                    type: "section",
                    text: { type: "mrkdwn", text: `<${mediaUrl}|📄 View PDF>` },
                });
            }

            payload.blocks = blocks;
        }

        const response = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${botToken}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!data.ok) {
            console.error("❌ Slack postMessage failed:", data.error);
            return { ok: false, error: data.error };
        }

        // Return the thread_ts - this will be the message ts for new threads
        // or the original thread_ts for replies
        return {
            ok: true,
            threadTs: data.ts || threadTs,
        };
    } catch (error) {
        console.error("❌ Error posting to Slack:", error);
        return { ok: false, error: String(error) };
    }
}

/**
 * Posts an agent reply to an existing Slack thread
 */
export async function postAgentReplyToSlack(params: {
    channelId: string;
    botToken: string;
    threadTs: string;
    message: string;
    mediaUrl?: string;
    mediaType?: 'text' | 'image' | 'pdf';
}): Promise<{ ok: boolean; ts?: string; error?: string }> {
    const { channelId, botToken, threadTs, message, mediaUrl, mediaType } = params;

    try {
        const blocks: Record<string, unknown>[] = [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `🤖 *Agent (Dashboard):* ${message}`,
                },
            },
        ];

        // Add image block if agent sent an image
        if (mediaUrl && mediaType === 'image') {
            blocks.push({
                type: "image",
                image_url: mediaUrl,
                alt_text: "Agent shared image",
            });
        } else if (mediaUrl && mediaType === 'pdf') {
            blocks.push({
                type: "section",
                text: { type: "mrkdwn", text: `<${mediaUrl}|📄 View PDF>` },
            });
        }

        const fallbackText = mediaUrl ? `${message} ${mediaUrl}` : message;

        const response = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${botToken}`,
            },
            body: JSON.stringify({
                channel: channelId,
                thread_ts: threadTs,
                text: fallbackText,
                blocks,
            }),
        });

        const data = await response.json();

        if (!data.ok) {
            console.error("❌ Slack agent reply failed:", data.error);
            return { ok: false, error: data.error };
        }

        return { ok: true, ts: data.ts };
    } catch (error) {
        console.error("❌ Error posting agent reply to Slack:", error);
        return { ok: false, error: String(error) };
    }
}
