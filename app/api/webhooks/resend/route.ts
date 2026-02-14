// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import { Alias } from "@/app/api/models/AliasModel";

// export async function POST(request: Request) {
//   try {
//     // 1. Parse Resend webhook payload
//     const payload = await request.json();
    
//     console.log("📧 Received email webhook from Resend:", {
//       type: payload.type,
//       to: payload.data?.to,
//       from: payload.data?.from,
//     });

//     // 2. Verify it's an email.received event
//     if (payload.type !== "email.received") {
//       console.log("⚠️ Ignoring non-email event:", payload.type);
//       return NextResponse.json({ message: "Event ignored" });
//     }

//     const emailData = payload.data;
    
//     // 3. Extract recipient email
//     const recipientEmail = Array.isArray(emailData.to) 
//       ? emailData.to[0] 
//       : emailData.to;

//     if (!recipientEmail) {
//       console.error("❌ No recipient email found");
//       return NextResponse.json({ error: "No recipient" }, { status: 400 });
//     }

//     // 4. Parse email address (support@acme.com → support + acme.com)
//     const emailLower = recipientEmail.toLowerCase().trim();
//     const atIndex = emailLower.indexOf("@");
    
//     if (atIndex === -1) {
//       console.error("❌ Invalid email format:", emailLower);
//       return NextResponse.json({ error: "Invalid email" }, { status: 400 });
//     }

//     const localPart = emailLower.slice(0, atIndex);
//     const domainPart = emailLower.slice(atIndex + 1);

//     console.log("🔍 Looking up alias:", { localPart, domain: domainPart });

//     // 5. Look up alias in MongoDB
//     await dbConnect();
    
//     const alias = await Alias.findOne({ 
//       localPart: localPart,
//       email: emailLower 
//     })
//       .populate("domainId")
//       .populate("integrationId")
//       .lean()
//       .exec();

//     if (!alias) {
//       console.warn("⚠️ No alias found for:", emailLower);
//       return NextResponse.json({ message: "Alias not found" }, { status: 200 });
//     }

//     console.log("✅ Found alias:", alias.email);

//     // 6. Check if integration exists
//     const integration = (alias as any).integrationId;
    
//     if (!integration || !integration.webhookUrl) {
//       console.warn("⚠️ No integration configured for alias:", alias.email);
//       return NextResponse.json({ message: "No integration" }, { status: 200 });
//     }

//     // 7. Format message for Slack/Discord
//     const fromEmail = emailData.from || "Unknown";
//     const subject = emailData.subject || "(no subject)";
//     const textBody = emailData.text || emailData.html || "";
//     const snippet = textBody.slice(0, 500); // First 500 chars

//     const messagePayload = integration.type === "slack" 
//       ? {
//           // Slack format
//           text: `📧 New email to *${emailLower}*\n*From:* ${fromEmail}\n*Subject:* ${subject}\n\n${snippet}`
//         }
//       : {
//           // Discord format
//           content: `📧 **New email to ${emailLower}**\n**From:** ${fromEmail}\n**Subject:** ${subject}\n\n${snippet}`
//         };

//     console.log("📤 Posting to", integration.type, "webhook");

//     // 8. Post to Slack/Discord
//     const webhookResponse = await fetch(integration.webhookUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(messagePayload),
//     });

//     if (!webhookResponse.ok) {
//       console.error("❌ Webhook post failed:", webhookResponse.status);
//       return NextResponse.json(
//         { error: "Webhook failed" }, 
//         { status: 500 }
//       );
//     }

//     console.log("✨ Successfully posted to", integration.type);

//     return NextResponse.json({ 
//       success: true,
//       message: "Email routed to integration"
//     });

//   } catch (error) {
//     console.error("❌ Error processing webhook:", error);
//     return NextResponse.json(
//       { error: "Internal error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Alias } from "@/app/api/models/AliasModel";
import { Domain } from "@/app/api/models/DomainModel";
import { Integration } from "@/app/api/models/IntegrationModel";

export async function POST(request: Request) {
  try {
    // 1. Parse Resend webhook payload
    const payload = await request.json();
    
    console.log("📧 Received email webhook from Resend:", {
      type: payload.type,
      to: payload.data?.to,
      from: payload.data?.from,
      subject: payload.data?.subject,
    });

    // 2. Verify it's an email.received event
    if (payload.type !== "email.received") {
      console.log("⚠️ Ignoring non-email event:", payload.type);
      return NextResponse.json({ message: "Event ignored" });
    }

    const emailData = payload.data;
    
    // 3. Extract recipient email
    const recipientEmail = Array.isArray(emailData.to) 
      ? emailData.to[0] 
      : emailData.to;

    if (!recipientEmail) {
      console.error("❌ No recipient email found");
      return NextResponse.json({ error: "No recipient" }, { status: 400 });
    }

    // 4. Parse email address (support@acme.com → support + acme.com)
    const emailLower = recipientEmail.toLowerCase().trim();
    const atIndex = emailLower.indexOf("@");
    
    if (atIndex === -1) {
      console.error("❌ Invalid email format:", emailLower);
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const localPart = emailLower.slice(0, atIndex);
    const domainPart = emailLower.slice(atIndex + 1);

    console.log("🔍 Looking up alias:", { localPart, domain: domainPart, email: emailLower });

    // 5. Look up alias in MongoDB
    await dbConnect();
    
    const alias = await Alias.findOne({ 
      localPart: localPart,
      email: emailLower 
    })
      .populate("domainId")
      .populate("integrationId")
      .lean()
      .exec();

    if (!alias) {
      console.warn("⚠️ No alias found for:", emailLower);
      return NextResponse.json({ message: "Alias not found" }, { status: 200 });
    }

    console.log("✅ Found alias:", alias.email);

    // 6. Check if integration exists
    const integration = (alias as any).integrationId;
    
    if (!integration || !integration.webhookUrl) {
      console.warn("⚠️ No integration configured for alias:", alias.email);
      return NextResponse.json({ message: "No integration" }, { status: 200 });
    }

    // 7. Format message for Slack/Discord
    const fromEmail = emailData.from || "Unknown";
    const subject = emailData.subject || "(no subject)";
    
    // Try multiple possible body fields from Resend
    // Resend may send body in different formats depending on email type
    const textBody = 
      emailData.text || 
      emailData.html || 
      emailData.parsedData?.textBody || 
      emailData.parsedData?.htmlBody ||
      emailData.body?.text ||
      emailData.body?.html ||
      "";
      
    const snippet = textBody.slice(0, 500); // First 500 chars

    // Debug log to see what fields Resend is sending
    console.log("📝 Email body extraction:", {
      hasText: !!emailData.text,
      hasHtml: !!emailData.html,
      hasParsedText: !!emailData.parsedData?.textBody,
      hasParsedHtml: !!emailData.parsedData?.htmlBody,
      hasBodyText: !!emailData.body?.text,
      hasBodyHtml: !!emailData.body?.html,
      bodyLength: snippet.length,
      bodyPreview: snippet.slice(0, 100),
    });

    const messagePayload = integration.type === "slack" 
      ? {
          // Slack format
          text: `📧 New email to *${emailLower}*\n*From:* ${fromEmail}\n*Subject:* ${subject}\n\n${snippet}`
        }
      : {
          // Discord format
          content: `📧 **New email to ${emailLower}**\n**From:** ${fromEmail}\n**Subject:** ${subject}\n\n${snippet}`
        };

    console.log("📤 Posting to", integration.type, "webhook");

    // 8. Post to Slack/Discord
    const webhookResponse = await fetch(integration.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messagePayload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("❌ Webhook post failed:", {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        error: errorText,
      });
      return NextResponse.json(
        { error: "Webhook failed" }, 
        { status: 500 }
      );
    }

    console.log("✨ Successfully posted to", integration.type);

    return NextResponse.json({ 
      success: true,
      message: "Email routed to integration"
    });

  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}