"use client";

import React from "react";

const features = [
  {
    id: 1,
    title: "Smart email routing to Slack channels",
    description: "Automatically route support@, billing@, and sales@ emails to dedicated Slack channels. Never miss an inquiry.",
    image: null, // Add your image path here
  },
  {
    id: 2,
    title: "Live chat widget with instant Slack notifications",
    description: "Embed a chat widget on your website. Customer messages appear instantly in Slack for real-time responses.",
    image: null,
  },
  {
    id: 3,
    title: "Discord and Slack integrations",
    description: "Connect both Discord and Slack workspaces. Manage all customer conversations from one unified platform.",
    image: null,
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Heading */}
        <h2 className="text-3xl lg:text-4xl font-schibsted font-semibold tracking-tight leading-tight mb-8 lg:mb-12 text-neutral-900">
          Everything you need to scale support.
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative flex flex-col min-h-[280px] lg:min-h-[340px] rounded-lg overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-colors duration-200 bg-neutral-50"
            >
              {/* Text Content - Absolute positioned at top */}
              <div className="absolute top-0 left-0 right-0 p-6 lg:p-8 z-10">
                <h3 className="text-lg lg:text-2xl font-schibsted font-semibold tracking-tight mb-2 text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-sm lg:text-base font-schibsted font-normal text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Image/Visual - Full height */}
              <div className="h-full flex items-end justify-center p-6">
                {feature.image ? (
                  <img
                    alt={feature.title}
                    src={feature.image}
                    className="w-full h-auto object-contain rounded"
                  />
                ) : (
                  // Placeholder gradient if no image
                  <div className="w-full h-40 bg-gradient-to-br from-sky-100 via-cyan-50 to-neutral-100 rounded-lg" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}