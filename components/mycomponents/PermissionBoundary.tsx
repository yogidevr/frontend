"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  buildPermissionCode,
  canUsePermission,
  findModulePermissionByPath,
  getStoredUser,
  hasStoredPermission,
} from "@/lib/permissions";

export default function PermissionBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const modulePermission = useMemo(() => findModulePermissionByPath(pathname), [pathname]);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const user = getStoredUser();

    if (!modulePermission) {
      setAllowed(true);
      setReady(true);
      return;
    }

    setAllowed(hasStoredPermission(buildPermissionCode(modulePermission.baseCode, "view"), user));
    setReady(true);
  }, [modulePermission]);

  useEffect(() => {
    if (!modulePermission) return;

    const user = getStoredUser();
    const actionAccess = {
      create: canUsePermission(modulePermission.baseCode, "create", user),
      update: canUsePermission(modulePermission.baseCode, "update", user),
      delete: canUsePermission(modulePermission.baseCode, "delete", user),
    };

    const normalizeText = (element: Element) =>
      String(element.textContent ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const isCreateControl = (button: HTMLButtonElement) => {
      const text = normalizeText(button);
      return text === "tambah" || text.startsWith("+ tambah") || text.startsWith("tambah ");
    };

    const isUpdateControl = (button: HTMLButtonElement) => {
      const text = normalizeText(button);
      return text === "edit" || Boolean(button.querySelector("svg.lucide-pencil"));
    };

    const isDeleteControl = (button: HTMLButtonElement) => {
      const text = normalizeText(button);
      return text === "hapus" || Boolean(button.querySelector("svg.lucide-trash-2"));
    };

    const hideButton = (button: HTMLButtonElement) => {
      if (!button.dataset.permissionOriginalDisplay) {
        button.dataset.permissionOriginalDisplay = button.style.display || "__empty__";
      }
      button.style.display = "none";
      button.setAttribute("data-permission-hidden", "true");
    };

    const restoreButton = (button: HTMLButtonElement) => {
      if (button.getAttribute("data-permission-hidden") !== "true") return;
      const originalDisplay = button.dataset.permissionOriginalDisplay;
      button.style.display = originalDisplay && originalDisplay !== "__empty__" ? originalDisplay : "";
      button.removeAttribute("data-permission-hidden");
      delete button.dataset.permissionOriginalDisplay;
    };

    const applyActionVisibility = () => {
      const root = document.querySelector("main") ?? document.body;
      root.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        const shouldHide =
          (!actionAccess.create && isCreateControl(button)) ||
          (!actionAccess.update && isUpdateControl(button)) ||
          (!actionAccess.delete && isDeleteControl(button));

        if (shouldHide) {
          hideButton(button);
        } else {
          restoreButton(button);
        }
      });
    };

    applyActionVisibility();

    const observer = new MutationObserver(applyActionVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document
        .querySelectorAll<HTMLButtonElement>('button[data-permission-hidden="true"]')
        .forEach(restoreButton);
    };
  }, [modulePermission, pathname]);

  if (!ready) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-gray-600">Memeriksa akses...</p>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 shadow">
        <h2 className="text-2xl font-bold">Akses ditolak</h2>
        <p className="mt-2">
          Akun ini belum memiliki permission untuk melihat halaman{" "}
          <span className="font-semibold">{modulePermission?.label ?? "ini"}</span>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
