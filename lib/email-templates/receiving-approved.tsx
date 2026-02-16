import * as React from "react";

interface MxRecord {
  type: string;
  name: string;
  value: string;
  priority: number;
  ttl: string;
}

interface ReceivingApprovedEmailProps {
  userName: string;
  domain: string;
  mxRecords: MxRecord[];
  dashboardUrl: string;
}

export const ReceivingApprovedEmail: React.FC<
  Readonly<ReceivingApprovedEmailProps>
> = ({ userName, domain, mxRecords, dashboardUrl }) => {
  const mxRecordsHtml = mxRecords
    .map(
      (record) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #e5e7eb;">${record.type}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: 'Courier New', monospace;">${record.name}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: 'Courier New', monospace;">${record.value}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${record.priority}</td>
      <td style="padding: 8px; border: 1px solid #e5e7eb;">${record.ttl}</td>
    </tr>
  `
    )
    .join("");

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          <h2 style={{ color: "#16a34a" }}>
            ✅ Receiving Enabled for {domain}
          </h2>

          <p>Hi {userName},</p>

          <p>Great news! Email receiving has been enabled for your domain:</p>

          <div style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #86efac",
            padding: "15px",
            borderRadius: "8px",
            margin: "20px 0"
          }}>
            <p style={{ margin: "5px 0", color: "#166534" }}>
              <strong>Domain:</strong> {domain}
            </p>
          </div>

          <h3 style={{ color: "#2563eb", marginTop: "30px" }}>
            MX Records to Add
          </h3>

          <p>
            Add these MX records at your DNS provider to start receiving emails:
          </p>

          <div dangerouslySetInnerHTML={{ __html: `
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <thead style="background-color: #f3f4f6;">
                <tr>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Type</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Name</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Value</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">Priority</th>
                  <th style="padding: 8px; border: 1px solid #e5e7eb; text-align: left;">TTL</th>
                </tr>
              </thead>
              <tbody>
                ${mxRecordsHtml}
              </tbody>
            </table>
          ` }} />

          <h3 style={{ marginTop: "30px" }}>Next Steps:</h3>

          <ol style={{ lineHeight: "1.8" }}>
            <li>Login to your DNS provider (GoDaddy, Cloudflare, etc.)</li>
            <li>Add the MX records shown above</li>
            <li>Wait 10-30 minutes for DNS propagation</li>
            <li>Test by sending an email to your domain</li>
          </ol>

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
};

export default ReceivingApprovedEmail;
