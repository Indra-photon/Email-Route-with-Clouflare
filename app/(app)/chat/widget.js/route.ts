import { NextResponse } from "next/server";

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

  var cfg      = (typeof window.CHAT_CONFIG === 'object' && window.CHAT_CONFIG) || {};
  var customSel  = cfg.launcher  || null;
  var color      = cfg.color     || '#0ea5e9';
  var position   = cfg.position  || 'bottom-right';

  var posV = position.startsWith('top')  ? 'top'   : 'bottom';
  var posH = position.endsWith('left')   ? 'left'  : 'right';

  // ── Styles ─────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    // Button base
    '#cw-launcher{position:fixed;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:2147483647;border:none;outline:none;transition:transform 0.1s ease;}',
    '#cw-launcher:active{transform:scale(0.88);}',

    // Icon wrapper — both icons stacked absolutely
    '#cw-launcher .cw-icon-wrap{position:relative;width:26px;height:26px;}',
    '#cw-launcher .cw-icon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transition:transform 0.15s cubic-bezier(0.165,0.84,0.44,1),opacity 0.12s ease,filter 0.12s ease;will-change:transform,opacity,filter;}',
    '#cw-launcher .cw-icon svg{width:24px;height:24px;fill:none;stroke:white;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;display:block;}',

    // Default state: chat icon visible, close icon hidden (rotated behind)
    '#cw-launcher .cw-icon-chat{transform:rotate(0deg) scale(1);opacity:1;filter:blur(0px);}',
    '#cw-launcher .cw-icon-close{transform:rotate(-90deg) scale(0.7);opacity:0;filter:blur(3px);}',

    // Open state: chat icon exits, close icon enters
    '#cw-launcher.cw-open .cw-icon-chat{transform:rotate(90deg) scale(0.7);opacity:0;filter:blur(3px);}',
    '#cw-launcher.cw-open .cw-icon-close{transform:rotate(0deg) scale(1);opacity:1;filter:blur(0px);}',

    // Frame wrap
    '#cw-frame-wrap{position:fixed;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 120px);z-index:2147483646;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.18),0 0 0 1px rgba(0,0,0,0.06);transform:translateY(16px) scale(0.96);opacity:0;pointer-events:none;transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s ease;}',
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
    + '&page=' + encodeURIComponent(window.location.href);
  iframe.setAttribute('allow', 'clipboard-write');
  wrap.appendChild(iframe);
  document.body.appendChild(wrap);

  var isOpen = false;

  // Tabler IconMessageChatbot + IconX (stroke-based)
  var CHAT_SVG  = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"/><path d="M9.5 9h.01"/><path d="M14.5 9h.01"/><path d="M9.5 13a3.5 3.5 0 0 0 5 0"/></svg>';
  var CLOSE_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>';

  function open(btn) {
    isOpen = true;
    wrap.classList.add('cw-open');
    if (btn) btn.classList.add('cw-open');
  }

  function close(btn) {
    isOpen = false;
    wrap.classList.remove('cw-open');
    if (btn) btn.classList.remove('cw-open');
  }

  window.addEventListener('message', function(e) {
    if (e.origin !== BASE_URL) return;
    if (e.data && e.data.type === 'CW_CONVERSATION_ID') {
      conversationId = e.data.conversationId;
      localStorage.setItem(CID_KEY, conversationId);
    }
  });

  // ── MODE A — Custom launcher ──────────────────────────────────────────
  if (customSel) {
    function bindCustomLauncher() {
      var el = document.querySelector(customSel);
      if (!el) {
        console.warn('[ChatWidget] launcher element not found:', customSel);
        return;
      }
      el.style.cursor = 'pointer';
      el.addEventListener('click', function() { isOpen ? close(null) : open(null); });

      var rect      = el.getBoundingClientRect();
      var belowRoom = window.innerHeight - rect.bottom;
      var aboveRoom = rect.top;
      var rightRoom = window.innerWidth  - rect.right;
      var leftRoom  = rect.left;
      var useV = belowRoom >= 320 || belowRoom >= aboveRoom ? 'bottom' : 'top';
      var useH = rightRoom >= 380 || rightRoom >= leftRoom  ? 'left'   : 'right';

      if (useV === 'bottom') { wrap.style.bottom = (window.innerHeight - rect.top + 8) + 'px'; wrap.style.top = ''; }
      else                   { wrap.style.top = (rect.bottom + 8) + 'px'; wrap.style.bottom = ''; }
      if (useH === 'left')   { wrap.style.left = rect.left + 'px'; wrap.style.right = ''; }
      else                   { wrap.style.right = (window.innerWidth - rect.right) + 'px'; wrap.style.left = ''; }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindCustomLauncher);
    else bindCustomLauncher();

  // ── MODE B — Default floating bubble ─────────────────────────────────
  } else {
    var defaultBtn = document.createElement('button');
    defaultBtn.id  = 'cw-launcher';
    defaultBtn.setAttribute('aria-label', 'Open chat');
    defaultBtn.style.background = color;
    defaultBtn.style.boxShadow  = '0 4px 20px ' + color + '66';
    defaultBtn.style[posV]      = '24px';
    defaultBtn.style[posH]      = '24px';
    defaultBtn.style[posV === 'bottom' ? 'top'  : 'bottom'] = '';
    defaultBtn.style[posH === 'right'  ? 'left' : 'right' ] = '';

    // Build icon wrapper with both icons always in DOM
    defaultBtn.innerHTML = '<span class="cw-icon-wrap">'
      + '<span class="cw-icon cw-icon-chat">' + CHAT_SVG + '</span>'
      + '<span class="cw-icon cw-icon-close">' + CLOSE_SVG + '</span>'
      + '</span>';

    document.body.appendChild(defaultBtn);

    wrap.style[posV]                                = '100px';
    wrap.style[posV === 'bottom' ? 'top' : 'bottom'] = '';
    wrap.style[posH]                                = '24px';
    wrap.style[posH === 'right'  ? 'left' : 'right' ] = '';

    defaultBtn.addEventListener('click', function() {
      isOpen ? close(defaultBtn) : open(defaultBtn);
    });
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
