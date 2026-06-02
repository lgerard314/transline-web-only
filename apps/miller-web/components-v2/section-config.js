// components-v2/section-config.js
// Turns a section `config` object into the extra DOM props a section root needs.
// Emits attributes/inline-style ONLY for non-default values, so default config
// leaves the DOM byte-identical.
// NOTE: `data-layout` is NOT emitted here — the section root does not consume it.
// Layout reversal is driven by `data-layout={config.layout}` placed directly on
// each reversible inner grid container (the element the CSS targets).
export function sectionProps(config = {}) {
  const props = {};
  if (config.scheme) props["data-scheme"] = config.scheme;
  if (config.tokens && Object.keys(config.tokens).length) props.style = { ...config.tokens };
  return props;
}
