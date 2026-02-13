export interface Env {
  ALIAS_CONFIG_CACHE: KVNamespace;
  SYNC_SECRET: string;
}

type Target = {
  type: "slack" | "discord";
  webhookUrl: string;
};

type AliasConfig = {
  workspaceId: string;
  targets: Target[];
};

function formatMessage(params: {
  to: string;
  from?: string;
  subject?: string;
  text?: string;
}) {
  const { to, from, subject, text } = params;
  const snippet = text ? text.slice(0, 280) : "";

  return {
    slack: `📧 New email to *${to}*\n*From:* ${from ?? "Unknown"}\n*Subject:* ${
      subject ?? "(no subject)"
    }\n\n${snippet}`,
    discord: `📧 **New email to ${to}**\n**From:** ${from ?? "Unknown"}\n**Subject:** ${
      subject ?? "(no subject)"
    }\n\n${snippet}`,
  };
}

async function handleSyncAlias(request: Request, env: Env): Promise<Response> {
  const providedSecret = request.headers.get("X-Sync-Secret");
  if (!providedSecret || providedSecret !== env.SYNC_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as {
    domain: string;
    localPart: string;
    workspaceId: string;
    targets: Target[];
  };

  if (!body.domain || !body.localPart) {
    return new Response("domain and localPart are required", { status: 400 });
  }

  const key = `${body.domain.toLowerCase()}:${body.localPart.toLowerCase()}`;
  const config: AliasConfig = {
    workspaceId: body.workspaceId,
    targets: body.targets ?? [],
  };

  await env.ALIAS_CONFIG_CACHE.put(key, JSON.stringify(config));

  return new Response("OK", { status: 200 });
}

async function postToSlack(target: Target, message: string): Promise<void> {
  await fetch(target.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: message }),
  });
}

async function postToDiscord(target: Target, message: string): Promise<void> {
  await fetch(target.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: message }),
  });
}

async function handleEmail(request: Request, env: Env): Promise<Response> {
  // NOTE: Cloudflare Email Routing's exact payload can vary; this assumes
  // a JSON body with at least { to, from, subject, text, html }.
  // You may need to adjust field names based on the final configuration.
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const toValue = (payload.to ?? payload.rcpt_to) as string | string[] | undefined;
  const to = Array.isArray(toValue) ? toValue[0] : toValue;

  if (!to) {
    return new Response("Missing recipient", { status: 400 });
  }

  const address = to.toString().trim().toLowerCase();
  const atIndex = address.indexOf("@");
  if (atIndex === -1) {
    return new Response("Invalid recipient", { status: 400 });
  }

  const localPart = address.slice(0, atIndex);
  const domain = address.slice(atIndex + 1);
  const key = `${domain}:${localPart}`;

  const stored = await env.ALIAS_CONFIG_CACHE.get(key);
  if (!stored) {
    // For the MVP it's fine to accept the message but do nothing.
    return new Response("No alias config", { status: 200 });
  }

  const config = JSON.parse(stored) as AliasConfig;
  if (!config.targets || config.targets.length === 0) {
    return new Response("No targets configured", { status: 200 });
  }

  const formatted = formatMessage({
    to: address,
    from: payload.from as string | undefined,
    subject: payload.subject as string | undefined,
    text: payload.text as string | undefined,
  });

  await Promise.all(
    config.targets.map((t) => {
      if (t.type === "slack") {
        return postToSlack(t, formatted.slack);
      }
      if (t.type === "discord") {
        return postToDiscord(t, formatted.discord);
      }
      return Promise.resolve();
    })
  );

  return new Response("OK", { status: 200 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/sync-alias" && request.method === "POST") {
      return handleSyncAlias(request, env);
    }

    if (request.method === "POST") {
      return handleEmail(request, env);
    }

    return new Response("Not Found", { status: 404 });
  },
};

