"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-schibsted font-bold tracking-tight text-neutral-900 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-base font-schibsted font-normal text-neutral-600 max-w-2xl mx-auto">
            Everything you need to know about routing your support emails to Slack. 
            Can't find what you're looking for? Reach out to our team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-200">
          {faqs.map((faq) => {
            const isOpen = openItems.includes(faq.id);
            
            return (
              <div key={faq.id} className="group">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-neutral-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-schibsted font-semibold text-neutral-900 flex-1">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-neutral-500 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pt-0">
                    <p className="text-sm font-schibsted font-normal text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm font-schibsted font-normal text-neutral-600 mb-3">
            Still have questions?
          </p>
          <a
            href="mailto:support@galearen.resend.app"
            className="inline-flex items-center gap-2 text-sm font-schibsted font-semibold text-sky-700 hover:text-sky-800 transition-colors"
          >
            Contact our support team
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}