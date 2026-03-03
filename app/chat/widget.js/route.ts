import { NextResponse } from "next/server";

// This route serves the embeddable chat widget JavaScript
// Visitors load this via: <script async src="https://yourdomain.com/chat/widget.js"></script>
//
// Supports window.CHAT_CONFIG for customization:
//   window.CHAT_CONFIG = {
//     color:    '#8b5cf6',          // bubble color (default mode only)
//     position: 'bottom-left',      // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
//     launcher: '#my-element',      // CSS selector → use your own element as the trigger
//   };
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
  var CID_KEY    = 'cw_cid_'     + CHAT_KEY;

  // ── Persistent visitor ID ─────────────────────────────────────────────
  function getVisitorId() {
    var vid = localStorage.getItem(STORAGE_KEY);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, vid);
    }
    return vid;
  }

  var visitorId      = getVisitorId();
  var conversationId = localStorage.getItem(CID_KEY) || null;

  // ── Read window.CHAT_CONFIG ──────────────────────────────────────────
  //   color    : hex color for the default bubble
  //   position : 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  //   launcher : CSS selector of an existing element to use as the trigger
  //              (your own image / button / icon).  Default bubble is hidden.
  var cfg      = (typeof window.CHAT_CONFIG === 'object' && window.CHAT_CONFIG) || {};
  var customSel  = cfg.launcher  || null;
  var color      = cfg.color     || '#0ea5e9';
  var position   = cfg.position  || 'bottom-right';

  var posV = position.startsWith('top')  ? 'top'   : 'bottom';
  var posH = position.endsWith('left')   ? 'left'  : 'right';

  // ── Base styles ────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#cw-launcher{position:fixed;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2147483647;border:none;transition:transform 0.2s,box-shadow 0.2s;}',
    '#cw-launcher:hover{transform:scale(1.08);}',
    '#cw-launcher svg{width:28px;height:28px;fill:white;}',
    '#cw-frame-wrap{position:fixed;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 120px);z-index:2147483646;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.18);border:1px solid rgba(0,0,0,0.08);transform:translateY(16px) scale(0.96);opacity:0;pointer-events:none;transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s;}',
    '#cw-frame-wrap.cw-open{transform:translateY(0) scale(1);opacity:1;pointer-events:all;}',
    '#cw-iframe{width:100%;height:100%;border:none;background:#fff;}',
  ].join('');
  document.head.appendChild(style);

  // ── Chat iframe popup ─────────────────────────────────────────────────
  var wrap   = document.createElement('div');
  wrap.id    = 'cw-frame-wrap';
  var iframe = document.createElement('iframe');
  iframe.id  = 'cw-iframe';
  iframe.src = BASE_URL + '/chat/embed'
    + '?key='  + encodeURIComponent(CHAT_KEY)
    + '&vid='  + encodeURIComponent(visitorId)
    + (conversationId ? '&cid=' + encodeURIComponent(conversationId) : '')
    + '&page=' + encodeURIComponent(window.location.href);
  iframe.setAttribute('allow', 'clipboard-write');
  wrap.appendChild(iframe);
  document.body.appendChild(wrap);

  var isOpen = false;

  var CHAT_SVG  = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-3H6V7h12v2z"/></svg>';
  var CLOSE_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

  function open() {
    isOpen = true;
    wrap.classList.add('cw-open');
    if (!customSel && defaultBtn) defaultBtn.innerHTML = CLOSE_SVG;
  }
  function close() {
    isOpen = false;
    wrap.classList.remove('cw-open');
    if (!customSel && defaultBtn) defaultBtn.innerHTML = CHAT_SVG;
  }

  // Persist conversation ID sent from iframe
  window.addEventListener('message', function(e) {
    if (e.origin !== BASE_URL) return;
    if (e.data && e.data.type === 'CW_CONVERSATION_ID') {
      conversationId = e.data.conversationId;
      localStorage.setItem(CID_KEY, conversationId);
    }
  });

  // ══════════════════════════════════════════════════════════════════════
  // MODE A — Custom launcher
  //   User points launcher:'#my-el' to any element they already have.
  //   We just attach click → open/close. Default bubble is NOT rendered.
  //   Position the popup near that element automatically.
  // ══════════════════════════════════════════════════════════════════════
  if (customSel) {
    function bindCustomLauncher() {
      var el = document.querySelector(customSel);
      if (!el) {
        console.warn('[ChatWidget] launcher element not found:', customSel,
          '\\nMake sure the element exists in the DOM before </body>.');
        return;
      }

      el.style.cursor = 'pointer';
      el.addEventListener('click', function() { isOpen ? close() : open(); });

      // Auto-position the popup relative to the element
      var rect       = el.getBoundingClientRect();
      var belowRoom  = window.innerHeight - rect.bottom;
      var aboveRoom  = rect.top;
      var rightRoom  = window.innerWidth  - rect.right;
      var leftRoom   = rect.left;

      var useV = belowRoom >= 320 || belowRoom >= aboveRoom ? 'bottom' : 'top';
      var useH = rightRoom >= 380 || rightRoom >= leftRoom  ? 'left'   : 'right';

      // Anchor popup so it appears just above/below the element
      if (useV === 'bottom') {
        wrap.style.bottom = (window.innerHeight - rect.top + 8) + 'px';
        wrap.style.top    = '';
      } else {
        wrap.style.top    = (rect.bottom + 8) + 'px';
        wrap.style.bottom = '';
      }
      if (useH === 'left') {
        wrap.style.left  = rect.left + 'px';
        wrap.style.right = '';
      } else {
        wrap.style.right = (window.innerWidth - rect.right) + 'px';
        wrap.style.left  = '';
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindCustomLauncher);
    } else {
      bindCustomLauncher();
    }

  // ══════════════════════════════════════════════════════════════════════
  // MODE B — Default floating bubble
  //   Renders the standard chat button with optional color + position.
  // ══════════════════════════════════════════════════════════════════════
  } else {
    var defaultBtn       = document.createElement('button');
    defaultBtn.id        = 'cw-launcher';
    defaultBtn.setAttribute('aria-label', 'Open chat');
    defaultBtn.innerHTML = CHAT_SVG;
    defaultBtn.style.background  = color;
    defaultBtn.style.boxShadow   = '0 4px 24px ' + color + '55';
    defaultBtn.style[posV]       = '24px';
    defaultBtn.style[posH]       = '24px';
    // Clear the opposite sides so position is clean
    defaultBtn.style[posV === 'bottom' ? 'top'  : 'bottom'] = '';
    defaultBtn.style[posH === 'right'  ? 'left' : 'right' ] = '';
    document.body.appendChild(defaultBtn);

    // Position popup above/beside the bubble
    wrap.style[posV]                               = '100px';
    wrap.style[posV === 'bottom' ? 'top' : 'bottom'] = '';
    wrap.style[posH]                               = '24px';
    wrap.style[posH === 'right' ? 'left' : 'right'] = '';

    defaultBtn.addEventListener('click', function() { isOpen ? close() : open(); });
  }

})();
`;

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
