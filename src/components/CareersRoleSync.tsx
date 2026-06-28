"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isRole, type Role } from "@/types/role";

type CareersRoleSyncProps = {
  onRoleFromUrl: (role: Role) => void;
};

/** Syncs `?role=` deep link to hub tab state without blocking page mount. */
export function CareersRoleSync({ onRoleFromUrl }: CareersRoleSyncProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (isRole(roleParam)) {
      onRoleFromUrl(roleParam);
    }
  }, [searchParams, onRoleFromUrl]);

  return null;
}
