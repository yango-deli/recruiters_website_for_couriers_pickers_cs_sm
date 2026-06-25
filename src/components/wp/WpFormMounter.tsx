"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LeadForm } from "@/components/forms/LeadForm";
import type { Role } from "@/types/role";

type FormTarget = {
  key: string;
  element: HTMLElement;
  role: Role;
};

type WpFormMounterProps = {
  role?: Role;
};

function isMountVisible(element: HTMLElement): boolean {
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility({
      checkOpacity: true,
      checkVisibilityCSS: true,
    });
  }
  return element.offsetParent !== null;
}

function collectFormTargets(role?: Role): FormTarget[] {
  const mounts = document.querySelectorAll<HTMLElement>(".wp-lead-form-mount");
  const next: FormTarget[] = [];

  mounts.forEach((element, index) => {
    if (!isMountVisible(element)) return;

    const mountRole = (element.dataset.role as Role | undefined) ?? role;
    if (!mountRole) return;
    next.push({
      key: element.id || `wp-form-${index}`,
      element,
      role: mountRole,
    });
  });

  return next;
}

/** Portals LeadForm into visible `.wp-lead-form-mount` placeholders from server HTML. */
export function WpFormMounter({ role }: WpFormMounterProps) {
  const [targets, setTargets] = useState<FormTarget[]>([]);

  useEffect(() => {
    function refreshTargets() {
      setTargets(collectFormTargets(role));
    }

    refreshTargets();
    const raf = window.requestAnimationFrame(refreshTargets);
    const timers = [0, 50, 150, 400].map((ms) =>
      window.setTimeout(refreshTargets, ms)
    );

    const root = document.querySelector(".wp-page-shell") ?? document.body;

    const mutationObserver = new MutationObserver(() => {
      refreshTargets();
    });

    mutationObserver.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden", "data-tab-index"],
    });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            refreshTargets();
          })
        : null;

    if (resizeObserver) {
      document.querySelectorAll<HTMLElement>(".wp-lead-form-mount").forEach((el) => {
        resizeObserver.observe(el);
      });
      document.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach((el) => {
        resizeObserver.observe(el);
      });
    }

    window.addEventListener("resize", refreshTargets);
    window.addEventListener("load", refreshTargets);

    return () => {
      window.cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", refreshTargets);
      window.removeEventListener("load", refreshTargets);
    };
  }, [role]);

  return (
    <>
      {targets.map(({ key, element, role: mountRole }) =>
        createPortal(
          <div className="wp-lead-form">
            <LeadForm role={mountRole} embedded />
          </div>,
          element,
          key
        )
      )}
    </>
  );
}
