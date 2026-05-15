// ESLint flat config. Next.js 16 removed the `next lint` subcommand; we
// call ESLint 9 directly with `eslint-config-next`'s flat-config export.
import next from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "node_modules/**", "out/**"] },
  ...next,
];

export default config;
