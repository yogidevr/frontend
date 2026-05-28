export type StoredPermission = {
  id?: number;
  code?: string;
};

export type StoredUser = {
  id?: number;
  nama?: string;
  email?: string;
  role?: string;
  permissions?: StoredPermission[];
};

export type PermissionAction = "view" | "create" | "update" | "delete";

export type ModulePermission = {
  label: string;
  baseCode: string;
  paths: string[];
  actions?: PermissionAction[];
};

export const MODULE_PERMISSIONS: ModulePermission[] = [
  { label: "Dashboard", baseCode: "dashboard", paths: ["/admin"], actions: ["view"] },
  { label: "Wilayah & Lokasi", baseCode: "master.wilayah", paths: ["/admin/master/wilayah"] },
  { label: "Supplier", baseCode: "master.supplier", paths: ["/admin/master/supplier"] },
  { label: "Mitra", baseCode: "master.mitra", paths: ["/admin/master/mitra"] },
  { label: "SPPG", baseCode: "master.sppg", paths: ["/admin/master/sppg"] },
  { label: "Produk & Barang", baseCode: "master.produk", paths: ["/admin/master/produk"] },
  { label: "Gudang", baseCode: "master.gudang", paths: ["/admin/master/gudang"] },
  { label: "Armada", baseCode: "master.armada", paths: ["/admin/master/armada"] },
  { label: "Karyawan", baseCode: "master.karyawan", paths: ["/admin/master/karyawan"] },
  { label: "Bank & Rekening", baseCode: "master.bank_rekening", paths: ["/admin/master/bank"] },
  { label: "Perusahaan", baseCode: "master.perusahaan", paths: ["/admin/master/perusahaan"] },
  { label: "Kategori & Satuan", baseCode: "master.kategori", paths: ["/admin/master/kategori"] },
  { label: "Role", baseCode: "master.role", paths: ["/admin/master/role"] },
  { label: "Inbound", baseCode: "warehouse.inbound", paths: ["/admin/warehouse/inbound"] },
  { label: "Cek Stok (Kering)", baseCode: "warehouse.stok_kering", paths: ["/admin/warehouse/stokKering"] },
  { label: "Cek Stok (Basah)", baseCode: "warehouse.stok_basah", paths: ["/admin/warehouse/stokBasah"] },
  { label: "Retur/Rusak", baseCode: "warehouse.retur", paths: ["/admin/warehouse/retur"] },
  {
    label: "List Order & Penawaran",
    baseCode: "pembelian.order_penawaran",
    paths: ["/admin/transaksiPembelian/listorderpenawaran"],
  },
  {
    label: "Daftar Pembelanjaan",
    baseCode: "pembelian.daftar_pembelanjaan",
    paths: ["/admin/transaksiPembelian/daftarpembelanjaan"],
  },
  {
    label: "Daftar Pembelanjaan Supplier",
    baseCode: "pembelian.daftar_pembelanjaan_supplier",
    paths: ["/admin/transaksiPembelian/daftarpembelanjaansupplier"],
    actions: ["view"],
  },
  { label: "Penjualan", baseCode: "penjualan.penjualan", paths: ["/admin/transaksi-penjualan/penjualan"] },
  { label: "Surat Jalan", baseCode: "penjualan.surat_jalan", paths: ["/admin/transaksi-penjualan/surat-jalan"] },
  { label: "Tanda Terima", baseCode: "penjualan.tanda_terima", paths: ["/admin/transaksi-penjualan/tanda-terima"] },
  {
    label: "Invoice Penjualan",
    baseCode: "penjualan.invoice_penjualan",
    paths: ["/admin/transaksi-penjualan/invoice-penjualan"],
  },
  { label: "Pemasukan", baseCode: "keuangan.pemasukan", paths: ["/admin/keuangan/pemasukan"] },
  { label: "Pengeluaran", baseCode: "keuangan.pengeluaran", paths: ["/admin/keuangan/pengeluaran"] },
  {
    label: "Laporan Stok Barang",
    baseCode: "laporan.stok_barang",
    paths: ["/admin/laporan/laporan-stok-barang"],
    actions: ["view"],
  },
  {
    label: "Laba Rugi Transaksional",
    baseCode: "laporan.laba_rugi",
    paths: ["/admin/laporan/laporan-laba-rugi"],
    actions: ["view"],
  },
  {
    label: "Penjualan per SPPG",
    baseCode: "laporan.penjualan_sppg",
    paths: ["/admin/laporan/laporan-penjualan"],
    actions: ["view"],
  },
  { label: "Manajemen Pengguna", baseCode: "users", paths: ["/admin/settings"] },
];

export const isSuperAdminRole = (role?: string): boolean =>
  String(role ?? "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "") === "superadmin";

export const getStoredUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("user");
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredUser;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const getStoredPermissionCodes = (user = getStoredUser()): Set<string> =>
  new Set(
    (user?.permissions ?? [])
      .map((permission) => String(permission?.code ?? "").trim())
      .filter(Boolean)
  );

export const hasStoredPermission = (code: string, user = getStoredUser()): boolean => {
  if (isSuperAdminRole(user?.role)) return true;
  return getStoredPermissionCodes(user).has(code);
};

export const buildPermissionCode = (baseCode: string, action: PermissionAction): string =>
  `${baseCode}.${action}`;

export const canUsePermission = (
  baseCode: string,
  action: PermissionAction,
  user = getStoredUser()
): boolean => hasStoredPermission(buildPermissionCode(baseCode, action), user);

export const findModulePermissionByPath = (pathname: string): ModulePermission | null => {
  const normalizedPath = pathname.split("?")[0].replace(/\/+$/, "") || "/admin";

  return (
    MODULE_PERMISSIONS
      .filter((modulePermission) =>
        modulePermission.paths.some((path) => {
          const normalizedModulePath = path.replace(/\/+$/, "") || "/admin";
          return (
            normalizedPath === normalizedModulePath ||
            normalizedPath.startsWith(`${normalizedModulePath}/`)
          );
        })
      )
      .sort((a, b) => Math.max(...b.paths.map((path) => path.length)) - Math.max(...a.paths.map((path) => path.length)))[0] ??
    null
  );
};
