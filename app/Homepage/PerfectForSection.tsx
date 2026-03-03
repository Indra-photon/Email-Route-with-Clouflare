"use client";

import React from "react";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { motion } from "motion/react";

const userTypes = [
  {
    title: "Solo Developers",
    description: "Ship faster without the support overhead. Handle customer inquiries while staying in flow—no context switching, no separate tools.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    highlights: [
      "Zero setup time",
      "One-person support team",
      "Focus on building, not managing"
    ],
    gradient: "from-cyan-500 to-sky-500"
  },
  {
    title: "Small Teams",
    description: "Scale your support without scaling your headcount. Collaborate seamlessly in Slack—assign tickets, share context, and resolve issues together.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    highlights: [
      "Built for collaboration",
      "Shared visibility",
      "Instant team coordination"
    ],
    gradient: "from-sky-500 to-cyan-500"
  },
  {
    title: "Growing Startups",
    description: "Enterprise-level support without the enterprise price tag. Scale from 10 to 10,000 customers with the same elegant workflow.",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    highlights: [
      "Unlimited scalability",
      "Advanced routing",
      "Custom workflows"
    ],
    gradient: "from-cyan-400 to-sky-600"
  }
];

export function PerfectForSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-white">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Heading as="h2" className="text-neutral-900 mb-4">
              Perfect for teams of <span className="text-sky-800">any size</span>
            </Heading>
            <Paragraph variant="home-par" className="max-w-3xl mx-auto">
              Whether you're shipping solo or scaling fast, our platform adapts to your workflow—not the other way around.
            </Paragraph>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full bg-white rounded-2xl border-2 border-neutral-200 p-8 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg">
                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${type.gradient} text-white mb-6`}>
                  {type.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold font-schibsted text-neutral-900 mb-3">
                  {type.title}
                </h3>
                
                <p className="text-base font-schibsted text-neutral-600 mb-6 leading-relaxed">
                  {type.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3">
                  {type.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg 
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 text-sky-600`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium font-schibsted text-neutral-700">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${type.gradient} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-lg font-schibsted text-neutral-600 mb-6">
            Join <span className="font-semibold text-sky-800">500+ teams</span> who've made the switch
          </p>
          <button className="px-8 py-4 bg-neutral-900 text-white font-schibsted font-semibold text-lg rounded-xl transition-all duration-200 hover:bg-neutral-800 hover:shadow-lg">
            Start Free Trial
          </button>
        </motion.div>
      </Container>
    </section>
  );
}
