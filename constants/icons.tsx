'use client';
import React from "react";
import { motion } from "framer-motion";

export const TrashIcon: React.FC<{ rotation: number }> = ({ rotation }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -6 28 32" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className="icon icon-tabler icons-tabler-outline icon-tabler-trash">
        <g
        style = {{
            overflow: 'visible',
            transformOrigin: 'right bottom',
            transformBox: 'fill-box',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease-out'
        }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            <path d="M4 7l16 0" />
        </g>
        <path d="M10 11l0 6" />
        <path d="M14 11l0 6" />
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    </svg>
)

// Sitemap Icon for "Smart email routing to Slack channels"
export const SitemapIcon: React.FC<{ 
  x?: number; 
  y?: number; 
  rotation?: number; 
  scale?: number;
}> = ({ 
  x = 0, 
  y = 0, 
  rotation = 0, 
  scale = 1 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    style={{
      transform: ` rotate(${rotation}deg) scale(${scale})`,
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}
  >
    <title>sitemap</title>
    <g fill="none">
      {/* Center connector - stays still */}
      <path 
        d="M13 10H17C18.6569 10 20 11.3431 20 13V18C20 18.5523 19.5523 19 19 19C18.4477 19 18 18.5523 18 18V13C18 12.4477 17.5523 12 17 12H7C6.44772 12 6 12.4477 6 13V18C6 18.5523 5.55228 19 5 19C4.44772 19 4 18.5523 4 18V13C4 11.3431 5.34315 10 7 10H11V5.5C11 4.94772 11.4477 4.5 12 4.5C12.5523 4.5 13 4.94772 13 5.5V10Z" 
        fill="url(#sitemap_gradient_0)" 
        data-glass="origin" 
        mask="url(#sitemap_mask)"
      />
      <path 
        d="M13 10H17C18.6569 10 20 11.3431 20 13V18C20 18.5523 19.5523 19 19 19C18.4477 19 18 18.5523 18 18V13C18 12.4477 17.5523 12 17 12H7C6.44772 12 6 12.4477 6 13V18C6 18.5523 5.55228 19 5 19C4.44772 19 4 18.5523 4 18V13C4 11.3431 5.34315 10 7 10H11V5.5C11 4.94772 11.4477 4.5 12 4.5C12.5523 4.5 13 4.94772 13 5.5V10Z" 
        fill="url(#sitemap_gradient_0)" 
        data-glass="clone" 
        filter="url(#sitemap_filter)" 
        clipPath="url(#sitemap_clipPath)"
      />

      {/* Three nodes - animate together */}
      <g 
        style={{
          transformOrigin: 'center',
          animation: 'sitemapNodes 2s ease-in-out infinite',
        }}
      >
        <path 
          d="M5 15C6.933 15 8.5 16.567 8.5 18.5C8.5 20.433 6.933 22 5 22C3.067 22 1.5 20.433 1.5 18.5C1.5 16.567 3.067 15 5 15ZM19 15C20.933 15 22.5 16.567 22.5 18.5C22.5 20.433 20.933 22 19 22C17.067 22 15.5 20.433 15.5 18.5C15.5 16.567 17.067 15 19 15ZM12 0.5C13.933 0.5 15.5 2.067 15.5 4C15.5 5.933 13.933 7.5 12 7.5C10.067 7.5 8.5 5.933 8.5 4C8.5 2.067 10.067 0.5 12 0.5Z" 
          fill="url(#sitemap_gradient_1)" 
          data-glass="blur"
        />
        <path 
          d="M14.75 4C14.75 2.48122 13.5188 1.25 12 1.25C10.4812 1.25 9.25 2.48122 9.25 4C9.25 5.51878 10.4812 6.75 12 6.75V7.5C10.067 7.5 8.5 5.933 8.5 4C8.5 2.067 10.067 0.5 12 0.5C13.933 0.5 15.5 2.067 15.5 4C15.5 5.933 13.933 7.5 12 7.5V6.75C13.5188 6.75 14.75 5.51878 14.75 4Z" 
          fill="url(#sitemap_gradient_2)"
        />
        <path 
          d="M7.75 18.5C7.75 16.9812 6.51878 15.75 5 15.75C3.48122 15.75 2.25 16.9812 2.25 18.5C2.25 20.0188 3.48122 21.25 5 21.25V22C3.067 22 1.5 20.433 1.5 18.5C1.5 16.567 3.067 15 5 15C6.933 15 8.5 16.567 8.5 18.5C8.5 20.433 6.933 22 5 22V21.25C6.51878 21.25 7.75 20.0188 7.75 18.5Z" 
          fill="url(#sitemap_gradient_3)"
        />
        <path 
          d="M21.75 18.5C21.75 16.9812 20.5188 15.75 19 15.75C17.4812 15.75 16.25 16.9812 16.25 18.5C16.25 20.0188 17.4812 21.25 19 21.25V22C17.067 22 15.5 20.433 15.5 18.5C15.5 16.567 17.067 15 19 15C20.933 15 22.5 16.567 22.5 18.5C22.5 20.433 20.933 22 19 22V21.25C20.5188 21.25 21.75 20.0188 21.75 18.5Z" 
          fill="url(#sitemap_gradient_4)"
        />
      </g>

      <defs>
        <linearGradient id="sitemap_gradient_0" x1="12" y1="4.5" x2="12" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#075985" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="sitemap_gradient_1" x1="12" y1=".5" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3E3E5" stopOpacity=".6" />
          <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id="sitemap_gradient_2" x1="12" y1=".5" x2="12" y2="4.554" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sitemap_gradient_3" x1="5" y1="15" x2="5" y2="19.054" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sitemap_gradient_4" x1="19" y1="15" x2="19" y2="19.054" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="sitemap_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
        </filter>
        <clipPath id="sitemap_clipPath">
          <path d="M5 15C6.933 15 8.5 16.567 8.5 18.5C8.5 20.433 6.933 22 5 22C3.067 22 1.5 20.433 1.5 18.5C1.5 16.567 3.067 15 5 15ZM19 15C20.933 15 22.5 16.567 22.5 18.5C22.5 20.433 20.933 22 19 22C17.067 22 15.5 20.433 15.5 18.5C15.5 16.567 17.067 15 19 15ZM12 0.5C13.933 0.5 15.5 2.067 15.5 4C15.5 5.933 13.933 7.5 12 7.5C10.067 7.5 8.5 5.933 8.5 4C8.5 2.067 10.067 0.5 12 0.5Z" fill="url(#sitemap_gradient_1)" />
        </clipPath>
        <mask id="sitemap_mask">
          <rect width="100%" height="100%" fill="#FFF" />
          <path d="M5 15C6.933 15 8.5 16.567 8.5 18.5C8.5 20.433 6.933 22 5 22C3.067 22 1.5 20.433 1.5 18.5C1.5 16.567 3.067 15 5 15ZM19 15C20.933 15 22.5 16.567 22.5 18.5C22.5 20.433 20.933 22 19 22C17.067 22 15.5 20.433 15.5 18.5C15.5 16.567 17.067 15 19 15ZM12 0.5C13.933 0.5 15.5 2.067 15.5 4C15.5 5.933 13.933 7.5 12 7.5C10.067 7.5 8.5 5.933 8.5 4C8.5 2.067 10.067 0.5 12 0.5Z" fill="#000" />
        </mask>
      </defs>
    </g>
    
    <style>{`
      @keyframes sitemapNodes {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.08);
        }
      }
    `}</style>
  </svg>
);

// Messages Icon for "Live chat widget with instant Slack notifications"
export const MessagesIcon: React.FC<{ 
  x?: number; 
  y?: number; 
  rotation?: number; 
  scale?: number;
}> = ({ 
  x = 0, 
  y = 0, 
  rotation = 0, 
  scale = 1 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    style={{
      transform: ` rotate(${rotation}deg) scale(${scale})`,
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}
  >
    <title>msgs</title>
    <g fill="none">
      {/* Back bubble - moves left */}
      <g 
        style={{
          transformOrigin: 'center',
          animation: 'msgBack 2s ease-in-out infinite',
        }}
      >
        <path 
          d="M1 9.99348C1.00003 11.624 1.44063 13.1472 2.19626 14.4646C2.38601 14.9255 2.27792 15.4945 2.15636 15.9568C1.97097 16.6619 1.62172 17.3398 1.21379 17.7485C1.0104 17.9522 0.945503 18.2561 1.04846 18.525C1.1515 18.7939 1.40329 18.9771 1.69077 18.9927C2.51536 19.0372 3.42875 18.8742 4.22582 18.6419C4.83702 18.4638 5.42053 18.2318 5.88387 17.9889C7.15411 18.645 8.57122 18.9955 10.0009 18.9955C14.9719 18.9954 18.9997 14.9668 19 9.99728C19 5.05316 15.0118 1.04141 10.0779 1C5.1088 1.00007 1 5.02371 1 9.99348Z" 
          fill="url(#msgs_gradient_0)" 
          data-glass="origin" 
          mask="url(#msgs_mask)"
        />
        <path 
          d="M1 9.99348C1.00003 11.624 1.44063 13.1472 2.19626 14.4646C2.38601 14.9255 2.27792 15.4945 2.15636 15.9568C1.97097 16.6619 1.62172 17.3398 1.21379 17.7485C1.0104 17.9522 0.945503 18.2561 1.04846 18.525C1.1515 18.7939 1.40329 18.9771 1.69077 18.9927C2.51536 19.0372 3.42875 18.8742 4.22582 18.6419C4.83702 18.4638 5.42053 18.2318 5.88387 17.9889C7.15411 18.645 8.57122 18.9955 10.0009 18.9955C14.9719 18.9954 18.9997 14.9668 19 9.99728C19 5.05316 15.0118 1.04141 10.0779 1C5.1088 1.00007 1 5.02371 1 9.99348Z" 
          fill="url(#msgs_gradient_0)" 
          data-glass="clone" 
          filter="url(#msgs_filter)" 
          clipPath="url(#msgs_clipPath)"
        />
      </g>

      {/* Front bubble - moves right */}
      <g 
        style={{
          transformOrigin: 'center',
          animation: 'msgFront 2s ease-in-out infinite',
        }}
      >
        <path 
          d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" 
          fill="url(#msgs_gradient_1)" 
          data-glass="blur"
        />
        <path 
          d="M22 14.4971C22 11.0214 19.2686 8.18279 15.835 8.00879L15.501 8C11.9118 8 9 10.9122 9 14.5C9.0002 18.0874 11.9088 20.9959 15.499 20.9961V21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461V20.9961C16.5025 20.9961 17.4992 20.7574 18.3994 20.3066C18.6109 20.2007 18.8599 20.2016 19.0713 20.3076C19.389 20.467 19.7847 20.6214 20.1992 20.7422C20.7163 20.8928 21.2777 20.9965 21.7852 21L22 20.9951H21.999C21.683 20.6784 21.3597 20.1509 21.1582 19.6211C21.0549 19.3495 20.9707 19.0451 20.9453 18.7373C20.9203 18.4343 20.9483 18.0728 21.127 17.7383L21.1377 17.7188C21.6146 16.886 21.9171 15.9424 21.9854 14.9336L22 14.4971Z" 
          fill="url(#msgs_gradient_2)"
        />
      </g>

      <defs>
        <linearGradient id="msgs_gradient_0" x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#075985" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="msgs_gradient_1" x1="15.5" y1="7.25" x2="15.5" y2="21.75" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3E3E5" stopOpacity=".6" />
          <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id="msgs_gradient_2" x1="15.5" y1="7.25" x2="15.5" y2="15.647" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="msgs_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
        </filter>
        <clipPath id="msgs_clipPath">
          <path d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" fill="url(#msgs_gradient_1)" />
        </clipPath>
        <mask id="msgs_mask">
          <rect width="100%" height="100%" fill="#FFF" />
          <path d="M22.75 14.4971C22.75 15.8083 22.3947 17.0325 21.7881 18.0918C21.4381 18.7473 22.0797 20.0133 22.5303 20.4648C22.7394 20.6742 22.8061 20.9874 22.7002 21.2637C22.5942 21.5399 22.3354 21.7282 22.04 21.7441C21.3651 21.7806 20.6264 21.6475 19.9893 21.4619C19.536 21.3299 19.098 21.1595 18.7354 20.9775C17.7323 21.4798 16.6207 21.7461 15.499 21.7461C11.4948 21.7459 8.2502 18.5019 8.25 14.5C8.25 10.498 11.4977 7.25 15.501 7.25C19.5037 7.25018 22.75 10.4949 22.75 14.4971Z" fill="#000" />
        </mask>
      </defs>
    </g>
    
    <style>{`
      @keyframes msgBack {
        0%, 100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(-2px, 0);
        }
      }
      
      @keyframes msgFront {
        0%, 100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(2px, 0);
        }
      }
    `}</style>
  </svg>
);

// Stack Perspective Icon for "Discord and Slack integrations"
export const StackPerspectiveIcon: React.FC<{ 
  x?: number; 
  y?: number; 
  rotation?: number; 
  scale?: number;
}> = ({ 
  x = 0, 
  y = 0, 
  rotation = 0, 
  scale = 1 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    style={{
      transform: `translate(${x}px, ${y}px))`,
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}
  >
    <title>stack-perspective</title>
    <g fill="none">
      {/* Front Layer - moves down-right */}
      <g 
        style={{
          transformOrigin: 'center',
          animation: 'stackFront 2s ease-in-out infinite',
        }}
      >
        <path 
          d="M7 7.74759C7 5.43142 7 4.27333 7.4746 3.45742C7.89096 2.74164 8.54761 2.19667 9.32786 1.91935C10.2173 1.60324 11.3555 1.81666 13.632 2.2435L17.7794 3.02115C19.6372 3.36948 20.5662 3.54365 21.2618 4.02058C21.8752 4.44109 22.3592 5.02427 22.6594 5.70462C23 6.47626 23 7.42135 23 9.31153V13.2524C23 15.5686 23 16.7267 22.5254 17.5426C22.109 18.2584 21.4524 18.8033 20.6721 19.0807C19.7827 19.3968 18.6445 19.1833 16.368 18.7565L12.2206 17.9789C10.3627 17.6305 9.43385 17.4563 8.73819 16.9794C8.12482 16.5589 7.64083 15.9757 7.34056 15.2954C7 14.5237 7 13.5787 7 11.6885V7.74759Z" 
          fill="url(#stack_gradient_0)" 
          data-glass="origin" 
          mask="url(#stack_mask)"
        />
        <path 
          d="M7 7.74759C7 5.43142 7 4.27333 7.4746 3.45742C7.89096 2.74164 8.54761 2.19667 9.32786 1.91935C10.2173 1.60324 11.3555 1.81666 13.632 2.2435L17.7794 3.02115C19.6372 3.36948 20.5662 3.54365 21.2618 4.02058C21.8752 4.44109 22.3592 5.02427 22.6594 5.70462C23 6.47626 23 7.42135 23 9.31153V13.2524C23 15.5686 23 16.7267 22.5254 17.5426C22.109 18.2584 21.4524 18.8033 20.6721 19.0807C19.7827 19.3968 18.6445 19.1833 16.368 18.7565L12.2206 17.9789C10.3627 17.6305 9.43385 17.4563 8.73819 16.9794C8.12482 16.5589 7.64083 15.9757 7.34056 15.2954C7 14.5237 7 13.5787 7 11.6885V7.74759Z" 
          fill="url(#stack_gradient_0)" 
          data-glass="clone" 
          filter="url(#stack_filter)" 
          clipPath="url(#stack_clipPath)"
        />
      </g>

      {/* Back Layer - moves up-left */}
      <g 
        style={{
          transformOrigin: 'center',
          animation: 'stackBack 2s ease-in-out infinite',
        }}
      >
        <path 
          d="M1 10.7476C1 8.43142 1 7.27333 1.4746 6.45742C1.89096 5.74164 2.54761 5.19667 3.32786 4.91935C4.21727 4.60324 5.35552 4.81666 7.63201 5.2435L11.7794 6.02115C13.6372 6.36948 14.5662 6.54365 15.2618 7.02058C15.8752 7.44109 16.3592 8.02427 16.6594 8.70462C17 9.47626 17 10.4213 17 12.3115V16.2524C17 18.5686 17 19.7267 16.5254 20.5426C16.109 21.2584 15.4524 21.8033 14.6721 22.0807C13.7827 22.3968 12.6445 22.1833 10.368 21.7565L6.22056 20.9789C4.36275 20.6305 3.43385 20.4563 2.73819 19.9794C2.12482 19.5589 1.64083 18.9757 1.34056 18.2954C1 17.5237 1 16.5787 1 14.6885V10.7476Z" 
          fill="url(#stack_gradient_1)" 
          data-glass="blur"
        />
        <path 
          d="M1 14.6885V10.7481C1 8.57654 0.999508 7.42228 1.39062 6.61426L1.47461 6.45704C1.83885 5.83099 2.3872 5.33599 3.04102 5.03614L3.32812 4.91895C4.21745 4.60304 5.3558 4.81641 7.63184 5.24317L11.7793 6.02149C13.637 6.36981 14.5661 6.54364 15.2617 7.02051C15.8751 7.44103 16.3589 8.02473 16.6592 8.70509C16.9996 9.47667 17 10.4216 17 12.3115V16.252C17 18.5681 17 19.7271 16.5254 20.543L16.3584 20.8027C15.9431 21.3904 15.3546 21.8384 14.6719 22.0811L14.502 22.1338C13.8668 22.3064 13.0878 22.2377 11.876 22.0313L10.3682 21.7568L6.2207 20.9785C4.47875 20.6519 3.55318 20.479 2.87109 20.0654L2.73828 19.9795C2.20164 19.6116 1.76409 19.119 1.46191 18.5459L1.34082 18.2949C1.08554 17.7163 1.02085 17.0404 1.00488 15.9414L1 14.6885ZM1.75 14.6885C1.75 15.6447 1.75005 16.3209 1.79004 16.8555C1.82931 17.3803 1.9042 17.7152 2.02637 17.9922C2.27028 18.5449 2.66391 19.0187 3.16211 19.3604C3.41188 19.5316 3.72743 19.6673 4.23633 19.8027C4.75432 19.9406 5.41869 20.066 6.3584 20.2422L10.5059 21.0195C11.6573 21.2354 12.4741 21.3879 13.1143 21.4512C13.7475 21.5137 14.127 21.4785 14.4209 21.374C15.0339 21.1561 15.5498 20.7274 15.877 20.165C16.0338 19.8954 16.1381 19.5285 16.1934 18.8945C16.2491 18.2537 16.25 17.4232 16.25 16.252V12.3115C16.25 11.3553 16.25 10.6791 16.21 10.1445C16.1707 9.61967 16.0958 9.28479 15.9736 9.00782C15.7297 8.45516 15.3361 7.9813 14.8379 7.63966C14.5881 7.46842 14.2726 7.33266 13.7637 7.19727C13.2457 7.05946 12.5813 6.93401 11.6416 6.75782L7.49414 5.98048C6.34266 5.76457 5.52593 5.61207 4.88574 5.54884C4.25249 5.48631 3.87304 5.52153 3.5791 5.62598C2.96605 5.84387 2.45018 6.27257 2.12305 6.83497C1.96625 7.10465 1.86187 7.47148 1.80664 8.10548C1.75085 8.74629 1.75 9.57679 1.75 10.7481V14.6885Z" 
          fill="url(#stack_gradient_2)"
        />
      </g>

      <defs>
        <linearGradient id="stack_gradient_0" x1="15" y1="1" x2="15" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#075985" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="stack_gradient_1" x1="9" y1="4" x2="9" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3E3E5" stopOpacity=".6" />
          <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id="stack_gradient_2" x1="9" y1="4.768" x2="9" y2="14.881" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="stack_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
        </filter>
        <clipPath id="stack_clipPath">
          <path d="M1 10.7476C1 8.43142 1 7.27333 1.4746 6.45742C1.89096 5.74164 2.54761 5.19667 3.32786 4.91935C4.21727 4.60324 5.35552 4.81666 7.63201 5.2435L11.7794 6.02115C13.6372 6.36948 14.5662 6.54365 15.2618 7.02058C15.8752 7.44109 16.3592 8.02427 16.6594 8.70462C17 9.47626 17 10.4213 17 12.3115V16.2524C17 18.5686 17 19.7267 16.5254 20.5426C16.109 21.2584 15.4524 21.8033 14.6721 22.0807C13.7827 22.3968 12.6445 22.1833 10.368 21.7565L6.22056 20.9789C4.36275 20.6305 3.43385 20.4563 2.73819 19.9794C2.12482 19.5589 1.64083 18.9757 1.34056 18.2954C1 17.5237 1 16.5787 1 14.6885V10.7476Z" fill="url(#stack_gradient_1)" />
        </clipPath>
        <mask id="stack_mask">
          <rect width="100%" height="100%" fill="#FFF" />
          <path d="M1 10.7476C1 8.43142 1 7.27333 1.4746 6.45742C1.89096 5.74164 2.54761 5.19667 3.32786 4.91935C4.21727 4.60324 5.35552 4.81666 7.63201 5.2435L11.7794 6.02115C13.6372 6.36948 14.5662 6.54365 15.2618 7.02058C15.8752 7.44109 16.3592 8.02427 16.6594 8.70462C17 9.47626 17 10.4213 17 12.3115V16.2524C17 18.5686 17 19.7267 16.5254 20.5426C16.109 21.2584 15.4524 21.8033 14.6721 22.0807C13.7827 22.3968 12.6445 22.1833 10.368 21.7565L6.22056 20.9789C4.36275 20.6305 3.43385 20.4563 2.73819 19.9794C2.12482 19.5589 1.64083 18.9757 1.34056 18.2954C1 17.5237 1 16.5787 1 14.6885V10.7476Z" fill="#000" />
        </mask>
      </defs>
    </g>
    
    <style>{`
      @keyframes stackFront {
        0%, 100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(2px, 2px);
        }
      }
      
      @keyframes stackBack {
        0%, 100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(-2px, -2px);
        }
      }
    `}</style>
  </svg>
);


export const UsersIcon: React.FC<{ 
  x?: number; 
  y?: number; 
  rotation?: number; 
  scale?: number;
}> = ({ 
  x = 0, 
  y = 0, 
  rotation = 0, 
  scale = 1 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    style={{
      transform: ` rotate(${rotation}deg) scale(${scale})`,
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}
  >
    <title>users</title>
    <g fill="none">
      {/* Back user - moves left */}
      <g 
        style={{
          transformOrigin: 'center',
          animation: 'userBack 2s ease-in-out infinite',
        }}
      >
        <path 
          d="M15.9414 10C19.8397 10.0001 22.9999 13.1603 23 17.0586C23 18.1307 22.1307 19 21.0586 19H9.94141C8.86932 19 8 18.1307 8 17.0586C8.00012 13.1603 11.1603 10.0001 15.0586 10H15.9414ZM15.5 1C17.433 1 19 2.567 19 4.5C19 6.433 17.433 8 15.5 8C13.567 8 12 6.433 12 4.5C12 2.567 13.567 1 15.5 1Z" 
          fill="url(#users_gradient_0)" 
          data-glass="origin" 
          mask="url(#users_mask)"
        />
        <path 
          d="M15.9414 10C19.8397 10.0001 22.9999 13.1603 23 17.0586C23 18.1307 22.1307 19 21.0586 19H9.94141C8.86932 19 8 18.1307 8 17.0586C8.00012 13.1603 11.1603 10.0001 15.0586 10H15.9414ZM15.5 1C17.433 1 19 2.567 19 4.5C19 6.433 17.433 8 15.5 8C13.567 8 12 6.433 12 4.5C12 2.567 13.567 1 15.5 1Z" 
          fill="url(#users_gradient_0)" 
          data-glass="clone" 
          filter="url(#users_filter)" 
          clipPath="url(#users_clipPath)"
        />
      </g>

      {/* Front user - moves right */}
      <g 
        style={{
          transformOrigin: 'center',
          animation: 'userFront 2s ease-in-out infinite',
        }}
      >
        <path 
          d="M10.3076 12C14.556 12 18 15.444 18 19.6924C18 20.9668 16.9668 22 15.6924 22H4.30762C3.03317 22 2.00004 20.9668 2 19.6924C2 15.444 5.44404 12 9.69238 12H10.3076ZM10 2C12.2091 2 14 3.79086 14 6C14 8.20914 12.2091 10 10 10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2Z" 
          fill="url(#users_gradient_1)" 
          data-glass="blur"
        />
        <path 
          d="M13.25 6C13.25 4.20507 11.7949 2.75 10 2.75C8.20507 2.75 6.75 4.20507 6.75 6C6.75 7.79493 8.20507 9.25 10 9.25V10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2C12.2091 2 14 3.79086 14 6C14 8.20914 12.2091 10 10 10V9.25C11.7949 9.25 13.25 7.79493 13.25 6Z" 
          fill="url(#users_gradient_2)"
        />
        <path 
          d="M15.6924 21.25V22H4.30762V21.25H15.6924ZM17.25 19.6924C17.25 15.8583 14.1417 12.75 10.3076 12.75H9.69238C5.85825 12.75 2.75 15.8583 2.75 19.6924C2.75004 20.5526 3.44739 21.25 4.30762 21.25V22C3.11295 22 2.13009 21.0921 2.01172 19.9287L2 19.6924C2 15.5767 5.23229 12.2156 9.29688 12.0098L9.69238 12H10.3076C14.556 12 18 15.444 18 19.6924L17.9883 19.9287C17.8778 21.0145 17.0145 21.8778 15.9287 21.9883L15.6924 22V21.25C16.5526 21.25 17.25 20.5526 17.25 19.6924Z" 
          fill="url(#users_gradient_3)"
        />
      </g>

      <defs>
        <linearGradient id="users_gradient_0" x1="15.5" y1="1" x2="15.5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#075985" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="users_gradient_1" x1="10" y1="2" x2="10" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3E3E5" stopOpacity=".6" />
          <stop offset="1" stopColor="#BBBBC0" stopOpacity=".6" />
        </linearGradient>
        <linearGradient id="users_gradient_2" x1="10" y1="2" x2="10" y2="6.633" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="users_gradient_3" x1="10" y1="12" x2="10" y2="17.791" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="users_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
        </filter>
        <clipPath id="users_clipPath">
          <path d="M10.3076 12C14.556 12 18 15.444 18 19.6924C18 20.9668 16.9668 22 15.6924 22H4.30762C3.03317 22 2.00004 20.9668 2 19.6924C2 15.444 5.44404 12 9.69238 12H10.3076ZM10 2C12.2091 2 14 3.79086 14 6C14 8.20914 12.2091 10 10 10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2Z" fill="url(#users_gradient_1)" />
        </clipPath>
        <mask id="users_mask">
          <rect width="100%" height="100%" fill="#FFF" />
          <path d="M10.3076 12C14.556 12 18 15.444 18 19.6924C18 20.9668 16.9668 22 15.6924 22H4.30762C3.03317 22 2.00004 20.9668 2 19.6924C2 15.444 5.44404 12 9.69238 12H10.3076ZM10 2C12.2091 2 14 3.79086 14 6C14 8.20914 12.2091 10 10 10C7.79086 10 6 8.20914 6 6C6 3.79086 7.79086 2 10 2Z" fill="#000" />
        </mask>
      </defs>
    </g>
    
    <style>{`
      @keyframes userBack {
        0%, 100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(2px, 0);
        }
      }
      
      @keyframes userFront {
        0%, 100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(-2px, 0);
        }
      }
    `}</style>
  </svg>
);

export const AnalyticsIcon: React.FC<{ 
  x?: number; 
  y?: number; 
  rotation?: number; 
  scale?: number;
}> = ({ 
  x = 0, 
  y = 0, 
  rotation = 0, 
  scale = 1 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
    style={{
      transform: ` rotate(${rotation}deg) scale(${scale})`,
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    }}
  >
    <title>analytics</title>
    <g fill="none">
      {/* Sky-800 background container */}
      <rect 
        x="3" 
        y="2" 
        width="18" 
        height="20" 
        rx="4"
        fill="#075985"
      />

      {/* Animated glass bars inside */}
      <g>
        {/* Bar 1 - shortest - GLASS EFFECT */}
        <g style={{
          animation: 'barGrow1 2s ease-in-out infinite',
          transformOrigin: '8.5px 16.5px',
        }}>
          <rect 
            x="7.5" 
            y="14" 
            width="2" 
            height="2.5" 
            rx="0.5"
            fill="url(#bar_gradient_1)" 
            data-glass="origin" 
          />
          <rect 
            x="7.5" 
            y="14" 
            width="2" 
            height="2.5" 
            rx="0.5"
            fill="url(#bar_gradient_1)" 
            data-glass="clone" 
            filter="url(#analytics_filter)"
          />
        </g>
        
        {/* Bar 2 - medium - GLASS EFFECT */}
        <g style={{
          animation: 'barGrow2 2s ease-in-out infinite 0.2s',
          transformOrigin: '12px 16.5px',
        }}>
          <rect 
            x="11" 
            y="11" 
            width="2" 
            height="5.5" 
            rx="0.5"
            fill="url(#bar_gradient_2)" 
            data-glass="origin"
          />
          <rect 
            x="11" 
            y="11" 
            width="2" 
            height="5.5" 
            rx="0.5"
            fill="url(#bar_gradient_2)" 
            data-glass="clone" 
            filter="url(#analytics_filter)"
          />
        </g>
        
        {/* Bar 3 - tallest - GLASS EFFECT */}
        <g style={{
          animation: 'barGrow3 2s ease-in-out infinite 0.4s',
          transformOrigin: '15.5px 16.5px',
        }}>
          <rect 
            x="14.5" 
            y="8" 
            width="2" 
            height="8.5" 
            rx="0.5"
            fill="url(#bar_gradient_3)" 
            data-glass="origin"
          />
          <rect 
            x="14.5" 
            y="8" 
            width="2" 
            height="8.5" 
            rx="0.5"
            fill="url(#bar_gradient_3)" 
            data-glass="clone" 
            filter="url(#analytics_filter)"
          />
        </g>
      </g>

      {/* Base line */}
      <line 
        x1="6.5" 
        y1="16.5" 
        x2="17.5" 
        y2="16.5" 
        stroke="#E3E3E5" 
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />

      {/* Container outline */}
      <rect 
        x="3" 
        y="2" 
        width="18" 
        height="20" 
        rx="4"
        fill="none"
        stroke="url(#analytics_outline)" 
        strokeWidth="0.75"
      />

      <defs>
        {/* Glass gradients for bars */}
        <linearGradient id="bar_gradient_1" x1="8.5" y1="14" x2="8.5" y2="16.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3E3E5" stopOpacity=".8" />
          <stop offset="1" stopColor="#BBBBC0" stopOpacity=".8" />
        </linearGradient>
        <linearGradient id="bar_gradient_2" x1="12" y1="11" x2="12" y2="16.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3E3E5" stopOpacity=".8" />
          <stop offset="1" stopColor="#BBBBC0" stopOpacity=".8" />
        </linearGradient>
        <linearGradient id="bar_gradient_3" x1="15.5" y1="8" x2="15.5" y2="16.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3E3E5" stopOpacity=".8" />
          <stop offset="1" stopColor="#BBBBC0" stopOpacity=".8" />
        </linearGradient>
        
        {/* Outline gradient */}
        <linearGradient id="analytics_outline" x1="12" y1="2" x2="12" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <filter id="analytics_filter" x="-100%" y="-100%" width="400%" height="400%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
        </filter>
      </defs>
    </g>
    
    <style>{`
      @keyframes barGrow1 {
        0%, 100% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(1.4);
        }
      }
      
      @keyframes barGrow2 {
        0%, 100% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(1.3);
        }
      }
      
      @keyframes barGrow3 {
        0%, 100% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(1.2);
        }
      }
    `}</style>
  </svg>
);



// ============================================
// ICON: MAIL (Envelope opens on hover)
// ============================================
export interface IconMailProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function IconMail({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: IconMailProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      className={`icon icon-tabler ${className}`}
      style={{ perspective: '2000px' }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      
      {/* Envelope body - static */}
      <path d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z" />
      
      {/* Top flap - rotates to open on hover */}
      <motion.path 
        d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z"
        style={{
          transformBox: "fill-box",
          transformOrigin: "50% 0%"
        }}
        animate={isAnimating ? "open" : "closed"}
        variants={{
          closed: {
            rotateX: 0,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          },
          open: {
            rotateX: -180,
            y: -4,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }
        }}
      />
    </svg>
  );
}

// ============================================
// ICON: DASHBOARD (Chart bars grow on hover)
// ============================================
export interface IconDashboardProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function IconDashboard({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: IconDashboardProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24"
      className={`icon ${className}`}
    >
      <g fill="none">
        {/* Background container */}
        <rect 
          x="3" 
          y="2" 
          width="18" 
          height="20" 
          rx="4"
          fill={color}
        />

        {/* Bar 1 - shortest */}
        <motion.g
          style={{
            transformBox: "fill-box",
            transformOrigin: "8.5px 16.5px"
          }}
          animate={isAnimating ? "grow" : "normal"}
          variants={{
            normal: {
              scaleY: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            },
            grow: {
              scaleY: 1.4,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0
              }
            }
          }}
        >
          <rect 
            x="7.5" 
            y="14" 
            width="2" 
            height="2.5" 
            rx="0.5"
            fill="rgba(255,255,255,0.9)"
          />
        </motion.g>
        
        {/* Bar 2 - medium */}
        <motion.g
          style={{
            transformBox: "fill-box",
            transformOrigin: "12px 16.5px"
          }}
          animate={isAnimating ? "grow" : "normal"}
          variants={{
            normal: {
              scaleY: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            },
            grow: {
              scaleY: 1.3,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1
              }
            }
          }}
        >
          <rect 
            x="11" 
            y="11" 
            width="2" 
            height="5.5" 
            rx="0.5"
            fill="rgba(255,255,255,0.9)"
          />
        </motion.g>
        
        {/* Bar 3 - tallest */}
        <motion.g
          style={{
            transformBox: "fill-box",
            transformOrigin: "15.5px 16.5px"
          }}
          animate={isAnimating ? "grow" : "normal"}
          variants={{
            normal: {
              scaleY: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            },
            grow: {
              scaleY: 1.2,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2
              }
            }
          }}
        >
          <rect 
            x="14.5" 
            y="8" 
            width="2" 
            height="8.5" 
            rx="0.5"
            fill="rgba(255,255,255,0.9)"
          />
        </motion.g>

        {/* Base line */}
        <line 
          x1="6.5" 
          y1="16.5" 
          x2="17.5" 
          y2="16.5" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}

// ============================================
// ICON: INBOX (Envelope slides in on hover)
// ============================================
export interface IconInboxProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function IconInbox({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: IconInboxProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color} // no color
      className={`icon ${className}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      
      {/* Flag pole - static */}
      <path d="M10 2a1 1 0 0 1 .993 .883l.007 .117v8h-3a1 1 0 0 1 -.993 -.883l-.007 -.117v-5a1 1 0 0 1 .883 -.993l.117 -.007h3v-2a1 1 0 0 1 1 -1z" />
      <path d="M11 12v8h1a1 1 0 0 1 .117 1.993l-.117 .007h-4a1 1 0 0 1 -.117 -1.993l.117 -.007h1v-8h1z" />
      
      {/* Flag - rotates on left edge */}
      <motion.path 
        d="M16 5a1 1 0 0 1 .694 .28l.087 .095l2 2.5a1 1 0 0 1 .072 1.147l-.072 .103l-2 2.5a1 1 0 0 1 -.652 .367l-.129 .008h-5v-7h5z"
        style={{
          transformBox: "fill-box",
          transformOrigin: "11px 8.5px"
        }}
        animate={isAnimating ? "wave" : "normal"}
        variants={{
          normal: {
            rotateY: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          },
          wave: {
            rotateY: -360,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }
        }}
      />
    </svg>
  );
}

// ============================================
// ICON: GLOBE (Rotates on hover)
// ============================================
export interface IconGlobeProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function IconGlobe({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: IconGlobeProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
    >
      {/* Globe circle */}
      <motion.path 
        d="M12 21a9 9 0 1 0 0 -18a9 9 0 0 0 0 18z"
        animate={isAnimating ? "pulse" : "normal"}
        variants={{
          normal: {
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          },
          pulse: {
            scale: [1, 1.05, 1],
            transition: {
              duration: 0.6,
              ease: "easeInOut"
            }
          }
        }}
        style={{
          transformBox: "fill-box",
          transformOrigin: "50% 50%"
        }}
      />
      
      {/* Top horizontal line */}
      <motion.path 
        d="M3.6 9h16.8"
        animate={isAnimating ? "wave" : "normal"}
        variants={{
          normal: {
            d: "M3.6 9h16.8",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          },
          wave: {
            d: "M3.6 9q4.2 -1.5 8.4 0t8.4 0",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }
        }}
      />
      
      {/* Bottom horizontal line */}
      <motion.path 
        d="M3.6 15h16.8"
        animate={isAnimating ? "wave" : "normal"}
        variants={{
          normal: {
            d: "M3.6 15h16.8",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.05
            }
          },
          wave: {
            d: "M3.6 15q4.2 1.5 8.4 0t8.4 0",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.05
            }
          }
        }}
      />
      
      {/* Left vertical meridian */}
      <motion.path 
        d="M11.5 3a17 17 0 0 0 0 18"
        animate={isAnimating ? "shift" : "normal"}
        variants={{
          normal: {
            d: "M11.5 3a17 17 0 0 0 0 18",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          },
          shift: {
            d: "M10 3a17 17 0 0 0 1.5 18",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }
        }}
      />
      
      {/* Right vertical meridian */}
      <motion.path 
        d="M12.5 3a16.94 16.94 0 0 1 2.307 12"
        animate={isAnimating ? "shift" : "normal"}
        variants={{
          normal: {
            d: "M12.5 3a16.94 16.94 0 0 1 2.307 12",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          },
          shift: {
            d: "M14 3a16.94 16.94 0 0 1 0.807 12",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }
        }}
      />
    </svg>
  );
}

// ============================================
// ICON: AT SIGN (Pulse on hover)
// ============================================
export interface IconAtSignProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function IconAtSign({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: IconAtSignProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      
      {/* Inner circle @ symbol */}
      <motion.path 
        d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"
        initial={{ pathLength: 1, opacity: 1 }}
        animate={isAnimating ? "draw" : "normal"}
        variants={{
          normal: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          },
          draw: {
            pathLength: [0, 1],
            opacity: [0.3, 1],
            transition: {
              duration: 0.5,
              ease: "easeOut"
            }
          }
        }}
      />
      
      {/* Outer arc with tail */}
      <motion.path 
        d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"
        initial={{ pathLength: 1, opacity: 0.3 }}
        animate={isAnimating ? "draw" : "normal"}
        variants={{
          normal: {
            pathLength: 1,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          },
          draw: {
            pathLength: [0, 1],
            opacity: [0.3, 1],
            transition: {
              duration: 0.6,
              ease: "easeOut",
              delay: 0.1
            }
          }
        }}
      />
    </svg>
  );
}

// ============================================
// ICON: ZAP (Lightning flash on hover)
// ============================================
export interface IconZapProps {
  size?: number;
  color?: string;
  className?: string;
  isAnimating?: boolean;
}

export function IconZap({
  size = 24,
  color = 'currentColor',
  className = '',
  isAnimating = false
}: IconZapProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      className={`icon ${className}`}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      
      {/* Lightning bolt */}
      <motion.path 
        d="M13 3l-8 9h5l-1 9l8 -9h-5l1 -9z"
        animate={isAnimating ? "flash" : "normal"}
        variants={{
          normal: {
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          },
          flash: {
            opacity: [1, 0.6, 1],
            y: [0, -2, 0],
            transition: {
              duration: 0.5,
              ease: "easeInOut"
            }
          }
        }}
      />
    </svg>
  );
}