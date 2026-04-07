import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { CustomLink } from "@/components/CustomLink";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ metric, label }: { metric: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-sky-200 pl-5 py-1">
      <span className="font-schibsted text-3xl sm:text-4xl font-semibold text-sky-800 tabular-nums leading-none">
        {metric}
      </span>
      <span className="font-schibsted text-sm text-neutral-500 leading-snug">
        {label}
      </span>
    </div>
  );
}

// ─── Feature row ──────────────────────────────────────────────────────────────
function FeatureRow({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-12 py-10">
      <Heading as="h3" variant="small" className="text-neutral-900 font-semibold leading-snug">
        {title}
      </Heading>
      <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
        {body}
      </Paragraph>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="flex flex-col gap-24">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <Container className="max-w-7xl mx-auto pt-20">
          <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-5">
            About SyncSupport
          </p>
          <div className="">
            <Heading as="h1" className="text-neutral-900 leading-tight mb-6">
              We built the support tool{" "}
              <span className="text-sky-800">we couldn't find anywhere.</span>
            </Heading>
            <Paragraph variant="home-par" className="text-neutral-600">
              Small teams don't need a help desk. They need their customer
              emails to show up where the team already lives — in Slack.
              SyncSupport does exactly that, and nothing more.
            </Paragraph>
          </div>
        </Container>

        {/* ── The Problem ───────────────────────────────────────────────────── */}
        <Container>
          <div className="">
            <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
              The problem
            </p>
            <Heading as="h2" className="text-neutral-900 leading-tight mb-6">
              Shared inboxes are broken.{" "}
              <span className="text-neutral-400">We fixed them.</span>
            </Heading>

            <div className="space-y-5">
              <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
                If your team uses{" "}
                <span className="font-semibold text-neutral-800">support@yourcompany.com</span>,
                you already know the problem. Emails sit in a shared Gmail tab
                that nobody owns. Two agents reply to the same customer. Urgent
                tickets get missed because someone forgot to check. Your team
                spends half the day switching between email and Slack just to
                stay coordinated.
              </Paragraph>

              <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
                Traditional solutions make it worse.{" "}
                <CustomLink
                  href="/about#zendesk-alternative"
                  className="text-sky-700 hover:text-sky-900 font-medium underline underline-offset-2"
                >
                  Zendesk costs $55 per agent per month
                </CustomLink>{" "}
                and takes weeks to configure. Front charges $19 per seat. Help
                Scout is another separate tool your team has to learn and
                remember to check. For a 5-person team, you're paying hundreds
                of dollars a month for software that adds friction instead of
                removing it.
              </Paragraph>

              <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
                We asked a simple question: what if customer emails just showed
                up in Slack, like any other message? That's SyncSupport. Route{" "}
                <span className="font-semibold text-neutral-800">support@</span>,{" "}
                <span className="font-semibold text-neutral-800">billing@</span>,{" "}
                <span className="font-semibold text-neutral-800">sales@</span> — or
                any alias — directly to dedicated Slack channels. Your team
                claims tickets, replies, and resolves them without ever opening
                their email client. Setup takes five minutes. No training
                required.
              </Paragraph>
            </div>
          </div>
        </Container>

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        {/* <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCard metric="2–5s" label="Email to Slack notification" />
            <StatCard metric="5 min" label="Average setup time" />
            <StatCard metric="$0" label="Extra cost per team member" />
            <StatCard metric="500+" label="Teams already using SyncSupport" />
          </div>
        </Container> */}

        {/* ── What We Do ────────────────────────────────────────────────────── */}
        <Container>
          <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
            What we do
          </p>
          <Heading as="h2" className="text-neutral-900 leading-tight mb-3">
            One platform for every customer conversation.
          </Heading>
          <Paragraph variant="home-par" className="text-neutral-500 mb-12">
            SyncSupport is built around one workflow: a customer message arrives,
            your team sees it instantly in Slack, someone claims it, and it gets
            resolved in minutes — not hours.
          </Paragraph>

          <div className="divide-y divide-neutral-100">
            <FeatureRow
              title="Email-to-Slack routing that works in seconds"
              body={
                <>
                  Customer sends an email to your support address. Within 2–5
                  seconds, it appears as a formatted Slack message in the right
                  channel. Your team sees the sender, subject, and full email
                  body without leaving Slack. No polling. No forwarding rules.
                  No shared inbox. Just instant delivery to the people who need
                  to act on it. Learn more on our{" "}
                  <CustomLink
                    href="/docs"
                    className="text-sky-700 hover:text-sky-900 font-medium underline underline-offset-2"
                  >
                    docs
                  </CustomLink>
                  .
                </>
              }
            />

            <FeatureRow
              title="Claim tickets so nothing gets worked on twice"
              body="When a Slack message arrives, any team member can claim it with a single click. The ticket is immediately marked as owned — the rest of the team sees who's handling it and moves on. No duplicate replies. No 'did anyone get back to this?' threads. Complete accountability with zero overhead."
            />

            <FeatureRow
              title="Reply to customers directly from Slack"
              body="Hit reply inside Slack and your response lands in the customer's inbox as a proper email — from your domain, in your name. No context switching to Gmail or Outlook. No copy-pasting. Your team closes the loop entirely from within their existing workspace."
            />

            <FeatureRow
              title="Live chat with file support — all into Slack"
              body="Embed our chat widget on your website in one line of code. Customer messages — including file attachments like PDFs and images — arrive in the same Slack channel as your emails. One queue, one workflow, one place to respond. No separate chat dashboard to monitor."
            />

            <FeatureRow
              title="Ticket status your whole team can see"
              body="Every ticket moves through Open → In Progress → Resolved. Status updates are visible to everyone in the channel. Managers get a real-time picture of what's been handled and what's still waiting — without interrupting anyone to ask."
            />

            <FeatureRow
              title="Analytics that tell you what's actually happening"
              body="See average response times, ticket volume by alias, per-agent activity, and 7-day or 30-day trends. Know which email alias is getting hammered. Know which team member is carrying the load. Know where your process is slowing down — before a customer complains about it."
            />
          </div>

          <div className="mt-10">
            <CustomLink
              href="/#features"
              className="inline-flex items-center font-schibsted text-sm font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-4"
            >
              View all features
            </CustomLink>
          </div>
        </Container>

        {/* ── Who It's For ──────────────────────────────────────────────────── */}
        <Container>
          <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
            Who it's for
          </p>
          <Heading as="h2" className="text-neutral-900 leading-tight mb-4">
            Built for teams that work in Slack and care about response time.
          </Heading>
          <Paragraph variant="default" className="text-neutral-600 leading-relaxed mb-10">
            SyncSupport was designed for small-to-medium SaaS companies,
            agencies, and startups with 2–50 people on their support team.
            Three types of teams get the most out of it:
          </Paragraph>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                role: "Support managers",
                body: "You need visibility — who's handling what, how fast, and whether anything is falling through the cracks. Our analytics dashboard gives you that picture at a glance, without building reports or exporting CSV files.",
              },
              {
                role: "Founders & solo operators",
                body: "You can't check email every five minutes. With SyncSupport, urgent customer issues arrive as Slack notifications — the same way you already get pinged about everything else that matters. Start solo, add team later.",
              },
              {
                role: "Support agents",
                body: "You live in Slack all day and hate switching tools. With SyncSupport, you never have to. Claim, read, reply, resolve — all inside Slack. Canned responses mean you're never starting from a blank screen.",
              },
            ].map(({ role, body }) => (
              <div
                key={role}
                className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col gap-3"
              >
                <Heading as="h3" variant="small" className="text-sky-800 font-semibold">
                  {role}
                </Heading>
                <Paragraph variant="default" className="text-neutral-600 text-sm leading-relaxed">
                  {body}
                </Paragraph>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <CustomLink
              href="/sign-up"
              className="inline-flex items-center font-schibsted text-sm font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-4"
            >
              Start your free trial
            </CustomLink>
          </div>
        </Container>

        {/* ── Why Not Zendesk ───────────────────────────────────────────────── */}
        <Container>
          <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
            How we compare
          </p>
          <Heading as="h2" className="text-neutral-900 leading-tight mb-6">
            Why teams switch from Zendesk, Front, and Help Scout.
          </Heading>

          <div className="space-y-5">
            <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
              The tools people search for when their shared inbox breaks are
              usually Zendesk, Front, or Help Scout. All three are built for
              large enterprise support teams. They're powerful, expensive, and
              complex — and for most growing companies, they're overkill.
            </Paragraph>

            <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
              Zendesk starts at $55 per agent per month. Front is $19 per seat
              with a minimum team size. Help Scout is better-priced but still a
              separate tool your team has to check, log into, and learn. All
              three add a new system to your workflow instead of improving the
              one you already have.
            </Paragraph>

            <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
              SyncSupport is different in four ways. First, it's{" "}
              <span className="font-semibold text-neutral-800">Slack-native</span> —
              your team never leaves the tool they're already using. Second,{" "}
              <span className="font-semibold text-neutral-800">
                flat-rate pricing
              </span>{" "}
              — add unlimited team members without your bill going up. Third,{" "}
              <span className="font-semibold text-neutral-800">
                setup takes five minutes
              </span>
              , not five days. Fourth, it handles the exact workflow most small
              teams actually need: email comes in, someone replies, ticket is
              closed.
            </Paragraph>

            <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
              If you need SLA automation, multi-brand portals, or AI-powered
              ticket deflection at enterprise scale, Zendesk is the right tool.
              If you need your customer emails handled fast by a small team that
              works in Slack, SyncSupport is.
            </Paragraph>
          </div>

          <div className="mt-8">
            <CustomLink
              href="/pricing"
              className="inline-flex items-center font-schibsted text-sm font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-4"
            >
              See our pricing
            </CustomLink>
          </div>
        </Container>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        {/* <Container>
          <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
            Common questions
          </p>
          <Heading as="h2" className="text-neutral-900 leading-tight mb-10 max-w-xl">
            Everything you wanted to ask.
          </Heading>

          <div className="max-w-3xl divide-y divide-neutral-200">
            {[
              {
                q: "Can I reply to customer emails from Slack?",
                a: "Yes. SyncSupport lets you reply directly from Slack. Your reply lands in the customer's inbox as a proper email from your domain. No switching to Gmail or Outlook.",
              },
              {
                q: "Does SyncSupport support live chat on my website?",
                a: "Yes. Embed our chat widget in one line of code. Customer messages — including PDFs and images they send — appear in your Slack channel in real time alongside your email tickets.",
              },
              {
                q: "How long does setup take?",
                a: "Most teams are receiving tickets in Slack within 5 minutes of signing up. Connect Slack, add your domain, create an email alias. No engineering work required.",
              },
              {
                q: "Do I pay per team member?",
                a: "No. SyncSupport uses flat-rate pricing. Add as many team members as you need — your bill stays the same. Plans start from $19/month.",
              },
              {
                q: "Does it work with Discord too?",
                a: "Yes. SyncSupport supports both Slack and Discord. Connect whichever workspace your team already uses.",
              },
              {
                q: "What happens if two agents try to reply to the same ticket?",
                a: "When someone claims a ticket in Slack, it's immediately marked as owned and visible to the whole team. No duplicate replies, no confusion about who's handling what.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-6">
                <Heading as="h3" variant="small" className="text-neutral-900 font-semibold mb-2">
                  {q}
                </Heading>
                <Paragraph variant="default" className="text-neutral-600 leading-relaxed">
                  {a}
                </Paragraph>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <CustomLink
              href="/docs"
              className="inline-flex items-center font-schibsted text-sm font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-4"
            >
              Read the full docs
            </CustomLink>
          </div>
        </Container> */}

        {/* ── Closing CTA ───────────────────────────────────────────────────── */}
        <Container className="pb-20 md:pb-28">
          <div className="max-w-2xl">
            <Heading as="h2" className="text-neutral-900 leading-tight mb-4">
              Stop managing support in your inbox.
            </Heading>
            <Paragraph variant="home-par" className="text-neutral-600 mb-8">
              Your team is already in Slack. Your customers deserve a response
              in minutes, not hours. SyncSupport connects the two — instantly,
              simply, and without per-seat pricing that punishes you for growing.
            </Paragraph>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <CustomLink
                href="/sign-up"
                className="px-7 py-3.5 bg-neutral-900 text-white font-schibsted font-semibold text-sm rounded-xl hover:bg-neutral-800 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Get started free
              </CustomLink>
              <CustomLink
                href="/docs"
                className="px-7 py-3.5 border border-neutral-200 text-neutral-700 font-schibsted font-semibold text-sm rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition-colors duration-200"
              >
                Read the docs
              </CustomLink>
            </div>
          </div>
        </Container>

        <Footer />

      </section>
    </div>
  );
}
