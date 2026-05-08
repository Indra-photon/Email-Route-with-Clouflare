"use client";

import { useState } from "react";

export function VideoHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full bg-gradient-to-b from-[#A8D3FF] to-[#FFF4DF] p-6 md:p-10 overflow-hidden">
      {/* SVG grain filter definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="videoGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* Grain overlay on top of the gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "#8C8C8C",
          filter: "url(#videoGrain)",
          opacity: 0.9,
        }}
      />

      {/* Video wrapper — shadow and rounded corners, sits above grain */}
      <div className="relative z-10 w-full aspect-video shadow-2xl overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setIsLoaded(true)}
          className="w-full h-full object-cover"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 700ms ease",
          }}
        >
          <source
            src="https://pub-9f57143beb5d4021993886ceedb5cb59.r2.dev/Website-content/syncsupportwebvideo02.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
}
