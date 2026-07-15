"use client";

import { createContext, useContext } from "react";
import type { PublicJobNavItem } from "@/lib/jobs/types";

const CareersJobsContext = createContext<PublicJobNavItem[]>([]);

export function CareersJobsProvider({
  jobs,
  children,
}: {
  jobs: PublicJobNavItem[];
  children: React.ReactNode;
}) {
  return (
    <CareersJobsContext.Provider value={jobs}>{children}</CareersJobsContext.Provider>
  );
}

export function useCareersNavJobs(): PublicJobNavItem[] {
  return useContext(CareersJobsContext);
}
