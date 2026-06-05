// Returns the function SOURCE to pass to page.evaluate. Kept as a factory so the
// browser context gets a self-contained function with no Node closures.
export function extractBlocksFn() {
  return () => {
    const blocks = [];
    const SECTION_TAGS = new Set(['SECTION', 'HEADER', 'FOOTER', 'MAIN', 'ASIDE', 'NAV']);
    function sectionHint(el) {
      const id = el.id ? '#' + el.id : '';
      const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
      const label = el.getAttribute('aria-label') || '';
      return [el.tagName.toLowerCase(), id, cls, label].filter(Boolean).join(' ').trim();
    }
    function visible(el) {
      const s = window.getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
      return true;
    }
    let sectionStack = [];
    function walk(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        const tag = el.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEMPLATE') return;
        if (!visible(el)) return;
        if (SECTION_TAGS.has(tag)) {
          blocks.push({ type: 'section', tag: tag.toLowerCase(), section: sectionHint(el) });
        }
        if (/^H[1-6]$/.test(tag)) {
          blocks.push({ type: 'heading', tag, level: +tag[1], text: el.innerText.trim() });
          return;
        }
        if (tag === 'IMG') {
          const r = el.getBoundingClientRect();
          blocks.push({ type: 'img', tag: 'IMG', src: el.currentSrc || el.src || el.getAttribute('data-src') || '',
            srcset: el.getAttribute('srcset') || el.getAttribute('data-srcset') || '',
            alt: el.getAttribute('alt') || '', w: el.naturalWidth || Math.round(r.width), h: el.naturalHeight || Math.round(r.height) });
          return;
        }
        if (tag === 'A') {
          const txt = el.innerText.trim();
          if (txt) blocks.push({ type: 'link', tag: 'A', text: txt, href: el.href || '' });
          // still walk children for nested imgs
        }
        if (tag === 'BUTTON' || (tag === 'INPUT' && (el.type === 'button' || el.type === 'submit'))) {
          blocks.push({ type: 'button', tag, text: (el.innerText || el.value || '').trim() });
          return;
        }
        // background-image capture (best effort)
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg.startsWith('url(')) {
          const m = bg.match(/url\(["']?(.*?)["']?\)/);
          if (m && m[1] && !m[1].startsWith('data:')) blocks.push({ type: 'bgimg', tag: tag.toLowerCase(), src: m[1] });
        }
        if (tag === 'P' || tag === 'LI' || tag === 'BLOCKQUOTE' || tag === 'FIGCAPTION' || tag === 'TD' || tag === 'TH') {
          const txt = el.innerText.trim();
          // only push if this element has no block-level element children carrying the same text
          const hasBlockChild = [...el.children].some((c) => /^(P|LI|UL|OL|DIV|SECTION|H[1-6]|TABLE)$/.test(c.tagName));
          if (txt && !hasBlockChild) { blocks.push({ type: 'text', tag, text: txt }); return; }
        }
        for (const child of el.childNodes) walk(child);
      }
    }
    walk(document.body);
    return { title: document.title, blocks };
  };
}

// Render the extracted blocks to annotated Markdown. `resolveImg(src,srcset)` returns
// the local photos/ path (or original url if not downloaded).
export function blocksToMarkdown(pageUrl, data, imgIndex) {
  const lines = [`<!-- ${pageUrl} -->`, `# [TITLE] ${data.title}`, ''];
  for (const b of data.blocks) {
    if (b.type === 'section') lines.push('', `[SECTION: ${b.section}]`);
    else if (b.type === 'heading') lines.push(`${'#'.repeat(b.level)} [${b.tag}] ${b.text}`);
    else if (b.type === 'text') lines.push(`[${b.tag === 'LI' ? 'LI' : 'P'}] ${b.text}`);
    else if (b.type === 'link') lines.push(`[LINK] ${b.text} → ${b.href}`);
    else if (b.type === 'button') lines.push(`[BUTTON] ${b.text}`);
    else if (b.type === 'img') {
      const local = imgIndex.get(b.__key) || b.src;
      lines.push(`[IMG] ${local}  (alt: "${b.alt}", natural ${b.w}×${b.h})`);
    } else if (b.type === 'bgimg') {
      const local = imgIndex.get(b.__key) || b.src;
      lines.push(`[BG-IMG] ${local}`);
    }
  }
  return lines.join('\n') + '\n';
}
