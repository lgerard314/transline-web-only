"use client";

import { SectorStatCycle } from "@/app/(home)/sections/sector-stat-cycle";

// Cycles why-Miller highlights in the remediation intro (reuses the home stat UI).
export function WhyChooseStatCycle({ stats, interval = 5000 }) {
  return <SectorStatCycle stats={stats} interval={interval} />;
}
