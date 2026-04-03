import Link from "next/link";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Container } from "@/components/Container";

const LAST_UPDATED = "March 27, 2026";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-white py-16 md:py-24">
        <Container className="px-4 sm:px-6">
          <p className="mb-4 text-sm font-medium text-sky-600 font-schibsted">
            Legal
          </p>
          <Heading as="h1" className="mb-4 text-neutral-900">
            Terms of Service
          </Heading>
          <Paragraph className="text-neutral-600">
            Last updated: {LAST_UPDATED}
          </Paragraph>
        </Container>
      </section>

      {/* Content */}
      <Container className=" px-4 py-12 sm:px-6 md:py-16">
        <div className="space-y-12">

          {/* Intro */}
          <div className="space-y-4">
            <Paragraph className="text-neutral-700 leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) govern your access to and use of
              syncsupport (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), a Slack-native support ticket
              management platform. By creating an account or using the service, you
              agree to be bound by these Terms.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              If you are using syncsupport on behalf of an organisation, you
              represent that you have authority to bind that organisation to these
              Terms.
            </Paragraph>
          </div>

          <Divider />

          {/* Section 1 */}
          <Section number="1" title="Acceptance of Terms">
            <Paragraph className="text-neutral-700 leading-relaxed">
              By accessing or using syncsupport, you confirm that you are at least
              16 years of age, have read and understood these Terms, and agree to be
              legally bound by them. If you do not agree, you must not use the service.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We reserve the right to update these Terms at any time. We will notify
              you of material changes via email or an in-app notice. Continued use
              after the effective date of any change constitutes your acceptance of
              the revised Terms.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 2 */}
          <Section number="2" title="Description of Service">
            <Paragraph className="text-neutral-700 leading-relaxed">
              syncsupport is a platform that routes inbound support emails to your
              connected Slack or Discord workspace, enabling your team to claim,
              track, and respond to customer tickets without leaving Slack.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We may modify, suspend, or discontinue any part of the service at any
              time with reasonable notice. We will not be liable to you or any third
              party for any such modification, suspension, or discontinuation.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 3 */}
          <Section number="3" title="Account Registration">
            <Paragraph className="text-neutral-700 leading-relaxed">
              You must register for an account to use syncsupport. You agree to
              provide accurate, current, and complete information during registration
              and to keep your account information up to date.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              You are responsible for maintaining the confidentiality of your login
              credentials and for all activity that occurs under your account. Notify
              us immediately at{" "}
              <a
                href="mailto:support@syncsupport.com"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                support@syncsupport.com
              </a>{" "}
              if you suspect any unauthorised access.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We use Clerk for authentication. Your account credentials are managed
              by Clerk and subject to their separate terms and privacy policy.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 4 */}
          <Section number="4" title="Acceptable Use">
            <Paragraph className="text-neutral-700 leading-relaxed">
              You agree to use syncsupport only for lawful purposes and in
              accordance with these Terms. You must not:
            </Paragraph>
            <ul className="space-y-3 text-neutral-700 font-schibsted text-base">
              {[
                "Use the service to send spam, phishing emails, or any unsolicited bulk communications",
                "Attempt to gain unauthorised access to any part of the platform or its infrastructure",
                "Use the service to store or transmit malicious code, viruses, or harmful data",
                "Reverse engineer, decompile, or attempt to extract the source code of the platform",
                "Resell, sublicense, or commercialise access to the service without our written consent",
                "Use the service in a way that violates any applicable law or regulation",
                "Impersonate any person or entity or misrepresent your affiliation with any person or entity",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-sky-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Paragraph className="text-neutral-700 leading-relaxed mt-4">
              Violation of this section may result in immediate suspension or
              termination of your account without notice.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 5 */}
          <Section number="5" title="Billing & Payment">
            <SubHeading>Free Plan</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              syncsupport offers a free tier with usage limits. You may use the
              free plan indefinitely subject to those limits. We reserve the right to
              modify free plan limits with reasonable notice.
            </Paragraph>

            <SubHeading>Paid Plans</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              Paid plans are billed on a flat-rate monthly or annual basis. By
              subscribing to a paid plan, you authorise us to charge your payment
              method on a recurring basis until you cancel.
            </Paragraph>

            <SubHeading>Cancellation & Refunds</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              You may cancel your subscription at any time from your account settings.
              Cancellation takes effect at the end of your current billing period.
              We do not provide refunds for partial billing periods unless required
              by applicable law.
            </Paragraph>

            <SubHeading>Price Changes</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We may change our pricing at any time. We will give you at least 30
              days&apos; notice before any price increase takes effect for your existing
              subscription.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 6 */}
          <Section number="6" title="Intellectual Property">
            <Paragraph className="text-neutral-700 leading-relaxed">
              syncsupport and all related software, designs, trademarks, and
              content are the exclusive property of syncsupport and its licensors.
              Nothing in these Terms transfers any intellectual property rights to you.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              You retain all rights to the content you process through the platform
              (including email content). By using the service, you grant us a limited,
              non-exclusive licence to process that content solely to provide the
              service to you.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 7 */}
          <Section number="7" title="Third-Party Services">
            <Paragraph className="text-neutral-700 leading-relaxed">
              syncsupport integrates with third-party services including Slack,
              Discord, Resend, Clerk, MongoDB Atlas, and Vercel. Your use of those
              services is governed by their respective terms and privacy policies. We
              are not responsible for the practices or content of any third-party
              service.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 8 */}
          <Section number="8" title="Disclaimers">
            <Paragraph className="text-neutral-700 leading-relaxed">
              syncsupport is provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, either express or implied, including but not
              limited to warranties of merchantability, fitness for a particular
              purpose, or non-infringement.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We do not warrant that the service will be uninterrupted, error-free,
              or completely secure. You use the service at your own risk.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 9 */}
          <Section number="9" title="Limitation of Liability">
            <Paragraph className="text-neutral-700 leading-relaxed">
              To the fullest extent permitted by applicable law, syncsupport
              shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages, including loss of profits, data, or goodwill,
              arising out of or in connection with your use of the service.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              Our total aggregate liability to you for any claims arising under these
              Terms shall not exceed the greater of (a) the amount you paid us in the
              12 months preceding the claim, or (b) £100 GBP.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 10 */}
          <Section number="10" title="Termination">
            <Paragraph className="text-neutral-700 leading-relaxed">
              You may terminate your account at any time by deleting your account from
              the dashboard settings. We may suspend or terminate your account
              immediately if you breach these Terms or if we are required to do so
              by law.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              Upon termination, your right to use the service ceases immediately. We
              will delete your data in accordance with our{" "}
              <Link
                href="/privacy"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 11 */}
          <Section number="11" title="Governing Law">
            <Paragraph className="text-neutral-700 leading-relaxed">
              These Terms are governed by and construed in accordance with applicable
              law. Any disputes arising from these Terms or your use of the service
              shall be subject to the exclusive jurisdiction of the competent courts.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 12 */}
          <Section number="12" title="Contact Us">
            <Paragraph className="text-neutral-700 leading-relaxed">
              If you have questions about these Terms of Service, please contact us:
            </Paragraph>
            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6 space-y-2">
              <Paragraph className="text-neutral-900 font-medium">
                syncsupport
              </Paragraph>
              <Paragraph className="text-neutral-700">
                Email:{" "}
                <a
                  href="mailto:legal@syncsupport.com"
                  className="text-sky-600 hover:text-sky-700 transition-colors"
                >
                  legal@syncsupport.com
                </a>
              </Paragraph>
              <Paragraph className="text-neutral-700">
                Also see our{" "}
                <Link
                  href="/privacy"
                  className="text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Terms and Conditions
                </Link>
                .
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