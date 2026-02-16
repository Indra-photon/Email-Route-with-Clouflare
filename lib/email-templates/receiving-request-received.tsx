import * as React from "react";

interface ReceivingRequestReceivedEmailProps {
  userName: string;
  domain: string;
  requestId: string;
  requestedAt: string;
  dashboardUrl: string;
}

export const ReceivingRequestReceivedEmail: React.FC<
  Readonly<ReceivingRequestReceivedEmailProps>
> = ({ userName, domain, requestId, requestedAt, dashboardUrl }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ color: "#2563eb" }}>
          Your Receiving Request for {domain} is Being Reviewed
        </h2>

        <p>Hi {userName},</p>

        <p>
          We've received your request to enable email receiving for:
        </p>

        <div style={{
          backgroundColor: "#f3f4f6",
          padding: "15px",
          borderRadius: "8px",
          margin: "20px 0"
        }}>
          <p style={{ margin: "5px 0" }}>
            <strong>Domain:</strong> {domain}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Request ID:</strong> #{requestId}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Requested:</strong> {requestedAt}
          </p>
        </div>

        <p>
          Our team will review your request and enable receiving within 1-2 hours during business hours.
        </p>

        <p>
          You'll receive another email with MX records once your request is approved.
        </p>

        <div style={{ margin: "30px 0" }}>
          <a
            href={dashboardUrl}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            View in Dashboard
          </a>
        </div>

        <hr style={{ borderTop: "1px solid #e5e7eb", margin: "30px 0" }} />

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Questions? Reply to this email and we'll be happy to help.
        </p>

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          Best,<br />
          The Team
        </p>
      </div>
    </body>
  </html>
);

export default ReceivingRequestReceivedEmail;
