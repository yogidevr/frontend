"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PermissionAction,
  canUsePermission,
  findModulePermissionByPath,
  getStoredUser,
} from "@/lib/permissions";

export type ModulePermissionFlags = {
  ready: boolean;
  baseCode?: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  can: (action: PermissionAction) => boolean;
};

export function useModulePermissions(baseCode?: string): ModulePermissionFlags {
  const pathname = usePathname();
  const detectedModule = useMemo(() => findModulePermissionByPath(pathname), [pathname]);
  const resolvedBaseCode = baseCode ?? detectedModule?.baseCode;
  const [ready, setReady] = useState(false);
  const [permissions, setPermissions] = useState({
    view: true,
    create: true,
    update: true,
    delete: true,
  });

  useEffect(() => {
    const user = getStoredUser();

    if (!resolvedBaseCode) {
      setPermissions({ view: true, create: true, update: true, delete: true });
      setReady(true);
      return;
    }

    setPermissions({
      view: canUsePermission(resolvedBaseCode, "view", user),
      create: canUsePermission(resolvedBaseCode, "create", user),
      update: canUsePermission(resolvedBaseCode, "update", user),
      delete: canUsePermission(resolvedBaseCode, "delete", user),
    });
    setReady(true);
  }, [resolvedBaseCode]);

  return {
    ready,
    baseCode: resolvedBaseCode,
    canView: permissions.view,
    canCreate: permissions.create,
    canUpdate: permissions.update,
    canDelete: permissions.delete,
    can: (action) => permissions[action],
  };
}
