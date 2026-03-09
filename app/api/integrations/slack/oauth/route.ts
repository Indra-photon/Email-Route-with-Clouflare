import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";

// GET /api/integrations/slack/oauth
// Redirects the user to Slack's OAuth screen.
// After they pick a workspace + channel, Slack sends them back to /callback.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!clientId || !clientSecret || !siteUrl) {
    return NextResponse.json(
      { error: "Slack OAuth is not configured. Add SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, and NEXT_PUBLIC_SITE_URL to your environment." },
      { status: 500 }
    );
  }

  // Sign the state so the callback can verify it wasn't tampered with.
  // state = base64url( userId + "." + hmac(userId, clientSecret) )
  const hmac = crypto
    .createHmac("sha256", clientSecret)
    .update(userId)
    .digest("hex");
  const state = Buffer.from(`${userId}.${hmac}`).toString("base64url");

  const redirectUri = `${siteUrl}/api/integrations/slack/callback`;

  // Scopes needed:
  //   incoming-webhook  → shows channel picker on the OAuth consent screen
  //   chat:write        → bot can post messages
  //   channels:history  → bot can read channel messages (for event matching)
  //   channels:join     → bot can join public channels (needed to receive events)
  const scopes = "incoming-webhook,chat:write,channels:history,channels:join";

  const slackUrl = new URL("https://slack.com/oauth/v2/authorize");
  slackUrl.searchParams.set("client_id", clientId);
  slackUrl.searchParams.set("scope", scopes);
  slackUrl.searchParams.set("redirect_uri", redirectUri);
  slackUrl.searchParams.set("state", state);

  return NextResponse.redirect(slackUrl.toString());
}
