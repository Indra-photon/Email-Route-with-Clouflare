import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import { Integration } from "@/app/api/models/IntegrationModel";
import { Workspace } from "@/app/api/models/WorkspaceModel";

// GET /api/integrations/slack/callback
// Slack redirects here after the user approves the OAuth screen.
// We exchange the code for a bot token, join the selected channel, and save the integration.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error"); // e.g. "access_denied"

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const redirectBase = `${siteUrl}/dashboard/integrations`;

  // User denied the OAuth screen
  if (error) {
    return NextResponse.redirect(`${redirectBase}?error=slack_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${redirectBase}?error=slack_invalid`);
  }

  // ── Verify signed state ──────────────────────────────────────────────────
  let userId: string;
  try {
    const decoded = Buffer.from(state, "base64url").toString();
    const dotIndex = decoded.lastIndexOf(".");
    const uid  = decoded.slice(0, dotIndex);
    const hmac = decoded.slice(dotIndex + 1);

    const expected = crypto
      .createHmac("sha256", process.env.SLACK_CLIENT_SECRET!)
      .update(uid)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) {
      throw new Error("Invalid state");
    }
    userId = uid;
  } catch {
    return NextResponse.redirect(`${redirectBase}?error=slack_invalid_state`);
  }

  // ── Exchange code for access token ──────────────────────────────────────
  const redirectUri = `${siteUrl}/api/integrations/slack/callback`;

  const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     process.env.SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      code,
      redirect_uri:  redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.ok) {
    console.error("Slack OAuth token exchange failed:", tokenData.error);
    return NextResponse.redirect(`${redirectBase}?error=slack_oauth_failed`);
  }

  const accessToken   = tokenData.access_token as string;          // xoxb-...
  const botUserId     = (tokenData.bot_user_id  as string) || "";
  const teamId        = (tokenData.team?.id     as string) || "";
  const teamName      = (tokenData.team?.name   as string) || "Slack";

  // incoming_webhook is populated because we requested the incoming-webhook scope.
  // It tells us which channel the user selected during OAuth.
  const channelId   = (tokenData.incoming_webhook?.channel_id as string) || "";
  const channelName = ((tokenData.incoming_webhook?.channel as string) || "").replace(/^#/, "");

  if (!accessToken || !channelId) {
    console.error("Slack OAuth: missing access_token or channel_id", tokenData);
    return NextResponse.redirect(`${redirectBase}?error=slack_missing_data`);
  }

  // ── Make the bot join the channel so it can receive message events ───────
  try {
    await fetch("https://slack.com/api/conversations.join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ channel: channelId }),
    });
  } catch (joinErr) {
    // Non-fatal: bot might already be in channel or it's a private channel.
    console.warn("Could not auto-join Slack channel:", joinErr);
  }

  // ── Save integration ────────────────────────────────────────────────────
  await dbConnect();

  const workspace = await Workspace.findOne({ ownerUserId: userId }).lean();
  if (!workspace) {
    return NextResponse.redirect(`${redirectBase}?error=no_workspace`);
  }

  await Integration.create({
    workspaceId:      workspace._id,
    type:             "slack",
    name:             `${teamName} · #${channelName}`,
    webhookUrl:       "",          // not used for OAuth integrations
    authMethod:       "oauth",
    slackAccessToken: accessToken,
    slackChannelId:   channelId,
    slackChannelName: channelName,
    slackTeamId:      teamId,
    slackTeamName:    teamName,
    slackBotUserId:   botUserId,
  });

  return NextResponse.redirect(`${redirectBase}?success=slack_connected`);
}
