// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";

// export interface DNSRecordData {
//   record: string;
//   name: string;
//   type: string;
//   value?: string;
//   status: string;
//   priority?: number;
// }

// interface DNSRecordProps {
//   record: DNSRecordData;
//   domainName: string;
//   className?: string;
// }

// export function DNSRecord({ record, domainName, className }: DNSRecordProps) {
//   const [copied, setCopied] = useState(false);

//   const displayName = record.name === "@" || !record.name ? domainName : `${record.name}.${domainName}`;
//   const valueToCopy = record.value ?? "";
//   const displayValue = valueToCopy.length > 60 ? valueToCopy.slice(0, 60) + "…" : valueToCopy;

//   const handleCopy = async () => {
//     if (!valueToCopy) return;
//     try {
//       await navigator.clipboard.writeText(valueToCopy);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch {
//       setCopied(false);
//     }
//   };

//   return (
//     <div
//       className={className}
//       data-record-type={record.record}
//       data-dns-type={record.type}
//     >
//       <div className="flex flex-wrap items-center justify-between gap-2 border border-neutral-200 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-700">
//         <div className="flex flex-wrap items-center gap-2">
//           <span className="font-medium text-neutral-800 dark:text-neutral-200">
//             {record.record} ({record.type})
//           </span>
//           <VerificationStatusBadge status={record.status} />
//         </div>
//         <div className="text-sm text-neutral-600 dark:text-neutral-400">
//           <span className="font-medium">Name:</span> {displayName}
//           {record.priority != null && (
//             <span className="ml-2">
//               <span className="font-medium">Priority:</span> {record.priority}
//             </span>
//           )}
//         </div>
//         {valueToCopy && (
//           <div className="w-full flex flex-wrap items-center gap-2 mt-2">
//             <code className="flex-1 min-w-0 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 truncate">
//               {displayValue}
//             </code>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={handleCopy}
//               aria-label="Copy value"
//             >
//               {copied ? "Copied!" : "Copy"}
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VerificationStatusBadge } from "@/components/VerificationStatusBadge";

export interface DNSRecordData {
  record: string;
  name: string;
  type: string;
  value?: string;
  status: string;
  priority?: number;
  ttl?: string;
}

interface DNSRecordProps {
  record: DNSRecordData;
  domainName: string;
}

export function DNSRecord({ record, domainName }: DNSRecordProps) {
  const [copied, setCopied] = useState(false);

  const displayName = record.name === "@" || !record.name ? "@" : record.name;
  const valueToCopy = record.value ?? "";

  const handleCopy = async () => {
    if (!valueToCopy) return;
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <tr className="border-t border-neutral-200 dark:border-neutral-700">
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">{record.record}</span>
          <VerificationStatusBadge status={record.status} />
        </div>
      </td>
      <td className="px-4 py-3 text-sm font-mono text-neutral-700 dark:text-neutral-300">
        {displayName}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-medium">
          {record.type}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        {valueToCopy && (
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 max-w-md truncate">
              {valueToCopy}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? "✓" : "Copy"}
            </Button>
          </div>
        )}
      </td>
      {record.priority != null && (
        <td className="px-4 py-3 text-sm text-center">{record.priority}</td>
      )}
    </tr>
  );
}