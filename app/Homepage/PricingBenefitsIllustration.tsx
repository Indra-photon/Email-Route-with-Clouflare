'use client';

import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";

interface BenefitItem {
  icon: React.ReactNode;
  text: string;
  color: string;
}

export const PricingBenefitsIllustration: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const benefits: BenefitItem[] = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
      ),
      text: "No per-seat pricing",
      color: "text-emerald-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 12h3.5" />
          <path d="M12 7v5" />
        </svg>
      ),
      text: "15min setup time",
      color: "text-blue-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
          <path d="M4 13h16" />
          <path d="M9 4v9" />
        </svg>
      ),
      text: "Works in your workspace",
      color: "text-purple-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v18h18" />
          <path d="M20 18v3" />
          <path d="M16 16v5" />
          <path d="M12 13v8" />
          <path d="M8 16v5" />
          <path d="M3 11c6 0 5 -5 9 -5s3 5 9 5" />
        </svg>
      ),
      text: "Real-time analytics",
      color: "text-amber-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 9h8" />
          <path d="M8 13h6" />
          <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
        </svg>
      ),
      text: "Easy chatbot setup",
      color: "text-sky-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M9 12l2 2l4 -4" />
        </svg>
      ),
      text: "No credit card required",
      color: "text-rose-600",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [benefits.length]);

  const getPosition = (index: number) => {
    const diff = index - currentIndex;
    const total = benefits.length;
    
    // Normalize difference to be between -total/2 and total/2
    let normalizedDiff = diff;
    if (normalizedDiff > total / 2) normalizedDiff -= total;
    if (normalizedDiff < -total / 2) normalizedDiff += total;
    
    return normalizedDiff;
  };

  return (
    <div className="relative flex h-full items-center justify-center py-1">
      <div className="flex flex-col items-center gap-0" style={{ perspective: "1200px" }}>
        
        {/* Top Bar */}
        <motion.div 
          className="w-48 h-0.5 bg-gradient-to-r from-transparent via-neutral-300 to-transparent mb-8"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Benefits Carousel */}
        <div className="relative h-32 w-full flex items-center justify-center">
          <AnimatePresence initial={false}>
            {benefits.map((benefit, index) => {
              const position = getPosition(index);
              const isCurrent = position === 0;
              const isVisible = Math.abs(position) <= 2;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={index}
                  className={`absolute flex items-center gap-3 ${benefit.color}`}
                  initial={{ 
                    rotateX: position * 30,
                    y: position * 40,
                    opacity: 0,
                    scale: 0.7,
                  }}
                  animate={{
                    rotateX: position * 30,
                    y: position * 40,
                    opacity: isCurrent ? 1 : Math.max(0, 1 - Math.abs(position) * 0.4),
                    scale: isCurrent ? 1 : Math.max(0.6, 1 - Math.abs(position) * 0.2),
                    z: isCurrent ? 50 : -Math.abs(position) * 20,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1200px",
                  }}
                >
                  {/* <div className={`${isCurrent ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                    {benefit.icon}
                  </div> */}
                  <span className={`${isCurrent ? 'text-xl font-schibsted' : 'text-lg'} text-neutral-900 whitespace-nowrap transition-all duration-300`}>
                    {benefit.text}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="w-48 h-0.5 bg-gradient-to-r from-transparent via-neutral-300 to-transparent mt-8"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* CTA Button */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button className="bg-sky-600 hover:bg-sky-700 text-white font-schibsted font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Start for free
          </button>
        </motion.div>
      </div>
    </div>
  );
};