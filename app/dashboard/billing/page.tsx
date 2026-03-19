import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import BillingPageContent from "./BillingPageContent";

export default function BillingPage() {
  return (
    <>
      <div className="mb-6">
        <Heading variant="muted" className="font-bold text-sky-950 dark:text-neutral-100">Billing</Heading>
        <Paragraph className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage your subscription, view usage, and upgrade your plan.
        </Paragraph>
      </div>

      <BillingPageContent />
    </>
  );
}
