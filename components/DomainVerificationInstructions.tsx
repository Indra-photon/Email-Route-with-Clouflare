"use client";

import { DNSRecord, type DNSRecordData } from "@/components/DNSRecord";

interface DomainVerificationInstructionsProps {
  domainName: string;
  dnsRecords: DNSRecordData[];
  className?: string;
}

export function DomainVerificationInstructions({
  domainName,
  dnsRecords,
  className,
}: DomainVerificationInstructionsProps) {
  if (!dnsRecords?.length) {
    return (
      <div className={className}>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No DNS records yet. Add this domain to Resend first, then return here to see the records to add at your DNS provider.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        DNS records to add
      </h3>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-pretty">
        Add these records at your domain provider (e.g. Cloudflare, Namecheap, GoDaddy). Use the Copy button for each value.
      </p>
      <ul className="space-y-3 list-none p-0 m-0">
        {dnsRecords.map((r, i) => (
          <li key={`${r.record}-${r.name}-${i}`}>
            <DNSRecord record={r} domainName={domainName} />
          </li>
        ))}
      </ul>
    </div>
  );
}
