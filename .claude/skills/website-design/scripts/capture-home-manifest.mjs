/**
 * capture-home-manifest.mjs — DATA MODULE for the canonical home-page reference-screenshot harness.
 *
 * Source of truth for poses + predicates: references/approved/INDEX.md probe facts, consolidated with the
 * proven scratch capture scripts (.scratch/vbec-numeral-fix/refresh, .scratch/approved-capture*, .scratch/retake-*).
 * The runner (capture-home.mjs, same folder) interprets this manifest mechanically — no design judgment here.
 *
 * Shape of a shot:
 *   {
 *     file:           output PNG name (matches the approved tree),
 *     section:        'NN' prefix used by --section filtering,
 *     pose:           human label (mirrors the INDEX row),
 *     probe:          key into PROBES — runs IN-PAGE, returns the state object recorded in the report,
 *     probeArgs:      optional single arg passed to the probe (selector string or object),
 *     walk:           how to reach the pose (strategy + params; 'converge' walks carry their own probe/step/done),
 *     poseCondition:  predicate over the final probe state (+ ctx {VW,VH,cls}) — the shot FAILS if false,
 *     settleMs:       post-walk settle before probing/shooting,
 *     capture:        'viewport' (default) | 'element' (desktop roster full-section shot only),
 *   }
 *
 * Walk strategies (executed by the runner):
 *   top            — scroll to 0.
 *   band           — center a short band in the viewport with its top kept >= minTop (certs / affiliates).
 *   sectionTarget  — stepped REAL scrolls to target({absTop,height}, ctx); optional through:true first walks one
 *                    pass down the section so below-fold reveals fire (desktop roster element shot).
 *   converge       — probe-driven loop: probe in-page, step(state,ctx) -> scroll delta px, done(state,ctx) -> bool.
 *                    forwardOnly walks never scroll backward (careers auto-advance fights backward scrolls).
 *   hoverRow       — center a row and hover it (desktop roster hover, fine-pointer only).
 *   finalCta       — walk to page bottom, then frame headline ~100px from top with socials in-frame.
 *
 * Shot counts: desktop 19, phone 15, tablet-portrait 15, tablet-landscape 17 — total 66.
 */

export const BASE_URL = 'http://localhost:3001/';

export const CLASSES = {
  'desktop':          { width: 1440, height: 900,  dpr: 1, touch: false },
  'phone':            { width: 390,  height: 844,  dpr: 3, touch: true  },
  'tablet-portrait':  { width: 834,  height: 1194, dpr: 2, touch: true  },
  'tablet-landscape': { width: 1194, height: 834,  dpr: 2, touch: true  },
};

const CERTS_SEL = '.mw-trust--tsb01, .mw-certs, .mw-trust';

// ── In-page probes (serialized into page.evaluate; must be self-contained) ──────────────────────

export const PROBES = {
  hero: () => {
    const el = document.querySelector('.mw-hero');
    const t = document.querySelector('.mw-hero h1, .mw-hero h2, .mw-hero [class*="title"], .mw-hero [class*="heading"]');
    return {
      scrollY: window.scrollY,
      top: el ? el.getBoundingClientRect().top : null,
      titleOpacity: t ? parseFloat(getComputedStyle(t).opacity) : null,
      scrollWidth: document.documentElement.scrollWidth,
    };
  },

  // Generic section probe; arg = selector.
  section: (sel) => {
    const el = document.querySelector(sel);
    if (!el) return { missing: sel, scrollY: window.scrollY };
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const imgs = Array.from(el.querySelectorAll('img'));
    // In-viewport = intersects BOTH axes — peek-scroll strips edge-cut seals/logos horizontally by design, and those lazy offscreen images never load.
    const inVP = imgs.filter((i) => { const ir = i.getBoundingClientRect(); return ir.top < vh && ir.bottom > 0 && ir.left < vw && ir.right > 0; });
    return {
      scrollY: window.scrollY, top: r.top, bottom: r.bottom, height: r.height, absTop: window.scrollY + r.top,
      imgCount: imgs.length, imgUnloaded: inVP.filter((i) => i.naturalWidth === 0).length,
      scrollWidth: document.documentElement.scrollWidth,
    };
  },

  // Reveal-settle probe; arg = selector. Counts unsettled data-reveal items among the first 8.
  reveals: (sel) => {
    const el = document.querySelector(sel);
    if (!el) return { missing: sel, scrollY: window.scrollY };
    const r = el.getBoundingClientRect();
    const items = Array.from(el.querySelectorAll('[data-reveal], [data-reveal-stagger] > *')).slice(0, 8);
    const unsettled = items.filter((it) => {
      const cs = getComputedStyle(it);
      return parseFloat(cs.opacity) < 0.95 || (cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)');
    }).length;
    return { scrollY: window.scrollY, top: r.top, bottom: r.bottom, height: r.height, absTop: window.scrollY + r.top, revealItems: items.length, revealUnsettled: unsettled };
  },

  rosterHover: (args) => {
    const rows = document.querySelectorAll('.mw-roster2__row');
    const row = rows[args.index];
    if (!row) return { missing: '.mw-roster2__row[' + args.index + ']', scrollY: window.scrollY };
    const name = row.querySelector('.mw-roster2__row-name');
    const cs = name ? getComputedStyle(name) : null;
    let tx = 0;
    if (cs && cs.transform && cs.transform.indexOf('matrix(') === 0) tx = parseFloat(cs.transform.split(',')[4]) || 0;
    return { scrollY: window.scrollY, rowTop: row.getBoundingClientRect().top, nameTranslateX: tx, letterSpacing: cs ? cs.letterSpacing : null };
  },

  diamonds: () => {
    const el = document.querySelector('.mw-secd');
    if (!el) return { missing: '.mw-secd', scrollY: window.scrollY };
    const r = el.getBoundingClientRect();
    return { scrollY: window.scrollY, top: r.top, bottom: r.bottom, height: r.height, absTop: window.scrollY + r.top, pinned: el.classList.contains('is-secd-pinned') };
  },

  lifetime: () => {
    const lr = document.querySelector('.mw-lr');
    if (!lr) return { missing: '.mw-lr', scrollY: window.scrollY };
    const r = lr.getBoundingClientRect();
    const panel = document.querySelector('.mw-lr__panel');
    const chain = document.querySelector('.mw-lr-reel__chain[data-reveal="clip"]');
    let clipRight = null; // null = chain has no live clip yet (or fully open)
    if (chain && chain.style.clipPath) {
      const m = chain.style.clipPath.match(/inset\(\s*[\d.]+px\s+([\d.]+)px/);
      if (m) clipRight = parseFloat(m[1]);
    }
    const vh = window.innerHeight;
    const seals = Array.from(document.querySelectorAll('.mw-lr-seal'));
    const sealsInVP = seals.filter((s) => { const sr = s.getBoundingClientRect(); return sr.top < vh && sr.bottom > 0; });
    const legOps = sealsInVP.map((s) => { const leg = s.querySelector('.mw-lr-seal__legend'); return leg ? parseFloat(getComputedStyle(leg).opacity) : null; }).filter((v) => v !== null && !Number.isNaN(v));
    const fac2 = document.querySelector('.mw-fac2');
    return {
      scrollY: window.scrollY, top: r.top, bottom: r.bottom, height: r.height, absTop: window.scrollY + r.top,
      panelW: panel ? panel.style.getPropertyValue('--lr-panel-w').trim() : null,
      zoom: panel ? parseFloat(panel.style.getPropertyValue('--lr-zoom')) || null : null,
      clipRight,
      reelDone: !!document.querySelector('.mw-lr-reel[data-done]'),
      sealsInVP: sealsInVP.length,
      legOpMin: legOps.length ? Math.min.apply(null, legOps) : null,
      fac2Top: fac2 ? fac2.getBoundingClientRect().top : null,
    };
  },

  // VBEC pinned-class probe (desktop + tablet-landscape) — from .scratch/vbec-numeral-fix/refresh.
  vbecPin: () => {
    const track = document.querySelector('.mw-fac2-track');
    if (!track) return { missing: '.mw-fac2-track', scrollY: window.scrollY };
    const header = document.querySelector('.tl-topbar');
    const headOff = header ? Math.round(header.getBoundingClientRect().bottom) : 115;
    const vh = window.innerHeight;
    const tr = track.getBoundingClientRect();
    const total = Math.max(1, track.offsetHeight - vh + headOff);
    const right = document.querySelector('.mw-fac2__right');
    const media = document.querySelector('.mw-fac2__media');
    const figclip = document.querySelector('.mw-fac2__figclip');
    const cells = Array.from(document.querySelectorAll('.mw-cap-dia__cell'));
    const capOps = cells.map((c) => parseFloat(c.style.getPropertyValue('--cap-op')) || 0);
    const capScs = cells.map((c) => parseFloat(c.style.getPropertyValue('--cap-sc')) || 0);
    return {
      scrollY: window.scrollY, total,
      P: (headOff - tr.top) / total,
      rightY: parseFloat(right && right.style.getPropertyValue('--fac2-right-y')) || 0,
      mediaX: parseFloat(media && media.style.getPropertyValue('--fac2-media-x')) || 0,
      figH: parseFloat(figclip && figclip.style.getPropertyValue('--fac2-fig-h')) || 0,
      capOpMin: capOps.length ? Math.min.apply(null, capOps) : null,
      capScMin: capScs.length ? Math.min.apply(null, capScs) : null,
    };
  },

  // VBEC flow-class probe (phone + tablet-portrait) — from .scratch/vbec-numeral-fix/refresh shootFlowClass.
  vbecFlow: () => {
    const sec = document.querySelector('.mw-fac2');
    if (!sec) return { missing: '.mw-fac2', scrollY: window.scrollY };
    const iacc = document.querySelector('.mw-fac2 .mw-iacc');
    const alt = document.querySelector('.mw-capalt');
    const sr = sec.getBoundingClientRect();
    return {
      scrollY: window.scrollY,
      secTop: sr.top, secBottom: sr.bottom,
      iaccTop: iacc ? iacc.getBoundingClientRect().top : null,
      iaccBottom: iacc ? iacc.getBoundingClientRect().bottom : null,
      altTop: alt ? alt.getBoundingClientRect().top : null,
      capaltP: alt ? alt.style.getPropertyValue('--capalt-p') || null : null,
    };
  },

  // Careers zoom-collage probe — vars live on .mw-czoom__track inline style (retake-tabland finding).
  careers: () => {
    const sec = document.querySelector('.mw-czoom');
    if (!sec) return { missing: '.mw-czoom', scrollY: window.scrollY };
    const r = sec.getBoundingClientRect();
    const track = document.querySelector('.mw-czoom__track');
    const gv = (n) => { const v = track ? track.style.getPropertyValue(n) : ''; return v === '' ? null : parseFloat(v); };
    return {
      scrollY: window.scrollY, top: r.top, bottom: r.bottom, height: r.height, absTop: window.scrollY + r.top,
      introOut: gv('--intro-out'), reveal: gv('--reveal'), zoom: gv('--center-img-zoom'),
    };
  },

  finalCta: () => {
    const sec = document.querySelector('.mw-final');
    if (!sec) return { missing: '.mw-final', scrollY: window.scrollY };
    const r = sec.getBoundingClientRect();
    const heads = Array.from(document.querySelectorAll('.mw-final h1, .mw-final h2, .mw-final h3'));
    const head = heads.find((h) => h.textContent.toUpperCase().indexOf('TALK TO') !== -1) || heads[0] || null;
    const hr = head ? head.getBoundingClientRect() : null;
    let socials = null;
    const direct = sec.querySelector('.mw-final__socials, [class*="social"]');
    if (direct) socials = direct.getBoundingClientRect();
    if (!socials) {
      const links = sec.querySelectorAll('a[href*="linkedin"], a[href*="facebook"], a[href*="instagram"], a[href*="youtube"], a[href*="twitter"]');
      if (links.length) {
        const rs = Array.from(links).map((a) => a.getBoundingClientRect());
        socials = { top: Math.min.apply(null, rs.map((x) => x.top)), bottom: Math.max.apply(null, rs.map((x) => x.bottom)) };
      }
    }
    return {
      scrollY: window.scrollY, top: r.top, bottom: r.bottom, height: r.height, absTop: window.scrollY + r.top,
      headTop: hr ? hr.top : null, headAbsTop: hr ? window.scrollY + hr.top : null,
      socialsBottom: socials ? socials.bottom : null, socialsAbsBottom: socials ? window.scrollY + socials.bottom : null,
    };
  },
};

// ── Node-side helpers used by step/done/poseCondition functions ─────────────────────────────────

const clamp = (v, m) => Math.max(-m, Math.min(m, v));

// Careers dive geometry: --dive-vh 125, --freeze-vh 25 (same on every class; from careers.mjs + retake-phone).
const diveDist = (ctx) => 1.25 * ctx.VH;
const freezeDist = (ctx) => 0.25 * ctx.VH;
const careersP = (s, ctx) => (s.scrollY - s.absTop) / diveDist(ctx);

// ── Per-class shot lists ────────────────────────────────────────────────────────────────────────

function classShots(cls) {
  const desktop = cls === 'desktop';
  const tabland = cls === 'tablet-landscape';
  const pinClass = desktop || tabland;                       // lifetime + VBEC pin on these classes
  // History stop-2 depth below section top: desktop 850 (INDEX scrollY 8313 -> 9163), phone ~750 (INDEX), tablets ~1 viewport (approved tabport walk used +1200, tabland +834).
  const histPlus = desktop ? 850 : cls === 'phone' ? 750 : CLASSES[cls].height;
  const shots = [];

  // 01 — hero
  shots.push({
    file: '01-hero-rest.png', section: '01', pose: 'rest, load-reveal settled',
    probe: 'hero', settleMs: 600,
    walk: { strategy: 'top' },
    poseCondition: (s) => s.scrollY <= 2 && (s.titleOpacity == null || s.titleOpacity >= 0.99),
    poseNote: 'scroll 0; hero title opacity 1',
  });

  // 02 — certs band, centered, top kept clear of the sticky header
  shots.push({
    file: '02-certs-rest.png', section: '02', pose: 'rest (band centered)',
    probe: 'section', probeArgs: CERTS_SEL, settleMs: 1200,
    walk: { strategy: 'band', selector: CERTS_SEL, minTop: 120 },
    poseCondition: (s, ctx) => !s.missing && s.top >= 100 && s.bottom <= ctx.VH + 4 && s.imgUnloaded === 0,
    poseNote: 'band fully in frame, top >= ~120px, all seal images loaded',
  });

  // 03 — roster
  if (desktop) {
    shots.push({
      file: '03-roster-rest.png', section: '03', pose: 'rest, full section',
      capture: 'element', captureSelector: '.mw-roster2',
      probe: 'reveals', probeArgs: '.mw-roster2', settleMs: 1500,
      walk: { strategy: 'sectionTarget', selector: '.mw-roster2', through: true, target: (m) => m.absTop },
      poseCondition: (s) => !s.missing && s.revealUnsettled === 0 && s.height > 1200,
      poseNote: 'full-height element capture (the one sanctioned element shot — fine-pointer, unpinned section); all reveals settled',
    });
    shots.push({
      file: '03-roster-hover.png', section: '03', pose: 'hover on 5th list title',
      probe: 'rosterHover', probeArgs: { index: 4 }, settleMs: 600,
      walk: { strategy: 'hoverRow', rowSelector: '.mw-roster2__row', index: 4 },
      poseCondition: (s) => !s.missing && s.nameTranslateX >= 5,
      poseNote: 'row name translated ~+10px X during hover (INDEX micro-motion exemplar)',
    });
  } else {
    shots.push({
      file: '03-roster-rest.png', section: '03', pose: 'rest, section top frame',
      probe: 'reveals', probeArgs: '.mw-roster2', settleMs: 1200,
      walk: { strategy: 'sectionTarget', selector: '.mw-roster2', target: (m) => m.absTop },
      poseCondition: (s) => !s.missing && Math.abs(s.top) <= 60 && s.revealUnsettled === 0,
      poseNote: 'section top at viewport top, visible reveals settled',
    });
    shots.push({
      file: '03-roster-rest-b.png', section: '03', pose: 'rest, one step deeper (~60%)',
      probe: 'reveals', probeArgs: '.mw-roster2', settleMs: 800,
      walk: { strategy: 'sectionTarget', selector: '.mw-roster2', target: (m) => m.absTop + Math.floor(m.height * 0.6) },
      poseCondition: (s, ctx) => !s.missing && s.top < 0 && s.bottom > ctx.VH * 0.4,
      poseNote: 'deeper roster frame, section still spanning the viewport',
    });
  }

  // 04 — sector diamonds
  if (desktop) {
    shots.push({
      file: '04-diamonds-mid.png', section: '04', pose: 'mid-assembly (pre-pin)',
      probe: 'diamonds', settleMs: 250,
      walk: {
        strategy: 'converge', probe: 'diamonds', maxSteps: 80, stepWait: 300,
        step: (s, ctx) => (s.missing || s.top > ctx.VH * 2) ? 500 : clamp(s.top - 320, 400),
        done: (s) => !s.missing && !s.pinned && Math.abs(s.top - 320) <= 110,
      },
      poseCondition: (s) => !s.pinned && s.top > 150 && s.top < 480,
      poseNote: 'rect.top ~320 pre-pin, diamonds in flight (INDEX fact)',
    });
    shots.push({
      file: '04-diamonds-settled.png', section: '04', pose: 'settled (pinned)',
      probe: 'diamonds', settleMs: 500,
      walk: {
        strategy: 'converge', probe: 'diamonds', maxSteps: 40, stepWait: 320,
        step: (s, ctx) => (s.pinned && s.top <= 5 && s.bottom >= ctx.VH - 5) ? 0 : 300,
        done: (s, ctx) => !s.missing && s.pinned && s.top <= 5 && s.bottom >= ctx.VH - 5,
      },
      poseCondition: (s, ctx) => s.pinned && s.top <= 5 && s.bottom >= ctx.VH - 5,
      poseNote: 'is-secd-pinned set, rect.top 0, section filling viewport',
    });
  } else {
    shots.push({
      file: '04-diamonds-settled.png', section: '04', pose: 'settled (flowing)',
      probe: 'diamonds', settleMs: 1000,
      walk: { strategy: 'sectionTarget', selector: '.mw-secd', target: (m, ctx) => m.absTop + Math.max(0, m.height / 2 - ctx.VH / 2) },
      poseCondition: (s, ctx) => !s.missing && s.top < ctx.VH * 0.55 && s.bottom > ctx.VH * 0.45,
      poseNote: 'diamond strip centered in frame (no pin on this class)',
    });
  }

  // 05 — lifetime band
  if (pinClass) {
    shots.push({
      file: '05-lifetime-mid.png', section: '05', pose: 'mid-choreography (pinned, chain mid-draw)',
      probe: 'lifetime', settleMs: 300,
      walk: {
        strategy: 'converge', probe: 'lifetime', maxSteps: 90, stepWait: 280,
        step: (s, ctx) => {
          if (s.missing) return 500;
          if (s.top > 10) return Math.max(120, Math.min(450, s.top / 2));
          if (s.clipRight === null || s.clipRight >= (desktop ? 800 : 900)) return 150;
          if (s.clipRight <= 30) return -100; // overshot the draw — small reversible back-step
          return 0;
        },
        done: (s) => !s.missing && s.top >= -5 && s.top <= 5 && s.clipRight !== null && s.clipRight > 30 && s.clipRight < (desktop ? 800 : 900),
      },
      poseCondition: (s) => s.top >= -8 && s.top <= 8 && s.clipRight !== null && s.clipRight > 20 && s.clipRight < 950,
      poseNote: 'section pinned (top ~0), chain clip mid-draw (diamond assembly in progress)',
    });
    shots.push({
      file: '05-lifetime-settled.png', section: '05', pose: tabland ? 'settled (3 diamonds + captions, VBEC not covering)' : 'settled (panel 100%, zoom max)',
      probe: 'lifetime', settleMs: 800,
      walk: {
        strategy: 'converge', probe: 'lifetime', maxSteps: 70, stepWait: 280,
        step: (s) => {
          if (s.missing) return 500;
          if (s.reelDone) return 0;
          if (s.top > 10) return Math.max(150, Math.min(450, s.top / 2));
          return 200;
        },
        done: (s) => !s.missing && s.reelDone,
      },
      poseCondition: tabland
        ? (s, ctx) => s.reelDone && s.sealsInVP >= 3 && (s.legOpMin == null || s.legOpMin > 0.7) && (s.fac2Top == null || s.fac2Top > ctx.VH - 20)
        : (s) => s.reelDone && (s.panelW == null || s.panelW === '100%') && (s.zoom == null || s.zoom >= 1.3),
      poseNote: tabland ? 'reel done, >=3 diamond seals with captions in frame, fac2 top still below viewport' : 'reel done, --lr-panel-w 100%, --lr-zoom at max 1.4',
    });
  } else {
    shots.push({
      file: '05-lifetime-settled.png', section: '05', pose: 'settled, flow mode',
      probe: 'lifetime', settleMs: 1200,
      // Phone framing = retake-phone formula; tablet-portrait framing = approved-capture-tabport (lr-track top at viewport top).
      walk: cls === 'phone'
        ? { strategy: 'sectionTarget', selector: '.mw-lr', target: (m, ctx) => m.absTop + Math.min(m.height * 0.25, ctx.VH * 0.3) - ctx.VH / 4 }
        : { strategy: 'sectionTarget', selector: '.mw-lr-track', target: (m) => m.absTop },
      poseCondition: (s, ctx) => !s.missing && s.top < ctx.VH * 0.6 && s.bottom > ctx.VH * 0.4,
      poseNote: 'one-row diamonds + caption framed, flow mode (pin gated off on portrait)',
    });
  }

  // 06 — VBEC facility (media-split)
  if (desktop) {
    shots.push({
      file: '06-vbec-entrance.png', section: '06', pose: 'entrance (cream rising over walnut)',
      probe: 'vbecPin', settleMs: 350, imageScope: '.mw-fac2',
      walk: {
        strategy: 'converge', probe: 'vbecPin', maxSteps: 110, stepWait: 190,
        // rightY shrinks fast near pin-in (easeInOut tail) — small steps near the window (vbec-refresh logic, verbatim)
        step: (s) => s.missing ? 500 : (s.P <= -0.6 ? 500 : (s.rightY > 300 ? 180 : s.rightY > 84 ? 22 : -16)),
        done: (s) => !s.missing && s.rightY > 48 && s.rightY < 84 && s.P < 0,
      },
      poseCondition: (s) => s.rightY > 40 && s.rightY < 95 && s.P < 0.02,
      poseNote: '--fac2-right-y ~60px, photo column mid-rise, pre-pin (INDEX: 60.3px)',
    });
  }
  if (pinClass) {
    shots.push({
      file: '06-vbec-pinned-mid.png', section: '06', pose: 'pinned mid (highlights grown, pre-swipe)',
      probe: 'vbecPin', settleMs: 400, imageScope: '.mw-fac2',
      walk: {
        strategy: 'converge', probe: 'vbecPin', maxSteps: 70, stepWait: 200,
        step: (s) => s.missing ? 500 : clamp((0.135 - s.P) * s.total, 560),
        done: (s) => !s.missing && s.P >= 0.105 && s.P <= 0.175,
      },
      poseCondition: (s) => s.figH > 100 && Math.abs(s.mediaX) < 60 && s.P >= 0.08 && s.P <= 0.19,
      poseNote: 'pinned at P ~0.13-0.17, --fac2-fig-h grown (164 desktop / 141 tabland), --fac2-media-x 0 (swipe not started)',
    });
  }
  shots.push(pinClass ? {
    file: '06-vbec-settled.png', section: '06', pose: 'settled (capability diamonds, still pinned)',
    probe: 'vbecPin', settleMs: 500, imageScope: '.mw-fac2',
    walk: {
      strategy: 'converge', probe: 'vbecPin', maxSteps: 80, stepWait: 200,
      step: (s) => s.missing ? 500 : clamp((0.93 - s.P) * s.total, 560),
      done: (s) => !s.missing && s.P >= 0.915 && s.P <= 0.965,
    },
    poseCondition: (s, ctx) => s.capOpMin != null && s.capOpMin >= 0.99 && s.mediaX > ctx.VW * 0.85 && s.P < 1,
    poseNote: 'still pinned at P ~0.93, media swiped off, all 8 capability diamonds at --cap-op/--cap-sc 1.000',
  } : {
    file: '06-vbec-settled.png', section: '06', pose: 'settled, flow mode (photo-card edge + capabilities entering)',
    probe: 'vbecFlow', settleMs: 500, imageScope: '.mw-fac2',
    walk: {
      strategy: 'converge', probe: 'vbecFlow', maxSteps: 70, stepWait: 200,
      step: cls === 'phone'
        ? (s, ctx) => s.missing ? 500 : (s.secTop >= ctx.VH ? Math.min(500, s.secTop - ctx.VH + 60) : clamp((s.iaccBottom == null ? 500 : s.iaccBottom - 78), 420))
        : (s, ctx) => s.missing ? 500 : (s.secTop >= ctx.VH ? Math.min(500, s.secTop - ctx.VH + 60) : clamp((s.iaccTop == null ? 500 : s.iaccTop - 62), 420)),
      done: cls === 'phone'
        ? (s) => !s.missing && s.iaccBottom != null && Math.abs(s.iaccBottom - 78) <= 14
        : (s) => !s.missing && s.iaccTop != null && Math.abs(s.iaccTop - 62) <= 14,
    },
    poseCondition: cls === 'phone'
      ? (s, ctx) => s.iaccBottom != null && Math.abs(s.iaccBottom - 78) <= 25 && s.altTop != null && s.altTop < ctx.VH
      : (s, ctx) => s.iaccTop != null && Math.abs(s.iaccTop - 62) <= 25 && s.altTop != null && s.altTop < ctx.VH,
    poseNote: cls === 'phone' ? 'photo-card bottom ~78px from top, capability rail entering at bottom (INDEX: 76.6px, --capalt-p 0.770)' : 'photo strip top ~62px below topbar, capability rail entering (INDEX: 59.3px, --capalt-p 0.612)',
  });

  // 07 — history, 3-stop viewport walk
  shots.push({
    file: '07-history-rest.png', section: '07', pose: 'rest — top (heading + timeline)',
    probe: 'section', probeArgs: '.mw-ten3', settleMs: 1000,
    walk: { strategy: 'sectionTarget', selector: '.mw-ten3', target: (m) => m.absTop },
    poseCondition: (s) => !s.missing && Math.abs(s.top) <= 16 && s.imgUnloaded === 0,
    poseNote: 'section heading at viewport top, in-frame images loaded',
  });
  shots.push({
    file: '07-history-rest-b.png', section: '07', pose: 'rest — middle',
    probe: 'section', probeArgs: '.mw-ten3', settleMs: 800,
    walk: { strategy: 'sectionTarget', selector: '.mw-ten3', target: (m) => m.absTop + histPlus },
    poseCondition: (s) => !s.missing && s.top <= -(histPlus - 170) && s.top >= -(histPlus + 170),
    poseNote: `stop 2, ~${histPlus}px below section top`,
  });
  shots.push({
    file: '07-history-rest-c.png', section: '07', pose: 'rest — end + handoff',
    probe: 'section', probeArgs: '.mw-ten3', settleMs: 800,
    walk: {
      strategy: 'sectionTarget', selector: '.mw-ten3',
      // Desktop: section bottom at ~600px (INDEX scrollY 9456). Coarse: >=800px deeper than stop-2, section bottom at ~25% of viewport so the careers handoff fills the lower frame (approved tabport retake rule).
      target: desktop
        ? (m) => m.absTop + m.height - 600
        : (m, ctx) => Math.max(m.absTop + histPlus + 800, m.absTop + m.height - ctx.VH * 0.25),
    },
    poseCondition: desktop
      ? (s) => !s.missing && s.bottom >= 400 && s.bottom <= 800
      : (s, ctx) => !s.missing && s.bottom >= ctx.VH * 0.05 && s.bottom <= ctx.VH * 0.6 && s.top <= -(histPlus + 800 - 200),
    poseNote: 'section end sliver at top with the careers handoff filling the lower frame',
  });

  // 08 — careers dive (pins on EVERY class; forward-only — auto-advance fights backward scrolls)
  shots.push({
    file: '08-careers-enter.png', section: '08', pose: 'pin engaged, pre-dive collage',
    probe: 'careers', settleMs: 450,
    walk: {
      strategy: 'converge', probe: 'careers', forwardOnly: true, maxSteps: 110, stepWait: 350,
      step: (s) => { if (s.missing) return 500; const d = s.absTop - s.scrollY; return d > 4 ? Math.min(450, d) : 0; },
      done: (s) => !s.missing && Math.abs(s.top) <= 8,
    },
    poseCondition: (s) => Math.abs(s.top) <= 10 && (s.introOut == null || s.introOut <= 0.3),
    poseNote: 'track top ~0 (pin just engaged), --intro-out still ~0',
  });
  shots.push({
    file: '08-careers-dive-mid.png', section: '08', pose: 'mid-dive (~50% of dive distance)',
    probe: 'careers', settleMs: 450,
    walk: {
      strategy: 'converge', probe: 'careers', forwardOnly: true, maxSteps: 110, stepWait: 350,
      step: (s, ctx) => { if (s.missing) return 500; const d = s.absTop + diveDist(ctx) * 0.5 - s.scrollY; return d > 4 ? Math.min(450, d) : 150; },
      done: (s, ctx) => !s.missing && careersP(s, ctx) >= 0.35 && careersP(s, ctx) <= 0.68 && (s.reveal == null || s.reveal < 0.6) && (s.zoom == null || s.zoom > 1.002),
    },
    poseCondition: desktop
      ? (s, ctx) => careersP(s, ctx) >= 0.3 && careersP(s, ctx) <= 0.7 && (s.introOut == null || s.introOut >= 0.9) && (s.reveal == null || s.reveal < 0.6)
      : (s, ctx) => careersP(s, ctx) >= 0.3 && careersP(s, ctx) <= 0.7 && (s.reveal == null || s.reveal < 0.6),
    poseNote: 'dive visibly in progress (~half runway), headline reveal not yet in, zoom still converging',
  });
  shots.push({
    file: '08-careers-settled.png', section: '08', pose: 'settled focal pose',
    probe: 'careers', settleMs: 550,
    walk: {
      strategy: 'converge', probe: 'careers', forwardOnly: true, maxSteps: 110, stepWait: 350,
      step: (s, ctx) => { if (s.missing) return 500; const d = s.absTop + diveDist(ctx) + freezeDist(ctx) * 0.5 - s.scrollY; return d > 4 ? Math.min(450, d) : 150; },
      done: (s, ctx) => !s.missing && s.reveal != null && s.reveal >= 0.95 && (s.zoom == null || s.zoom <= 1.02) && s.bottom >= ctx.VH * 0.8,
    },
    poseCondition: (s, ctx) => s.reveal != null && s.reveal >= 0.95 && (s.zoom == null || s.zoom <= 1.02) && s.bottom >= ctx.VH * 0.8,
    poseNote: '--reveal 1.0, --center-img-zoom landed at 1.0, stage still filling the frame',
  });

  // 09 — affiliates banner
  shots.push({
    file: '09-affiliates-rest.png', section: '09', pose: 'rest (band centered, logos loaded)',
    probe: 'section', probeArgs: '.mw-marquee', settleMs: 1000,
    walk: { strategy: 'band', selector: '.mw-marquee', minTop: 120 },
    poseCondition: (s, ctx) => !s.missing && s.top >= 100 && s.bottom <= ctx.VH + 4 && s.imgUnloaded === 0 && s.imgCount >= 8,
    poseNote: 'marquee band fully in frame, all logo images loaded',
  });

  // 10 — final CTA
  shots.push({
    file: '10-final-cta-rest.png', section: '10', pose: 'rest (headline through socials in frame)',
    probe: 'finalCta', settleMs: 900,
    walk: { strategy: 'finalCta', headlineTop: 100 },
    poseCondition: (s, ctx) => s.headTop != null && s.headTop >= 30 && s.headTop <= 260 && (s.socialsBottom == null || s.socialsBottom <= ctx.VH + 6),
    poseNote: 'headline ~100px from top, socials bottom inside the viewport',
  });

  return shots;
}

export const MANIFEST = Object.fromEntries(Object.keys(CLASSES).map((c) => [c, classShots(c)]));

export const EXPECTED_COUNTS = { 'desktop': 19, 'phone': 15, 'tablet-portrait': 15, 'tablet-landscape': 17 };
