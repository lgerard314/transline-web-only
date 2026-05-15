// ESLint flat config. Hoisted to repo root so a single `npm run lint`
// covers every app in the workspace. Next.js 16 removed the `next lint`
// subcommand; we call ESLint 9 directly with `eslint-config-next`'s
// flat-config export.
import next from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "**/.next/**", "**/node_modules/**", "**/out/**", "**/dist/**"] },
  ...next,
  {
    // Project-wide custom rules.
    //
    // `no-restricted-syntax`: forbid `href="#"` (and `href={"#"}`) on any
    // JSX node. Sentinel links are an a11y bug (cert/licence links must
    // resolve) and the rule is the build-time guard for the certs +
    // licences inventory (design spec §6, §5.2). Phase 05 will add a
    // stricter CI grep that walks `lib/certs.js` + `lib/licences.js` for
    // `href: "#"`.
    files: ["apps/**/*.{js,jsx,mjs}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXAttribute[name.name='href'][value.value='#']",
          message:
            "href=\"#\" is a sentinel link. Provide a real URL or use a <button> for interactive controls.",
        },
        {
          selector: "JSXAttribute[name.name='href'] > Literal[value='#']",
          message:
            "href=\"#\" is a sentinel link. Provide a real URL or use a <button> for interactive controls.",
        },
      ],
    },
  },
];

export default config;
