// "use client";

// import { CheckCircle2, Circle } from "lucide-react";
// import { Paragraph } from "@/components/Paragraph";
// import { Lines } from "@/components/Lines";

// interface Step {
//   title: string;
//   description: string;
//   completed?: boolean;
// }

// interface StepIndicatorProps {
//   steps: Step[];
//   currentStep?: number;
//   showLines?: boolean;
// }

// export function StepIndicator({
//   steps,
//   currentStep = 0,
//   showLines = false,
// }: StepIndicatorProps) {
//   return (
//     <div className="space-y-6">
//       {steps.map((step, index) => {
//         const isCompleted = step.completed || index < currentStep;
//         const isCurrent = index === currentStep;

//         return (
//           <div key={index} className="relative">
//             <div className="flex gap-4">
//               {/* Step Number/Icon */}
//               <div className="shrink-0">
//                 {isCompleted ? (
//                   <div className="flex size-8 items-center justify-center rounded-full bg-green-100">
//                     <CheckCircle2 className="size-5 text-green-600" />
//                   </div>
//                 ) : (
//                   <div
//                     className={`flex size-8 items-center justify-center rounded-full ${
//                       isCurrent
//                         ? "bg-sky-100 ring-4 ring-sky-50"
//                         : "bg-neutral-100"
//                     }`}
//                   >
//                     {isCurrent ? (
//                       <div className="size-3 rounded-full bg-sky-600" />
//                     ) : (
//                       <Circle className="size-5 text-neutral-400" />
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Step Content */}
//               <div className="flex-1 pb-8">
//                 <h3
//                   className={`text-base font-schibsted font-semibold mb-1 ${
//                     isCurrent
//                       ? "text-sky-800"
//                       : isCompleted
//                       ? "text-green-800"
//                       : "text-neutral-900"
//                   }`}
//                 >
//                   {step.title}
//                 </h3>
//                 <Paragraph
//                   variant="small"
//                   className={`${
//                     isCurrent || isCompleted
//                       ? "text-neutral-600"
//                       : "text-neutral-500"
//                   }`}
//                 >
//                   {step.description}
//                 </Paragraph>
//               </div>
//             </div>

//             {/* Connecting Line */}
//             {index < steps.length - 1 && (
//               <div className="absolute left-4 top-8 bottom-0 w-px bg-neutral-200" />
//             )}

//             {/* Decorative Lines */}
//             {showLines && isCurrent && (
//               <div className="absolute left-4 top-4">
//                 <Lines />
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }


"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { Paragraph } from "@/components/Paragraph";
import { Lines } from "@/components/Lines";
import { motion } from "motion/react";

interface Step {
  title: string;
  description: string;
  completed?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep?: number;
  showLines?: boolean;
}

export function StepIndicator({
  steps,
  currentStep = 0,
  showLines = false,
}: StepIndicatorProps) {
  // Calculate progress percentage
  const progressPercentage = steps.length > 1 
    ? currentStep / (steps.length - 1)
    : 0;

  return (
    <div className="flex justify-end">
      <div className="relative w-full max-w-2xl">
        <div className="space-y-6">
          {/* SVG Path - positioned absolutely on the left */}
          <svg
            className="absolute left-4 top-4 pointer-events-none"
            width="2"
            height="100%"
            style={{ 
              transform: 'translateX(-1px)',
            }}
          >
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0C4A6E" />
                <stop offset="100%" stopColor="#0C4A6E" />
              </linearGradient>
            </defs>

            {/* Base neutral line */}
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="#e5e5e5"
              strokeWidth="2"
            />

            {/* Animated highlight line */}
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="100%"
              stroke="url(#progress-gradient)"
              strokeWidth="2"
              strokeDasharray="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressPercentage }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                duration: 0.6
              }}
              style={{
                pathLength: progressPercentage,
              }}
            />
          </svg>

          {/* Steps */}
          {steps.map((step, index) => {
            const isCompleted = step.completed || index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="relative">
                <div className="flex gap-4">
                  {/* Step Number/Icon */}
                  <div className="shrink-0 relative z-10">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="flex size-8 items-center justify-center rounded-full bg-green-100"
                      >
                        <CheckCircle2 className="size-5 text-green-600" />
                      </motion.div>
                    ) : (
                      <div
                        className={`flex size-8 items-center justify-center rounded-full transition-all ${
                          isCurrent
                            ? "bg-sky-100 ring-4 ring-sky-50"
                            : "bg-white border-2 border-neutral-200"
                        }`}
                      >
                        {isCurrent ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className="size-3 rounded-full bg-sky-600"
                          />
                        ) : (
                          <div className="size-2 rounded-full bg-neutral-300" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-8">
                    <h3
                      className={`text-base font-schibsted font-semibold mb-1 transition-colors ${
                        isCurrent
                          ? "text-sky-800"
                          : isCompleted
                          ? "text-green-800"
                          : "text-neutral-900"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <Paragraph
                      variant="small"
                      className={`transition-colors ${
                        isCurrent || isCompleted
                          ? "text-neutral-600"
                          : "text-neutral-500"
                      }`}
                    >
                      {step.description}
                    </Paragraph>
                  </div>
                </div>

                {/* Decorative Lines */}
                {showLines && isCurrent && (
                  <div className="absolute left-4 top-4">
                    <Lines />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}