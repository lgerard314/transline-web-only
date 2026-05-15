// ESLint flat config. Hoisted to repo root so a single `npm run lint`
// covers every app in the workspace. Next.js 16 removed the `next lint`
// subcommand; we call ESLint 9 directly with `eslint-config-next`'s
// flat-config export.
import next from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "**/.next/**", "**/node_modules/**", "**/out/**", "**/dist/**"] },
  ...next,
];

export default config;
