"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export function ChatWidgetScript() {
  const pathname = usePathname();
  if (pathname.startsWith("/chat/embed")) return null;

  return (
    <>
      <Script id="chat-widget-key" strategy="afterInteractive">
        {`window.CHAT_KEY = 'cw_d00385e832271d8a249f4df4';`}
      </Script>
      <Script
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/chat/widget.js`}
        strategy="afterInteractive"
      />
    </>
  );
}
