"use client";

import React, { useState } from "react";

const testimonials = [
  {
    id: 1,
    company: "TechFlow",
    logo: null, // Add logo path
    quote: "With Slack integration, our support response time dropped from hours to <strong>minutes</strong>. Our customers are happier than ever.",
    author: {
      name: "Sarah Chen",
      role: "Head of Customer Success",
      avatar: null, // Add avatar path
    },
  },
  {
    id: 2,
    company: "StartupHub",
    logo: null,
    quote: "We handle <strong>3x more tickets</strong> with the same team size. The Slack workflow is a game-changer for small support teams.",
    author: {
      name: "Mike Rodriguez",
      role: "VP of Operations",
      avatar: null,
    },
  },
  {
    id: 3,
    company: "GrowthCo",
    logo: null,
    quote: "Setup took literally <strong>5 minutes</strong>. Our entire team was responding to customers in Slack the same day.",
    author: {
      name: "Emma Thompson",
      role: "Support Lead",
      avatar: null,
    },
  },
];

const additionalCompanies = [
  { name: "CloudSync", logo: null },
  { name: "DevTools", logo: null },
  { name: "SupportPro", logo: null },
];

const featuredTestimonial = {
  company: "TechFlow",
  logo: null,
  quote: "TechFlow uses Slack integration to handle <strong>500+ support tickets per day with just 3 team members.</strong>",
  author: {
    name: "Sarah",
    role: "TechFlow",
    avatar: null,
  },
  video: {
    thumbnail: null, // Add video thumbnail
    url: null, // Add video URL
  },
};

export function TestimonialsSection() {
  const [activeCompany, setActiveCompany] = useState(0);

  return (
    <section className="w-full bg-white py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        {/* Section Heading */}
        <h2 className="text-3xl lg:text-4xl font-schibsted font-semibold tracking-tight leading-tight mb-8 text-neutral-900">
          Trusted by teams that value fast support.
        </h2>

        {/* Main Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-neutral-200 overflow-hidden rounded-t-lg">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`flex flex-col p-6 gap-4 ${
                index < testimonials.length - 1 ? 'border-b md:border-b-0 md:border-r' : ''
              } border-neutral-200`}
            >
              {/* Company Logo */}
              <div className="flex items-center gap-2 h-10">
                {testimonial.logo ? (
                  <img
                    alt={testimonial.company}
                    className="h-10 w-auto object-contain"
                    loading="lazy"
                    src={testimonial.logo}
                  />
                ) : (
                  <span className="text-xl font-schibsted font-semibold text-neutral-900">
                    {testimonial.company}
                  </span>
                )}
              </div>

              {/* Quote */}
              <p
                className="text-base font-schibsted font-normal leading-relaxed text-neutral-900 flex-1"
                dangerouslySetInnerHTML={{ __html: `"${testimonial.quote}"` }}
              />

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto pt-2">
                {testimonial.author.avatar ? (
                  <img
                    alt={testimonial.author.name}
                    className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                    src={testimonial.author.avatar}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-schibsted font-semibold leading-tight text-neutral-900">
                    {testimonial.author.name}
                  </p>
                  <p className="text-xs font-schibsted font-normal text-neutral-600">
                    {testimonial.author.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Companies + Featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-r border-b border-neutral-200 rounded-b-lg overflow-hidden">
          {/* Left Column - Company Buttons */}
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-neutral-200">
            {additionalCompanies.map((company, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveCompany(index)}
                className={`group flex items-center justify-between px-6 h-20 text-left transition-colors border-b border-neutral-200 cursor-pointer hover:bg-neutral-50 ${
                  activeCompany === index ? 'bg-neutral-50' : ''
                }`}
              >
                <div className="flex items-center">
                  {company.logo ? (
                    <img
                      alt={company.name}
                      className="h-8 w-auto object-contain"
                      loading="lazy"
                      src={company.logo}
                    />
                  ) : (
                    <span className="text-base font-schibsted font-semibold text-neutral-900">
                      {company.name}
                    </span>
                  )}
                </div>
                <div
                  className={`w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center flex-shrink-0 transition-opacity ${
                    activeCompany === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 12.3882C22 6.68671 17.5228 2.06474 12 2.06474C6.47715 2.06474 2 6.68671 2 12.3882C2 18.0897 6.47715 22.7117 12 22.7117C17.5228 22.7117 22 18.0897 22 12.3882Z"
                      stroke="#0c4a6e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 12.3882L16 12.3882"
                      stroke="#0c4a6e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16.5176L16 12.3882L12 8.25881"
                      stroke="#0c4a6e"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            ))}

            {/* More Stories Link */}
            <a
              href="#"
              className="group border-t border-neutral-200 px-6 h-20 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors"
            >
              <span className="text-lg font-schibsted font-semibold text-neutral-900">
                More customer stories
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 12.3882C22 6.68671 17.5228 2.06474 12 2.06474C6.47715 2.06474 2 6.68671 2 12.3882C2 18.0897 6.47715 22.7117 12 22.7117C17.5228 22.7117 22 18.0897 22 12.3882Z"
                    stroke="#0c4a6e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 12.3882L16 12.3882"
                    stroke="#0c4a6e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16.5176L16 12.3882L12 8.25881"
                    stroke="#0c4a6e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </a>
          </div>

          {/* Right Column - Featured Testimonial + Video */}
          <div className="md:col-span-2 flex flex-col md:flex-row py-8 px-6 md:px-8 md:items-stretch gap-6">
            {/* Text Content */}
            <div className="flex flex-col justify-between gap-6 md:w-1/2">
              <p
                className="text-lg lg:text-xl font-schibsted font-medium leading-snug text-neutral-900"
                dangerouslySetInnerHTML={{ __html: featuredTestimonial.quote }}
              />
              <div className="flex items-center gap-3 mt-auto">
                {featuredTestimonial.author.avatar ? (
                  <img
                    alt={featuredTestimonial.author.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                    src={featuredTestimonial.author.avatar}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex-shrink-0" />
                )}
                <div>
                  <p className="text-base font-schibsted font-semibold leading-tight text-neutral-900">
                    {featuredTestimonial.author.name}
                  </p>
                  <p className="text-sm font-schibsted font-normal text-neutral-500">
                    {featuredTestimonial.author.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Video Thumbnail */}
            <div className="relative md:w-1/2 overflow-hidden rounded-lg bg-neutral-100 aspect-video">
              {featuredTestimonial.video.thumbnail ? (
                <button
                  type="button"
                  className="absolute inset-0 z-10 w-full h-full group"
                  aria-label="Play video"
                >
                  <img
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                    src={featuredTestimonial.video.thumbnail}
                  />
                  <div className="absolute right-3 bottom-3 flex">
                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-5 h-5 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center">
                  <span className="text-sm font-schibsted font-medium text-neutral-500">
                    Video thumbnail
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}