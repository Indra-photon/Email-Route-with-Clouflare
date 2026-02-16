// Resend receiving MX records (hardcoded)
export const RESEND_RECEIVING_MX_RECORDS = [
  {
    type: "MX" as const,
    name: "@",
    priority: 10,
    value: "inbound-smtp.eu-west-1.amazonaws.com",
    ttl: "Auto",
  },
];

// Note: Add backup MX record here if Resend provides one