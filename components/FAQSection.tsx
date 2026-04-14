"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import Link from "next/link";
import { IconArrowUp } from "@tabler/icons-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// ── 6 highest-value questions only — rest live at /faq ────────────────────────
const faqs: FAQItem[] = [
  {
    id: "1",
    question: "How quickly do emails arrive in Slack?",
    answer: "Emails are routed to your Slack channel in 2–5 seconds on average. Your team sees new customer messages the moment they arrive — no polling, no delay."
  },
  {
    id: "2",
    question: "Do I need to change my email provider?",
    answer: "Not at all. Keep using Gmail, Zoho, Outlook, or any other provider. Simply set up email forwarding to your SyncSupport address. Emails arrive in both your inbox and Slack simultaneously."
  },
  {
    id: "3",
    question: "Can I reply to customers directly from Slack?",
    answer: "Yes. Claim a ticket with one click, then reply directly from Slack. Your customer receives the reply from your branded email address. Your team never has to open an email client."
  },
  {
    id: "4",
    question: "How many email aliases can I create?",
    answer: "Unlimited. Create support@, sales@, billing@, help@ — as many as you need on your verified domains. Each alias routes to a dedicated Slack channel so your team stays organised by function."
  },
  {
    id: "5",
    question: "How is pricing structured?",
    answer: "Flat-rate pricing — not per-user fees. You pay one monthly price regardless of how many team members use the workspace. Plans start at $19/month. No contracts, cancel anytime."
  },
  {
    id: "6",
    question: "Is my email data secure?",
    answer: "Yes. All data is encrypted in transit and at rest. We never read, analyse, or share your customer emails. Your data is yours — stored with strict access controls."
  },
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="w-full py-20 md:py-32 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* ── Left: heading + CTA ─────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-24"
            >
              <Heading as="h2" className="text-neutral-900 mb-4">
                Still searching for{" "}
                <span className="text-sky-800 font-extralight">answers?</span>
              </Heading>

              <Paragraph variant="home-par" className="mb-8">
                We've covered the essentials here. For a complete guide to setting up SyncSupport, managing tickets, and scaling your support operation, check out our comprehensive FAQ.
              </Paragraph>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* Contact Support — black button */}
                <div className="bg-gradient-to-b from-white/20 to-transparent rounded-[16px] inline-flex">
                  <a href="mailto:support@syncsupport.app" className="block">
                    <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-zinc-700 to-black shadow-[0_1px_2px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                      <div className="bg-gradient-to-b from-white/[0.08] to-transparent rounded-[8px] px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-schibsted font-semibold tracking-wide uppercase text-white text-sm">Contact Support</span>
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

                {/* View All — light button */}
                <div className=" rounded-[16px]  inline-flex">
                  <Link href="/frequently-asked-questions" className="block">
                    <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                      <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-[5px]">
                        <span className="font-schibsted font-semibold tracking-wide uppercase text-neutral-900 text-sm">All FAQs</span>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right: accordion ────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openItems.includes(faq.id);

                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full text-left py-6 flex items-start justify-between gap-4 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <Paragraph variant="home-par" className="text-neutral-900 font-schibsted flex-1 pr-4">
                        {faq.question}
                      </Paragraph>
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: [.25, .46, .45, .94] }}
                        >
                          <svg
                            className="w-6 h-6 text-sky-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                    </button>

                    {isOpen && (
                      <motion.div
                        key={faq.id + "-answer"}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1, transition: { duration: 0.2, ease: [.25, .46, .45, .94] } }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.1, ease: [.6, .04, .98, .335] } }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-10">
                          <Paragraph variant="home-par" className="text-neutral-700">
                            {faq.answer}
                          </Paragraph>
                        </div>
                      </motion.div>
                    )}

                    <div className="h-px bg-neutral-200" />
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}