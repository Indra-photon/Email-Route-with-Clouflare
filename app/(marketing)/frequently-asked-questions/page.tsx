"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { CustomLink } from "@/components/CustomLink";
import { IconArrowUp } from "@tabler/icons-react";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const categories = [
  {
    id: "getting-started",
    label: "Getting Started",
    faqs: [
      {
        id: "gs-1",
        question: "What is SyncSupport?",
        answer:
          "SyncSupport is a customer support tool built inside Slack. It routes your support emails to Slack channels, lets your team handle live chat from the website, track tickets, send canned responses, and reply to customers — all without leaving Slack.",
      },
      {
        id: "gs-2",
        question: "How long does setup take?",
        answer:
          "Most teams are up and running in under 5 minutes. Connect your Slack workspace, add your domain, set up your email aliases, and you're live. No complex configuration, no training required.",
      },
      {
        id: "gs-3",
        question: "Do I need to change my email provider?",
        answer:
          "Not at all. You can keep using Gmail, Zoho, Outlook, or any other provider. Simply set up email forwarding to your SyncSupport address. Emails arrive in both your inbox and your Slack channel simultaneously.",
      },
      {
        id: "gs-4",
        question: "Can I use my own custom domain?",
        answer:
          "Yes. Add and verify your own domain inside SyncSupport and we'll provide DNS instructions to configure your MX records. You can also start immediately using our test domain while DNS propagates.",
      },
      {
        id: "gs-5",
        question: "What do I need to get started?",
        answer:
          "A Slack workspace and a support email address. That's it. No technical knowledge required — if you can set up a Slack channel, you can set up SyncSupport.",
      },
    ],
  },
  {
    id: "features",
    label: "Features",
    faqs: [
      {
        id: "feat-1",
        question: "How quickly do emails arrive in Slack?",
        answer:
          "Emails are routed to your Slack channel in 2–5 seconds on average. SyncSupport is built for real-time — your team sees new customer messages the moment they arrive.",
      },
      {
        id: "feat-2",
        question: "How many email aliases can I create?",
        answer:
          "You can create unlimited email aliases on your verified domains — support@, sales@, billing@, help@, and more. Each alias routes to a dedicated Slack channel so your team stays organised by function.",
      },
      {
        id: "feat-3",
        question: "Can I reply to customers directly from Slack?",
        answer:
          "Yes. Claim a ticket with one click, then reply directly from Slack. Your customer receives the reply from your branded email address. Your team never has to open an email client.",
      },
      {
        id: "feat-4",
        question: "What are canned responses?",
        answer:
          "Canned responses are pre-written reply templates for your most common questions. Instead of typing the same answer ten times a day, your team picks a template and sends it in one click. You can create unlimited templates and organise them by category.",
      },
      {
        id: "feat-5",
        question: "Does SyncSupport support live chat on my website?",
        answer:
          "Yes. Embed a live chat widget on your website in minutes. When a visitor starts a chat, it appears in your Slack channel in real time. Your team replies from Slack — no extra tool, no new tab.",
      },
      {
        id: "feat-6",
        question: "Can multiple team members handle the same inbox?",
        answer:
          "Yes. All teammates in the Slack channel can see incoming tickets. Anyone can claim a ticket to assign it to themselves, preventing duplicate replies. Team visibility is real-time — everyone always knows what's being handled.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing & Plans",
    faqs: [
      {
        id: "price-1",
        question: "How is pricing structured?",
        answer:
          "SyncSupport uses flat-rate pricing — not per-user fees. You pay one monthly price regardless of how many team members use the workspace. Plans start at $19/month for the Starter plan, $59/month for Growth, and $159/month for Scale.",
      },
      {
        id: "price-2",
        question: "Is there a free trial?",
        answer:
          "Yes. You can start with our free tier to test email routing and basic ticket handling before committing to a paid plan. No credit card required to get started.",
      },
      {
        id: "price-3",
        question: "Can I cancel anytime?",
        answer:
          "Yes. No contracts, no lock-in. Cancel from your dashboard at any time and your subscription ends at the close of the current billing period.",
      },
      {
        id: "price-4",
        question: "How does SyncSupport compare to Zendesk or Front?",
        answer:
          "SyncSupport is purpose-built for teams already living in Slack. Zendesk and Front require your team to context-switch into a separate tool. SyncSupport is 3–10x cheaper, takes minutes to set up rather than days, and has zero per-user fees — making it ideal for startups and growing teams.",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Reliability",
    faqs: [
      {
        id: "sec-1",
        question: "Is my email data secure?",
        answer:
          "Yes. All data is encrypted in transit and at rest. Email content is stored with strict access controls and we never read, analyse, or share your customer emails. Your data is yours.",
      },
      {
        id: "sec-2",
        question: "What happens if a Slack notification fails?",
        answer:
          "SyncSupport uses retry logic with exponential backoff. If a notification fails to deliver, the system retries automatically multiple times before alerting you. No messages are silently dropped.",
      },
      {
        id: "sec-3",
        question: "What is your uptime guarantee?",
        answer:
          "We target 99.9% uptime. Our infrastructure is built on reliable cloud providers with redundancy at every layer. Status and incident history are available on our status page.",
      },
    ],
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { id: string; question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full text-left py-5 flex items-start justify-between gap-4 group"
      >
        <Paragraph
          variant="home-par"
          className="text-neutral-900 font-schibsted font-medium flex-1 pr-4 group-hover:text-sky-800 transition-colors duration-150"
        >
          {faq.question}
        </Paragraph>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex-shrink-0 mt-0.5"
        >
          <svg
            className={`w-5 h-5 transition-colors duration-150 ${isOpen ? "text-sky-700" : "text-neutral-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-10">
              <Paragraph variant="home-par" className="text-neutral-600 leading-relaxed">
                {faq.answer}
              </Paragraph>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const currentCategory = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="bg-white">
      <section className="flex flex-col">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div className="border-b border-neutral-200">
          <Container className="pt-20 pb-12">
            <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-5">
              Support
            </p>
            <div className="">
              <Heading as="h1" className="text-neutral-900 leading-tight mb-4">
                Frequently asked{" "}
                <span className="text-sky-800 font-extralight">questions.</span>
              </Heading>
              <Paragraph variant="home-par" className="text-neutral-600">
                Everything you need to know about SyncSupport — the customer
                support tool built inside Slack. Can't find your answer?{" "}
                <CustomLink
                  href="mailto:support@syncsupport.app"
                  className="text-sky-700 font-medium hover:text-sky-800 transition-colors underline underline-offset-2"
                >
                  Email our team
                </CustomLink>
              </Paragraph>
            </div>
          </Container>
        </div>

        {/* ── Body: sidebar + accordion ──────────────────────────────────────── */}
        <Container className="py-16">
  <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

    {/* ── All questions ─────────────────────────────────────────────────── */}
    <div className="flex-1 min-w-0 space-y-4">
      {categories.map((cat) => (
        <div key={cat.id} id={cat.id}>

          {/* Category H2 — anchor + AI signal */}
          <Heading
            as="h2"
            variant="muted"
            className="text-sky-900 font-schibsted font-extralight mb-6 pb-4 border-b border-neutral-200"
          >
            {cat.label}
          </Heading>

          <div>
            {cat.faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openItems.includes(faq.id)}
                onToggle={() => toggleItem(faq.id)}
              />
            ))}
          </div>

        </div>
      ))}
    </div>

    {/* ── Category nav ──────────────────────────────────────────────── */}
    <aside className="lg:w-56 shrink-0">
      <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
        Jump to
      </p>
      <nav className="flex flex-row lg:flex-col gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="w-full text-left py-2.5 rounded-lg font-schibsted text-sm font-medium text-neutral-400 hover:text-sky-900 transition-colors duration-100 group"
          >
            {cat.label}
            <span className="ml-4 text-xs font-normal text-neutral-900 bg-neutral-200 px-2 py-1 rounded-full group-hover:bg-sky-900 group-hover:text-white transition-colors duration-150">
              {cat.faqs.length}
            </span>
          </button>
        ))}
      </nav>
    </aside>

  </div>
</Container>

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <div className="border-t border-neutral-200 bg-neutral-50">
          <Container className="py-16 text-center">
            <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-sky-600 mb-4">
              Ready to get started?
            </p>
            <Heading as="h2" className="text-neutral-900 font-light tracking-tighter leading-tight mb-4">
              Handle customer support{" "}
              <span className="text-sky-800">without leaving Slack.</span>
            </Heading>
            <Paragraph variant="home-par" className="text-neutral-600 mb-8">
              Join teams who route their customer support through Slack.
              Five minutes to set up. No per-user fees.
            </Paragraph>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* <Link
                href="/sign-up"
                className="px-7 py-3.5 bg-neutral-900 text-white font-schibsted font-semibold text-sm rounded-xl hover:bg-neutral-800 transition-colors duration-200 shadow-sm"
              >
                Get started free
              </Link> */}
            <div className="flex justify-center items-center gap-12 h-full">
            <div className="bg-gradient-to-b from-white/20 to-transparent rounded-[16px] inline-flex">
                  <a href="/sign-up" className="block">
                    <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-zinc-700 to-black shadow-[0_1px_2px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                      <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[8px] px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-schibsted font-semibold tracking-wide uppercase text-white text-sm">Get started</span>
                          <div className="relative flex items-center justify-center w-5 h-5">
                            {/* hover bg pill */}
                            <span className="absolute inset-0 rounded-full bg-white/0 backdrop-blur-0 group-hover:bg-white/20 group-hover:backdrop-blur-sm transition-all duration-150 ease-out" />
                            {/* icon */}
                            <IconArrowUp
                              size={13}
                              stroke={2.5}
                              className="relative text-white rotate-90 transition-transform duration-100 ease-out group-hover:rotate-45"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  </a>
                </div>
            </div>

              <div className=" rounded-[16px]  inline-flex">
                  <Link href="/pricing" className="block">
                    <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                      <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-[6px]">
                        <span className="font-schibsted font-semibold tracking-wide uppercase text-neutral-900 text-sm">View pricing</span>
                      </div>
                    </button>
                  </Link>
                </div>
            </div>
          </Container>
        </div>

        <Footer />
      </section>
    </div>
  );
}