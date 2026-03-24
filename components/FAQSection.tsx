"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "How quickly will I receive notifications in Slack?",
    answer: "Emails are routed to your Slack workspace in 2-5 seconds on average. Our infrastructure is designed for real-time notifications, ensuring your team never misses a customer message."
  },
  {
    id: "2",
    question: "Can I use my own custom domain?",
    answer: "Yes! You can add and verify your own custom domains. We provide simple DNS instructions to help you set up MX records. You can also use our test domain (galearen.resend.app) to get started immediately."
  },
  {
    id: "3",
    question: "Do I need to change my email provider?",
    answer: "Not at all! You can keep using your current email provider (Gmail, Zoho, Outlook) and simply set up email forwarding. This way, emails go to both your inbox AND Slack, giving you the best of both worlds."
  },
  {
    id: "4",
    question: "How many email aliases can I create?",
    answer: "You can create unlimited email aliases (support@, sales@, help@, etc.) on your verified domains. Each alias can be routed to a different Slack channel for organized team workflows."
  },
  {
    id: "5",
    question: "Is my email data secure?",
    answer: "Absolutely. We use industry-standard encryption for data in transit and at rest. Email content is stored in MongoDB Atlas with secure access controls, and we never read or analyze your customer emails."
  },
  {
    id: "6",
    question: "Can I reply to emails from Slack?",
    answer: "This feature is coming in Phase 2 of our roadmap! Soon you'll be able to claim tickets, reply directly from Slack, and track conversation status - all without leaving your workspace."
  },
  {
    id: "7",
    question: "What happens if a Slack notification fails?",
    answer: "We're implementing retry logic with exponential backoff to ensure reliable delivery. If a notification fails, the system will automatically retry multiple times before alerting you."
  },
  {
    id: "8",
    question: "How is pricing structured?",
    answer: "We use flat-rate pricing instead of per-user fees, making it predictable and affordable for growing teams. Pricing details will be announced soon - we're committed to being 3-10x cheaper than competitors like Front or Help Scout."
  }
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
          {/* Left Side - Heading and Description */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-24"
            >
              <Heading as="h2" className="text-neutral-900 mb-4">
                Questions? <span className="text-sky-800">We've got answers.</span>
              </Heading>
              
              <Paragraph variant="home-par" className="mb-8">
                Everything you need to know about routing your support emails to Slack. Can't find what you're looking for? Reach out to our team.
              </Paragraph>

              {/* CTA */}
              <div className="space-y-4">
                <p className="text-sm font-schibsted font-medium text-neutral-600">
                  Still have questions?
                </p>
                <a
                  href="mailto:support@galearen.resend.app"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-schibsted font-semibold text-base rounded-xl transition-all duration-200 hover:bg-neutral-800 hover:shadow-lg"
                >
                  Contact Support
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Side - FAQ Accordion */}
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

                    {/* Subtle divider */}
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