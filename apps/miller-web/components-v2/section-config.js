// components-v2/section-config.js
// Turns a section `config` object into the extra DOM props a section root needs.
// Emits attributes/inline-style ONLY for non-default values, so default config
// leaves the DOM byte-identical.
export function sectionProps(config = {}) {
  const props = {};
  if (config.scheme) props["data-scheme"] = config.scheme;
  if (config.layout) props["data-layout"] = config.layout;
  if (config.tokens && Object.keys(config.tokens).length) props.style = { ...config.tokens };
  return props;
}
