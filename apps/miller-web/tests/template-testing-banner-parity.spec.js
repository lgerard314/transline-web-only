import { test, expect } from "@playwright/test";
import { shouldShowEmergencyBanner } from "../lib/nav.js";

test("sandbox service routes get the same emergency banner as the real service pages", () => {
  expect(shouldShowEmergencyBanner("/industrial-services/emergency-response")).toBe(true);
  expect(shouldShowEmergencyBanner("/industrial-services/customer-waste-collection")).toBe(true);
  expect(shouldShowEmergencyBanner("/template-testing/emergency-response")).toBe(true);
  expect(shouldShowEmergencyBanner("/template-testing/customer-waste-collection")).toBe(true);
  expect(shouldShowEmergencyBanner("/template-testing")).toBe(true);
});
