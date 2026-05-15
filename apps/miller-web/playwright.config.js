// Playwright config for the Miller smoke suite. Targets Chromium only
// (Phase 1 scope) against the long-running team-lead dev server on
// port 3001; override `BASE_URL` env var if you boot your own dev
// server elsewhere.
//
// Reporter is just "list" so test output stays terse in CI logs.
import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "off",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
