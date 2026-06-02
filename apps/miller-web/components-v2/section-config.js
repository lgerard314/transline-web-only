// components-v2/section-config.js
// Turns a section `config` object into the extra DOM props a section root needs.
// Emits attributes/inline-style ONLY for non-default values, so default config
// leaves the DOM byte-identical.
// NOTE: `data-layout` is NOT emitted here — the section root does not consume it.
// Layout reversal is handled per-template, by whatever mechanism its source uses:
// home templates (e.g. MediaSplit01) set `data-layout` on their own inner grid;
// service templates reproduce the source's literal modifier class (e.g.
// `mw-svc-cta__grid--reverse`). Only `scheme` and `tokens` flow through here.
export function sectionProps(config = {}) {
  const props = {};
  if (config.scheme) props["data-scheme"] = config.scheme;
  if (config.tokens && Object.keys(config.tokens).length) props.style = { ...config.tokens };
  return props;
}
