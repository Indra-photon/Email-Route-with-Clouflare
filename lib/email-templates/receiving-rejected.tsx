import * as React from "react";

interface ReceivingRejectedEmailProps {
  userName: string;
  domain: string;
  requestId: string;
  rejectionReason: string;
  reviewedAt: string;
  reviewedBy: string;
  dashboardUrl: string;
}

export const ReceivingRejectedEmail: React.FC<
  Readonly<ReceivingRejectedEmailProps>
> = ({ userName, domain, requestId, rejectionReason, reviewedAt, reviewedBy, dashboardUrl }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ color: "#dc2626" }}>
          Receiving Request for {domain} - Update Needed
        </h2>

        <p>Hi {userName},</p>

        <p>
          We've reviewed your request for email receiving on:
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
        </div>

        <div style={{
          backgroundColor: "#fef2f2",
          borderLeft: "4px solid #dc2626",
          padding: "15px",
          margin: "20px 0"
        }}>
          <p style={{ margin: "0", color: "#991b1b" }}>
            <strong>Status:</strong> Additional information needed
          </p>
          <p style={{ margin: "10px 0 0 0", color: "#991b1b" }}>
            <strong>Reason:</strong>
          </p>
          <p style={{ margin: "5px 0 0 0", color: "#7f1d1d" }}>
            {rejectionReason}
          </p>
        </div>

        <p>
          Please reply to this email to discuss next steps, or contact our support team for assistance.
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

        <div style={{
          backgroundColor: "#f9fafb",
          padding: "15px",
          borderRadius: "6px",
          fontSize: "14px",
          color: "#6b7280"
        }}>
          <p style={{ margin: "5px 0" }}>
            <strong>Reviewed:</strong> {reviewedAt}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Reviewed by:</strong> {reviewedBy}
          </p>
        </div>

        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "20px" }}>
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

export default ReceivingRejectedEmail;
