import Link from "next/link";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

const LAST_UPDATED = "March 27, 2026";

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="mb-4 text-sm font-medium text-sky-600 font-schibsted">
            Legal
          </p>
          <Heading as="h1" className="mb-4 text-neutral-900">
            Terms and Conditions
          </Heading>
          <Paragraph className="text-neutral-600">
            Last updated: {LAST_UPDATED}
          </Paragraph>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <div className="space-y-12">

          {/* Intro */}
          <div className="space-y-4">
            <Paragraph className="text-neutral-700 leading-relaxed">
              These Terms and Conditions (&quot;Agreement&quot;) set out the specific rules,
              responsibilities, and obligations that apply to your use of
              syncsupport. This Agreement works alongside our{" "}
              <Link
                href="/terms-of-service"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                Privacy Policy
              </Link>
              , which are incorporated herein by reference.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              By using syncsupport you confirm that you have read, understood,
              and agree to be bound by this Agreement in full.
            </Paragraph>
          </div>

          <Divider />

          {/* Section 1 */}
          <Section number="1" title="Definitions">
            <ul className="space-y-4 text-neutral-700 font-schibsted text-base">
              {[
                {
                  term: "Platform",
                  def: "The syncsupport web application, APIs, and related services.",
                },
                {
                  term: "User",
                  def: 'Any individual or entity that registers for or accesses the Platform ("you").',
                },
                {
                  term: "Workspace",
                  def: "The isolated environment created for each registered user within the Platform.",
                },
                {
                  term: "Alias",
                  def: "An email address configured within your Workspace to route inbound emails to a connected integration.",
                },
                {
                  term: "Integration",
                  def: "A connected third-party channel such as Slack or Discord to which email notifications are delivered.",
                },
                {
                  term: "Content",
                  def: "Any data, text, or information you submit to or process through the Platform, including inbound email content.",
                },
              ].map(({ term, def }) => (
                <li key={term} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-sky-600" />
                  <span>
                    <span className="font-semibold text-neutral-900">
                      {term}
                    </span>{" "}
                    — {def}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Divider />

          {/* Section 2 */}
          <Section number="2" title="User Responsibilities">
            <Paragraph className="text-neutral-700 leading-relaxed">
              As a User of the Platform, you are solely responsible for:
            </Paragraph>
            <ul className="space-y-3 text-neutral-700 font-schibsted text-base">
              {[
                "Ensuring all email aliases and domains you configure are ones you own or are authorised to use",
                "Maintaining the security of your Slack or Discord webhook URLs stored in the Platform",
                "Ensuring your use of the Platform complies with all applicable laws, including data protection laws in your jurisdiction",
                "Obtaining any necessary consents from your customers before processing their email communications through the Platform",
                "The accuracy and legality of any replies sent to customers via the Platform",
                "Keeping your account credentials secure and not sharing them with unauthorised parties",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-sky-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Divider />

          {/* Section 3 */}
          <Section number="3" title="Platform Usage Rules">
            <SubHeading>Email Volume</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              Free plan accounts are subject to email volume limits as published on
              our pricing page. Exceeding these limits may result in delayed delivery
              or temporary suspension of email routing until the next billing cycle.
            </Paragraph>

            <SubHeading>Domain Verification</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              You must complete DNS verification for any domain you add to the
              Platform. We reserve the right to disable unverified domains after
              a reasonable grace period. You are responsible for maintaining valid
              DNS records for the duration of your use.
            </Paragraph>

            <SubHeading>Webhook Integrity</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              You are responsible for ensuring that Slack or Discord webhook URLs
              configured in your Workspace remain valid and active. We are not liable
              for missed notifications caused by expired, deleted, or revoked webhooks.
            </Paragraph>

            <SubHeading>API Usage</SubHeading>
            <Paragraph className="text-neutral-700 leading-relaxed">
              If you access the Platform via API, you must not exceed the rate limits
              documented in our developer documentation. Automated abuse of the API
              may result in immediate account suspension.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 4 */}
          <Section number="4" title="Content & Data">
            <Paragraph className="text-neutral-700 leading-relaxed">
              You retain full ownership of all Content you process through the
              Platform. You grant syncsupport a limited, non-exclusive,
              royalty-free licence to store, process, and transmit your Content
              solely as required to deliver the service.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              You represent and warrant that:
            </Paragraph>
            <ul className="space-y-3 text-neutral-700 font-schibsted text-base">
              {[
                "You have all necessary rights to submit Content to the Platform",
                "Your Content does not violate the intellectual property rights of any third party",
                "Your Content does not contain malicious code, spam, or unlawful material",
                "You have obtained all required consents to process personal data contained in customer emails",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-sky-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Divider />

          {/* Section 5 */}
          <Section number="5" title="Service Availability & SLA">
            <Paragraph className="text-neutral-700 leading-relaxed">
              We aim to maintain high availability of the Platform but do not
              guarantee any specific uptime SLA on free or early-stage paid plans.
              Planned maintenance will be communicated in advance where possible.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              We are not liable for any loss or damage caused by Platform downtime,
              delayed email delivery, or disruption of third-party services such as
              Slack, Discord, or Resend that are outside our direct control.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 6 */}
          <Section number="6" title="Fees & Subscription Terms">
            <Paragraph className="text-neutral-700 leading-relaxed">
              All fees are exclusive of applicable taxes unless stated otherwise.
              You are responsible for paying any taxes applicable in your jurisdiction.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              Subscriptions renew automatically at the end of each billing period.
              You must cancel before the renewal date to avoid being charged for the
              next period. Details of how to cancel are available in your account
              settings.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              In the event of a failed payment, we will attempt to retry the charge
              up to three times over seven days. If payment remains unsuccessful,
              your account may be downgraded to the free plan and paid features
              suspended until payment is resolved.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 7 */}
          <Section number="7" title="Confidentiality">
            <Paragraph className="text-neutral-700 leading-relaxed">
              Each party agrees to keep confidential any non-public information
              disclosed by the other party in connection with the use of the Platform
              (&quot;Confidential Information&quot;). Neither party shall disclose Confidential
              Information to third parties without prior written consent, except as
              required by law.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              This obligation does not apply to information that is or becomes
              publicly available through no fault of the receiving party, or that
              was already known to the receiving party prior to disclosure.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 8 */}
          <Section number="8" title="Indemnification">
            <Paragraph className="text-neutral-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless syncsupport and
              its officers, directors, employees, and agents from and against any
              claims, liabilities, damages, losses, and expenses (including reasonable
              legal fees) arising out of or in connection with:
            </Paragraph>
            <ul className="space-y-3 text-neutral-700 font-schibsted text-base">
              {[
                "Your use of the Platform in violation of these Terms and Conditions",
                "Your Content or the processing of customer emails through your Workspace",
                "Your violation of any applicable law or the rights of a third party",
                "Any misrepresentation made by you in connection with the Platform",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-sky-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Divider />

          {/* Section 9 */}
          <Section number="9" title="Modifications to the Platform">
            <Paragraph className="text-neutral-700 leading-relaxed">
              We reserve the right to add, modify, or remove features from the
              Platform at any time. We will endeavour to communicate significant
              changes in advance via email or in-app notifications. Continued use
              of the Platform following any modification constitutes your acceptance
              of the updated Platform.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 10 */}
          <Section number="10" title="Suspension & Termination">
            <Paragraph className="text-neutral-700 leading-relaxed">
              We may suspend or terminate your access to the Platform immediately
              and without notice if:
            </Paragraph>
            <ul className="space-y-3 text-neutral-700 font-schibsted text-base">
              {[
                "You breach any provision of this Agreement or our Terms of Service",
                "We are required to do so by law or a regulatory authority",
                "Your use of the Platform poses a security or legal risk to us or other users",
                "You fail to pay any outstanding fees after reasonable notice",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 flex-shrink-0 rounded-full bg-sky-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Paragraph className="text-neutral-700 leading-relaxed mt-4">
              Upon termination, all licences granted to you under this Agreement
              cease immediately. Sections relating to intellectual property,
              confidentiality, indemnification, and limitation of liability survive
              termination.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 11 */}
          <Section number="11" title="Entire Agreement">
            <Paragraph className="text-neutral-700 leading-relaxed">
              This Agreement, together with our{" "}
              <Link
                href="/terms-of-service"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-sky-600 hover:text-sky-700 transition-colors"
              >
                Privacy Policy
              </Link>
              , constitutes the entire agreement between you and syncsupport
              with respect to your use of the Platform and supersedes all prior
              agreements, representations, and understandings.
            </Paragraph>
            <Paragraph className="text-neutral-700 leading-relaxed">
              If any provision of this Agreement is found to be unenforceable, the
              remaining provisions will continue in full force and effect.
            </Paragraph>
          </Section>

          <Divider />

          {/* Section 12 */}
          <Section number="12" title="Contact Us">
            <Paragraph className="text-neutral-700 leading-relaxed">
              For questions or concerns about these Terms and Conditions, please
              reach out:
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
                  href="/terms-of-service"
                  className="text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </Paragraph>
            </div>
          </Section>

        </div>
      </section>
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