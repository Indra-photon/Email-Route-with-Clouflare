/**
 * groqTagging.ts
 * ──────────────────────────────────────────────────────────────────
 * Sends an inbound email's subject + body to the Groq API and asks
 * it to classify the ticket using our curated tag list.
 *
 * DEFAULT TAGS (8 total):
 *   User-defined: pricing-issue, login-issue, product-issue, subscription-issue
 *   System-added:  bug-report, feature-request, billing-inquiry, account-access
 * ──────────────────────────────────────────────────────────────────
 */

export const DEFAULT_AI_TAGS = [
  "pricing-issue",
  "login-issue",
  "product-issue",
  "subscription-issue",
  "bug-report",
  "feature-request",
  "billing-inquiry",
  "account-access",
] as const;

export type DefaultTag = (typeof DEFAULT_AI_TAGS)[number];

/**
 * Calls the Groq API to classify a ticket email into one or more tags.
 *
 * @param subject  Email subject line
 * @param body     Plain-text email body (stripped of quoted replies)
 * @param tagList  Full tag list (default + any custom workspace tags)
 * @returns        Array of matching tag strings (subset of tagList), or [] on error
 */
export async function getAiTagsForEmail(
  subject: string,
  body: string,
  tagList: string[] = [...DEFAULT_AI_TAGS]
): Promise<string[]> {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    console.warn("⚠️ GROQ_API_KEY is not set — skipping AI tagging");
    return [];
  }

  const tagListStr = tagList.join(", ");
  const trimmedBody = body.slice(0, 1500); // Keep prompt within token limits

  const prompt = `You are a customer support ticket classifier.

Given the following support email, classify it by selecting the most relevant tags from the tag list below.

Rules:
- Only pick tags from the provided list. Do NOT invent new ones.
- Select 1 to 3 tags maximum.
- Return ONLY a valid JSON array of strings, nothing else. Example: ["billing-inquiry", "login-issue"]
- If no tag fits, return an empty array: []

Available tags: ${tagListStr}

Email Subject: ${subject}
Email Body:
${trimmedBody}

Response (JSON array only):`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`⚠️ Groq API error ${res.status}:`, errText.slice(0, 200));
      return [];
    }

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content?.trim() ?? "";
    console.log("🤖 Groq raw response:", raw);

    // Extract JSON array from the response (handles cases where model adds extra text)
    // Note: use [\s\S] instead of . with /s flag to stay compatible with ES < 2018
    const match = raw.match(/\[[\s\S]*?\]/);
    if (!match) return [];

    const parsed: unknown = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];

    // Validate: only keep tags that exist in our list
    const validTags = (parsed as string[]).filter((t) =>
      typeof t === "string" && tagList.includes(t)
    );

    console.log("🏷️ AI tags assigned:", validTags);
    return validTags;
  } catch (err) {
    console.warn("⚠️ groqTagging error:", err);
    return [];
  }
}
