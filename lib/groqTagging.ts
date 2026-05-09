/**
 * groqTagging.ts
 * ──────────────────────────────────────────────────────────────────
 * Sends an inbound email's subject + body to the Groq API and asks
 * it to:
 *   1. Classify the ticket using our curated tag list (getAiTagsForEmail)
 *   2. Determine the urgency priority level    (getAiPriorityForEmail)
 *
 * DEFAULT TAGS (8 total):
 *   User-defined: pricing-issue, login-issue, product-issue, subscription-issue
 *   System-added:  bug-report, feature-request, billing-inquiry, account-access
 *
 * PRIORITY LEVELS:
 *   urgent     — needs immediate attention (outage, legal, data-loss, SLA breach)
 *   moderate   — standard support, should be handled within normal SLAs
 *   not-urgent — low-impact, informational, or can wait
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

Given the following support email, identify the SINGLE most accurate tag that best describes the core issue.

Rules:
- You MUST pick exactly ONE tag from the provided list. Do NOT invent new tags.
- Choose the tag that most precisely matches the primary problem described in the email.
- If the email mentions multiple issues, pick the tag for the most critical or dominant one.
- Return ONLY a valid JSON array containing exactly one string. Example: ["billing-inquiry"]
- If absolutely no tag fits the email content at all, return an empty array: []

Available tags: ${tagListStr}

Email Subject: ${subject}
Email Body:
${trimmedBody}

Response (JSON array with exactly one tag):`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 40, // Only needs one short tag name in a JSON array
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

/**
 * Calls the Groq API to determine the priority level of a support email.
 *
 * Priority levels:
 *   - "urgent"     — requires immediate attention (service outage, legal threats,
 *                    data loss, payment failures, account locked, SLA breach)
 *   - "moderate"   — standard support issue within normal response SLAs
 *   - "not-urgent" — informational, low-impact, general inquiry, or feature suggestion
 *
 * @param subject  Email subject line
 * @param body     Plain-text email body (stripped of quoted replies)
 * @returns        One of: "urgent" | "moderate" | "not-urgent"
 */
export async function getAiPriorityForEmail(
  subject: string,
  body: string
): Promise<"urgent" | "moderate" | "not-urgent"> {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    console.warn("⚠️ GROQ_API_KEY is not set — skipping AI priority detection");
    return "moderate";
  }

  const trimmedBody = body.slice(0, 1500); // Stay within token limits

  const prompt = `You are an expert customer support triage specialist responsible for accurately classifying the urgency of inbound support emails.

Your task is to assign ONE priority level to the following support email based on a careful multi-signal analysis:

━━━ PRIORITY DEFINITIONS ━━━

🔴 URGENT — Assign this when the email describes or implies:
  • Complete service outage or total inability to use the product
  • Active data loss, corruption, or security breach
  • Payment processing failure causing financial harm
  • Legal threats, compliance violations, or regulatory deadlines
  • Account permanently locked or access lost entirely
  • Multiple users or an entire business team affected
  • An explicit deadline within 24-48 hours (e.g., "meeting tomorrow", "contract due today")
  • Severe escalation language: "unacceptable", "legal action", "refund immediately", "CEO/manager involved"
  • Customer expressing they are unable to work or operate their business

🟡 MODERATE — Assign this when the email describes:
  • A bug, error, or malfunction that has a workaround or partial degradation
  • Billing questions, subscription changes, or pricing inquiries
  • Login problems where the user can still partially access the product
  • Feature not working as expected but the user can continue working
  • A general support request that should be handled within standard SLA (24–72 hours)
  • Missing features or configuration help

🟢 NOT-URGENT — Assign this when the email is:
  • A general question or how-to inquiry
  • A feature request or product suggestion
  • Feedback, praise, or complaints with no immediate impact
  • Informational — no action required beyond a reply
  • Cancellation requests with no urgency expressed
  • Onboarding or getting-started questions

━━━ ANALYSIS GUIDELINES ━━━
  • Base your decision on BUSINESS IMPACT and TIME-SENSITIVITY, not just emotional tone.
  • A polite email can still be URGENT if it describes a critical failure.
  • A frustrated-sounding email can be MODERATE if the underlying issue is minor.
  • When ambiguous between URGENT and MODERATE, prefer MODERATE.
  • When ambiguous between MODERATE and NOT-URGENT, prefer MODERATE.

━━━ EMAIL TO CLASSIFY ━━━
Subject: ${subject}
Body:
${trimmedBody}

━━━ RESPONSE FORMAT ━━━
Respond with ONLY one of these exact strings (no explanation, no punctuation, no extra text):
urgent
moderate
not-urgent`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1, // Low temperature for deterministic, consistent classification
        max_tokens: 20,   // Only needs to return 1-2 words
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`⚠️ Groq API (priority) error ${res.status}:`, errText.slice(0, 200));
      return "moderate";
    }

    const data = await res.json();
    const raw = (data?.choices?.[0]?.message?.content?.trim() ?? "").toLowerCase();
    console.log("🤖 Groq priority raw response:", raw);

    // Strict validation — must exactly match one of our three values
    if (raw === "urgent" || raw.startsWith("urgent")) return "urgent";
    if (raw === "not-urgent" || raw.startsWith("not-urgent") || raw.startsWith("not urgent")) return "not-urgent";
    if (raw === "moderate" || raw.startsWith("moderate")) return "moderate";

    console.warn("⚠️ Groq priority response did not match expected values:", raw, "— defaulting to 'moderate'");
    return "moderate";
  } catch (err) {
    console.warn("⚠️ groqPriority error:", err);
    return "moderate";
  }
}
