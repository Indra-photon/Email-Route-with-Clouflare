import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import ProfilePageContent from "./ProfilePageContent";

export default function ProfilePage() {
  return (
    <>
      <div className="mb-6">
        <Heading variant="muted" className="font-bold text-sky-950 dark:text-neutral-100">
          Profile
        </Heading>
        <Paragraph className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage your account details, password, and connected accounts.
        </Paragraph>
      </div>

      <ProfilePageContent />
    </>
  );
}
