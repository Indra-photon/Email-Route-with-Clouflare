"use client";

import React from "react";
import { Grid } from "@/components/VercelGrid";

export function SectionSeparator() {
  return (
    <section className="w-full bg-white relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <Grid.System unstable_useContainer>
          <Grid columns={7} rows={1} className="min-h-[200px]" showGrid={true}>
            <Grid.Cell 
              column="1/8" 
              row="1/2"
              className="relative overflow-hidden"
            >
              {/* Vercel-style dot pattern background */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle, #d4d4d8 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                  opacity: 0.4,
                }}
              />
              
              {/* Gradient overlay for depth */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, transparent 0%, white 100%)',
                }}
              />

              {/* Optional centered content */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="w-1 h-16 bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />
              </div>
            </Grid.Cell>
          </Grid>
        </Grid.System>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block lg:hidden">
        <div className="container mx-auto px-6 py-16 relative">
          {/* Dot pattern */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d4d4d8 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              opacity: 0.4,
            }}
          />
          
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 0%, white 100%)',
            }}
          />

          {/* Centered divider */}
          <div className="relative z-10 flex items-center justify-center h-32">
            <div className="w-1 h-12 bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="container mx-auto px-4 py-12 relative">
          {/* Dot pattern - smaller dots on mobile */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d4d4d8 0.5px, transparent 0.5px)`,
              backgroundSize: '16px 16px',
              opacity: 0.3,
            }}
          />
          
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 0%, white 100%)',
            }}
          />

          {/* Centered divider */}
          <div className="relative z-10 flex items-center justify-center h-24">
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}