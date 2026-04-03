import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

const LAST_UPDATED = "March 27, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <Container className="border-b border-neutral-200 bg-white py-16 md:py-24">
        <div className=" px-4 sm:px-6">
          <p className="mb-4 text-sm font-medium text-sky-600 font-schibsted">
            Legal
          </p>
          <Heading
            as="h1"
            className="mb-4 text-neutral-900"
          >
            Privacy Policy
          </Heading>
          <Paragraph className="text-neutral-600">
            Last updated: {LAST_UPDATED}
          </Paragraph>
        </div>
      </Container>

      {/* Content */}
      <Container className=" px-4 py-12 sm:px-6 md:py-16">
        <div className="space-y-12">

          {/* Intro */}
          <div className="space-y-4">
            <Paragraph className="text-neutral-700 leading-relaxed">
              syncsupport (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our platform — a Slack-native
              support ticket management system that routes incoming support emails
              directly to Slack.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              By accessing or using syncsupport, you agree to the practices
              described in this policy. If you do not agree, please discontinue use of
              the service.
            </Paragraph>
          </div>

          <Divider />

          {/* Section 1 */}
          <Section
            number="1"
            title="Information We Collect"
          >
            <SubHeading>Account Information</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              When you sign up, we collect your name, email address, and authentication
              credentials via Clerk, our third-party identity provider. We do not store
              raw passwords.
            </Paragraph>

            <SubHeading>Workspace & Configuration Data</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We store workspace settings you create, including domain configurations,
              email aliases, and integration webhook URLs (Slack/Discord). This data
              is necessary to operate the service.
            </Paragraph>

            <SubHeading>Email Content</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              To route support emails to Slack, we process inbound email content
              including sender addresses, subject lines, and email bodies. Email
              content is stored temporarily in our database to facilitate replies and
              maintain conversation history. We do not read your emails for advertising
              purposes.
            </Paragraph>

            <SubHeading>Usage Data</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We may collect standard server logs including IP addresses, browser type,
              pages visited, and timestamps to monitor performance and diagnose issues.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 2 */}
          <Section number="2" title="How We Use Your Information">
            <ul className="space-y-3 text-neutral-700 font-schibsted text-base">
              {[
                "To provide, operate, and maintain the syncsupport platform",
                "To process and route inbound emails to your connected Slack or Discord workspace",
                "To authenticate your identity and manage your account via Clerk",
                "To send transactional emails related to your account (e.g. billing, security alerts)",
                "To monitor and improve system performance and reliability",
                "To comply with legal obligations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 rounded-full bg-sky-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Divider />

          {/* Section 3 */}
          <Section number="3" title="Data Sharing & Disclosure">
            <Paragraph className="text-neutral-700 leading-relaxed">
              We do not sell your personal data. We may share your information only in
              the following circumstances:
            </Paragraph>

            <SubHeading>Service Providers</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We use trusted third-party services to operate the platform: Clerk
              (authentication), MongoDB Atlas (database), Resend (email infrastructure),
              and Vercel (hosting). Each provider processes only the data necessary
              for their function and is bound by their own privacy policies.
            </Paragraph>

            <SubHeading>Legal Requirements</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We may disclose your information if required by law, court order, or
              governmental authority, or if we believe disclosure is necessary to
              protect the rights, property, or safety of syncsupport, our users,
              or the public.
            </Paragraph>

            <SubHeading>Business Transfers</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your data may
              be transferred as part of that transaction. We will notify you via email
              or a prominent notice on our platform before such a transfer takes effect.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 4 */}
          <Section number="4" title="Data Retention">
            <Paragraph className="text-neutral-700 leading-relaxed">
              We retain your account and configuration data for as long as your account
              is active. Email content is retained for 90 days on the free plan, and
              up to 1 year on paid plans, after which it is automatically purged.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              You may request deletion of your data at any time by contacting us at{" "}
              <a
                href="mailto:privacy@syncsupport.com"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                privacy@syncsupport.com
              </a>
              . Deletion requests are processed within 30 days.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 5 */}
          <Section number="5" title="Cookies & Tracking">
            <Paragraph className="text-neutral-700 leading-relaxed">
              We use strictly necessary cookies to maintain your authenticated session.
              We do not use third-party advertising cookies or cross-site tracking
              technologies. You may disable cookies in your browser settings, but doing
              so may prevent you from logging in to the platform.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 6 */}
          <Section number="6" title="Your Rights">
            <Paragraph className="text-neutral-700 leading-relaxed">
              Depending on your location, you may have the following rights regarding
              your personal data:
            </Paragraph>
            <ul className="space-y-3 text-neutral-700 font-schibsted text-base">
              {[
                "Access — request a copy of the data we hold about you",
                "Correction — request correction of inaccurate or incomplete data",
                "Deletion — request erasure of your personal data",
                "Portability — request your data in a machine-readable format",
                "Objection — object to certain types of processing",
                "Withdrawal of consent — where processing is based on consent",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 rounded-full bg-sky-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Paragraph className="text-neutral-700 leading-relaxed mt-4">
              To exercise any of these rights, contact us at{" "}
              <a
                href="mailto:privacy@syncsupport.com"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                privacy@syncsupport.com
              </a>
              .
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 7 */}
          <Section number="7" title="Security">
            <Paragraph className="text-neutral-700 leading-relaxed">
              We implement industry-standard security measures including TLS encryption
              in transit, encrypted storage at rest, and access controls to protect
              your data. However, no system is completely secure, and we cannot
              guarantee absolute security.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 8 */}
          <Section number="8" title="Children's Privacy">
            <Paragraph className="text-neutral-700 leading-relaxed">
              syncsupport is not directed at children under the age of 16. We do
              not knowingly collect personal information from children. If you believe
              a child has provided us with personal data, please contact us and we will
              delete it promptly.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 9 */}
          <Section number="9" title="Changes to This Policy">
            <Paragraph className="text-neutral-700 leading-relaxed">
              We may update this Privacy Policy from time to time. When we do, we will
              revise the &quot;Last updated&quot; date at the top of this page and, where
              appropriate, notify you by email. Your continued use of the platform
              after changes constitutes acceptance of the updated policy.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 10 */}
          <Section number="10" title="Contact Us">
            <Paragraph className="text-neutral-700 leading-relaxed">
              If you have questions or concerns about this Privacy Policy or our data
              practices, please reach out:
            </Paragraph>
            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6 space-y-2">
              <Paragraph className="text-neutral-900 font-medium">
                syncsupport
              </Paragraph>
              <Paragraph className="text-neutral-700">
                Email:{" "}
                <a
                  href="mailto:privacy@syncsupport.com"
                  className="text-sky-600 hover:text-sky-700 transition-colors"
                >
                  privacy@syncsupport.com
                </a>
              </Paragraph>
            </div>
          </Section>

        </div>
      </Container>
    </main>
  );
}

// ── Local sub-components ───────────────────────────────────────────────────────

function Divider() {
  return <hr className="border-neutral-200" />;
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-xs font-semibold text-sky-600 font-schibsted">
          {number}
        </span>
        <Heading as="h2" className="text-xl text-neutral-900">
          {title}
        </Heading>
      </div>
      <div className="space-y-4 pl-10">{children}</div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <Heading as="h3" variant="muted" className="text-base text-neutral-800 mt-6 mb-2">
      {children}
    </Heading>
  );
}