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
    const { channelId, botToken, message, threadTs, visitorId, domain } = params;

    try {
        // If threadTs is provided, post as thread reply; otherwise create new thread
        const payload: Record<string, unknown> = {
            channel: channelId,
            text: message,
        };

        if (threadTs) {
            // Reply in existing thread
            payload.thread_ts = threadTs;
        } else {
            // New thread - add rich formatting with visitor info
            payload.blocks = [
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
        }

        const response = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
}): Promise<{ ok: boolean; error?: string }> {
    const { channelId, botToken, threadTs, message } = params;

    try {
        const response = await fetch("https://slack.com/api/chat.postMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${botToken}`,
            },
            body: JSON.stringify({
                channel: channelId,
                thread_ts: threadTs,
                text: message,
                blocks: [
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `🤖 *Agent (Dashboard):* ${message}`,
                        },
                    },
                ],
            }),
        });

        const data = await response.json();

        if (!data.ok) {
            console.error("❌ Slack agent reply failed:", data.error);
            return { ok: false, error: data.error };
        }

        return { ok: true };
    } catch (error) {
        console.error("❌ Error posting agent reply to Slack:", error);
        return { ok: false, error: String(error) };
    }
}
