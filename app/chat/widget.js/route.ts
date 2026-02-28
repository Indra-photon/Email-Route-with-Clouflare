import { NextResponse } from "next/server";

// This route serves the embeddable chat widget JavaScript
// Visitors load this via: <script async src="https://yourdomain.com/chat/widget.js"></script>
export async function GET(request: Request) {
    const { origin } = new URL(request.url);

    const script = `
(function() {
  'use strict';

  var CHAT_KEY = window.CHAT_KEY;
  if (!CHAT_KEY) {
    console.error('[ChatWidget] window.CHAT_KEY is not defined.');
    return;
  }

  var BASE_URL = '${origin}';
  var STORAGE_KEY = 'cw_visitor_' + CHAT_KEY;
  var CID_KEY = 'cw_cid_' + CHAT_KEY;

  // Generate or retrieve persistent visitor ID
  function getVisitorId() {
    var vid = localStorage.getItem(STORAGE_KEY);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, vid);
    }
    return vid;
  }

  var visitorId = getVisitorId();
  var conversationId = localStorage.getItem(CID_KEY) || null;

  // --- Inject styles ---
  var style = document.createElement('style');
  style.textContent = [
    '#cw-launcher{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#0ea5e9;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2147483647;box-shadow:0 4px 24px rgba(14,165,233,0.4);border:none;transition:transform 0.2s,box-shadow 0.2s;}',
    '#cw-launcher:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(14,165,233,0.55);}',
    '#cw-launcher svg{width:28px;height:28px;fill:white;}',
    '#cw-frame-wrap{position:fixed;bottom:100px;right:24px;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 120px);z-index:2147483646;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.18);border:1px solid rgba(0,0,0,0.08);transform:translateY(16px) scale(0.96);opacity:0;pointer-events:none;transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s;}',
    '#cw-frame-wrap.cw-open{transform:translateY(0) scale(1);opacity:1;pointer-events:all;}',
    '#cw-iframe{width:100%;height:100%;border:none;background:#fff;}',
  ].join('');
  document.head.appendChild(style);

  // --- Launcher button ---
  var launcher = document.createElement('button');
  launcher.id = 'cw-launcher';
  launcher.setAttribute('aria-label', 'Open chat');
  launcher.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/></svg>';
  document.body.appendChild(launcher);

  // --- Iframe wrapper ---
  var wrap = document.createElement('div');
  wrap.id = 'cw-frame-wrap';

  var iframe = document.createElement('iframe');
  iframe.id = 'cw-iframe';
  var embedSrc = BASE_URL + '/chat/embed?key=' + encodeURIComponent(CHAT_KEY) + '&vid=' + encodeURIComponent(visitorId) + (conversationId ? '&cid=' + encodeURIComponent(conversationId) : '') + '&page=' + encodeURIComponent(window.location.href);
  iframe.src = embedSrc;
  iframe.setAttribute('allow', 'clipboard-write');
  wrap.appendChild(iframe);
  document.body.appendChild(wrap);

  var isOpen = false;

  function open() {
    isOpen = true;
    wrap.classList.add('cw-open');
    launcher.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  }

  function close() {
    isOpen = false;
    wrap.classList.remove('cw-open');
    launcher.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/></svg>';
  }

  launcher.addEventListener('click', function() {
    if (isOpen) { close(); } else { open(); }
  });

  // Listen for conversationId coming from the iframe
  window.addEventListener('message', function(e) {
    if (e.origin !== BASE_URL) return;
    if (e.data && e.data.type === 'CW_CONVERSATION_ID') {
      conversationId = e.data.conversationId;
      localStorage.setItem(CID_KEY, conversationId);
    }
  });

})();
`;

    return new NextResponse(script, {
        headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
    });
}
