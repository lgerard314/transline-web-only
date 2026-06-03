"use client";
// Interactive component gallery. One client shell drives every sub-page (selected
// by the serializable `active` key — render thunks can't cross the server/client
// boundary, so the shell imports all registries itself).
//
// Two entry kinds:
//  • Section entries (06_sections) — { Component, content, config } rendered in a
//    bare full-width `.tg-stage` (each section owns its `mw-inner` width).
//  • Item entries (01–05 ladder) — a `render(config, surface)` thunk shown inside
//    a contained `.tg-canvas` swatch (light/dark), since atoms aren't full-bleed.
// Every entry: a control bar with the name (path on hover, click to copy) and any
// config toggles.

import { useMemo, useState } from "react";
import { GALLERY } from "./registry";
import { MARKS } from "./registry-marks";
import { BUTTONS } from "./registry-buttons";
import { CARDS } from "./registry-cards";
import { BLOCKS } from "./registry-blocks";
import { WIDGETS } from "./registry-widgets";

export const NAV = [
  { key: "sections", label: "Sections", href: "/template-gallery" },
  { key: "marks", label: "Marks", href: "/template-gallery/marks" },
  { key: "buttons", label: "Buttons", href: "/template-gallery/buttons" },
  { key: "cards", label: "Cards", href: "/template-gallery/cards" },
  { key: "blocks", label: "Blocks", href: "/template-gallery/blocks" },
  { key: "widgets", label: "Widgets", href: "/template-gallery/widgets" },
];

const PAGES = {
  sections: { title: "Section templates", layer: "06_sections", lead: "Full-width page sections, rendered at true site width — each keeps its own internal width. Toggle a section's configuration with the controls above it.", entries: GALLERY },
  marks: { title: "Marks", layer: "01_marks", lead: "The smallest typographic atoms — eyebrows, stop-period stamps, the action arrow, and inline text helpers. Most only make sense inside heading-size text or a sentence, so they're shown in context.", entries: MARKS },
  buttons: { title: "Buttons", layer: "02_buttons", lead: "Call-to-action primitives. The solid CTA works on any surface; the ghost phone CTA is built for dark masthead surfaces.", entries: BUTTONS },
  cards: { title: "Cards", layer: "03_cards", lead: "Card primitives composed into the grids and rails. Feature/industry cards are grid cells, so each is shown in a representative fixed-size container.", entries: CARDS },
  blocks: { title: "Blocks", layer: "04_blocks", lead: "Mid-level molecules — stat figures, capability and milestone list items, section heads, and the mission prose block.", entries: BLOCKS },
  widgets: { title: "Widgets", layer: "05_widgets", lead: "Interactive client widgets — cycling text/stats, swap galleries, the vertical timeline, and the logo marquee. Several auto-animate or respond to hover/focus.", entries: WIDGETS },
};

function slugify(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Merge defaultConfig + the selected option of every control group.
function buildConfig(entry, selection) {
  let config = { ...(entry.defaultConfig || {}) };
  (entry.controls || []).forEach((ctrl, ci) => {
    const opt = ctrl.options[selection[ci] ?? 0];
    if (opt) config = { ...config, ...opt.value };
  });
  return config;
}

function OptionGroup({ ctrl, value, onChange }) {
  return (
    <div className="tg-ctrl">
      <span className="tg-ctrl__label">{ctrl.label}</span>
      <div className="tg-ctrl__opts" role="group" aria-label={ctrl.label}>
        {ctrl.options.map((opt, oi) => {
          const active = value === oi;
          return (
            <button
              type="button"
              key={opt.label}
              className={`tg-opt${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => onChange(oi)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Entry({ entry }) {
  const controls = entry.controls || [];
  const [selection, setSelection] = useState(() => controls.map(() => 0));
  const config = useMemo(() => buildConfig(entry, selection), [entry, selection]);

  const canvas = entry.canvas; // present only for item entries
  const both = canvas?.surface === "both";
  const [surf, setSurf] = useState(() => (canvas?.surface === "dark" ? "dark" : "light"));

  const id = slugify(entry.name);

  let node;
  if (entry.render) {
    node = entry.render(config, surf);
  } else {
    const content = typeof entry.content === "function" ? entry.content(config) : entry.content;
    const Component = entry.Component;
    node = <Component content={content} config={config} />;
  }

  const setOpt = (ci) => (oi) =>
    setSelection((s) => {
      const next = [...s];
      next[ci] = oi;
      return next;
    });

  const surfaceCtrl = { label: "Surface", options: [{ label: "Light" }, { label: "Dark" }] };

  return (
    <section className="tg-entry" id={id} aria-label={entry.name}>
      <div className="tg-entry__bar">
        <div className="tg-entry__meta">
          <span className="tg-entry__group">{entry.group}</span>
          <button
            type="button"
            className="tg-entry__name"
            title={entry.path}
            onClick={() => navigator.clipboard?.writeText(entry.path)}
          >
            {entry.name}
            <span className="tg-entry__path">{entry.path}</span>
          </button>
        </div>

        {(controls.length > 0 || both) && (
          <div className="tg-entry__controls">
            {controls.map((ctrl, ci) => (
              <OptionGroup key={ctrl.key} ctrl={ctrl} value={selection[ci] ?? 0} onChange={setOpt(ci)} />
            ))}
            {both && (
              <OptionGroup
                ctrl={surfaceCtrl}
                value={surf === "dark" ? 1 : 0}
                onChange={(oi) => setSurf(oi === 1 ? "dark" : "light")}
              />
            )}
          </div>
        )}
      </div>

      {canvas ? (
        <div className="tg-canvas" data-surface={surf}>
          <div className="tg-canvas__inner">{node}</div>
          {canvas.note && <p className="tg-canvas__note">{canvas.note}</p>}
        </div>
      ) : (
        <div className="tg-stage">{node}</div>
      )}
    </section>
  );
}

export function Gallery({ active = "sections" }) {
  const page = PAGES[active] || PAGES.sections;
  const entries = page.entries;
  const groups = useMemo(() => {
    const seen = [];
    for (const e of entries) if (!seen.includes(e.group)) seen.push(e.group);
    return seen;
  }, [entries]);

  return (
    <div className="tg-page">
      <nav className="tg-nav" aria-label="Gallery sections">
        {NAV.map((n) => (
          <a key={n.key} href={n.href} className={`tg-nav__link${n.key === active ? " is-active" : ""}`} aria-current={n.key === active ? "page" : undefined}>
            {n.label}
          </a>
        ))}
      </nav>

      <header className="tg-top">
        <p className="tg-top__eyebrow">Internal · not indexed · {page.layer}</p>
        <h1 className="tg-top__title">{page.title}</h1>
        <p className="tg-top__lead">{page.lead}</p>
        <nav className="tg-toc" aria-label="Components">
          {groups.map((g) => {
            const items = entries.filter((e) => e.group === g);
            if (!items.length) return null;
            return (
              <div className="tg-toc__group" key={g}>
                <span className="tg-toc__heading">{g}</span>
                <ul className="tg-toc__list">
                  {items.map((e) => (
                    <li key={e.name}>
                      <a href={`#${slugify(e.name)}`}>{e.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
      </header>

      <div className="tg-entries">
        {entries.map((entry) => (
          <Entry key={entry.name} entry={entry} />
        ))}
      </div>
    </div>
  );
}
