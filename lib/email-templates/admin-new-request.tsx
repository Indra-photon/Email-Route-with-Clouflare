import * as React from "react";

interface AdminNewRequestEmailProps {
  domain: string;
  requestedBy: string;
  workspace: string;
  requestedAt: string;
  reviewUrl: string;
}

export const AdminNewRequestEmail: React.FC<
  Readonly<AdminNewRequestEmailProps>
> = ({ domain, requestedBy, workspace, requestedAt, reviewUrl }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ color: "#7c3aed" }}>
          🔔 New Receiving Request: {domain}
        </h2>

        <p>A new receiving request has been submitted.</p>

        <div style={{
          backgroundColor: "#faf5ff",
          border: "1px solid #c084fc",
          padding: "15px",
          borderRadius: "8px",
          margin: "20px 0"
        }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#6b21a8" }}>
            Request Details
          </h3>
          <p style={{ margin: "5px 0" }}>
            <strong>Domain:</strong> {domain}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Requested by:</strong> {requestedBy}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Workspace:</strong> {workspace}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Requested:</strong> {requestedAt}
          </p>
        </div>

        <div style={{ margin: "30px 0" }}>
          <a
            href={reviewUrl}
            style={{
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            Review Request Now
          </a>
        </div>

        <hr style={{ borderTop: "1px solid #e5e7eb", margin: "30px 0" }} />

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          This is an automated notification from the Email Router admin system.
        </p>
      </div>
    </body>
  </html>
);

export default AdminNewRequestEmail;
