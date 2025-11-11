import { z } from "zod";

/**
 * Schema untuk CREATE (required semua field non-file).
 * Catatan:
 * - foto_lokasi divalidasi di route sebagai File (wajib pada create).
 * - users_eksternal_id, branch_id, status_ulok_eksternal, penanggungjawab, approved_at diabaikan.
 */
export const createUlokEksternalSchema = z.object({
  latitude: z
    .number({ error: "latitude harus number" })
    .refine((v) => Number.isFinite(v), "latitude harus number"),
  longitude: z
    .number({ error: "longitude harus number" })
    .refine((v) => Number.isFinite(v), "longitude harus number"),
  desa_kelurahan: z.string().min(1, "desa_kelurahan wajib diisi"),
  kecamatan: z.string().min(1, "kecamatan wajib diisi"),
  kabupaten: z.string().min(1, "kabupaten wajib diisi"),
  provinsi: z.string().min(1, "provinsi wajib diisi"),
  alamat: z.string().min(1, "alamat wajib diisi"),
  // Jika Anda punya enum bentuk_objek dari DB, bisa ganti z.string() menjadi z.enum([...])
  bentuk_objek: z.string().min(1, "bentuk_objek wajib diisi"),
  alas_hak: z.string().min(1, "alas_hak wajib diisi"),
  jumlah_lantai: z
    .number({ error: "jumlah_lantai harus integer" })
    .int("jumlah_lantai harus integer")
    .min(0, "jumlah_lantai minimal 0"),
  lebar_depan: z
    .number({ error: "lebar_depan harus number" })
    .positive("lebar_depan harus > 0"),
  panjang: z
    .number({ error: "panjang harus number" })
    .positive("panjang harus > 0"),
  luas: z.number({ error: "luas harus number" }).positive("luas harus > 0"),
  harga_sewa: z
    .number({ error: "harga_sewa harus number" })
    .min(0, "harga_sewa minimal 0"),
  nama_pemilik: z.string().min(1, "nama_pemilik wajib diisi"),
  kontak_pemilik: z.string().min(1, "kontak_pemilik wajib diisi"),
});

export type CreateUlokEksternalInput = z.infer<
  typeof createUlokEksternalSchema
>;

/**
 * Schema untuk UPDATE (semua optional).
 * - foto_lokasi (file) tetap ditangani di route jika ada penggantian.
 */
export const updateUlokEksternalSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  desa_kelurahan: z.string().min(1).optional(),
  kecamatan: z.string().min(1).optional(),
  kabupaten: z.string().min(1).optional(),
  provinsi: z.string().min(1).optional(),
  alamat: z.string().min(1).optional(),
  bentuk_objek: z.string().min(1).optional(),
  alas_hak: z.string().min(1).optional(),
  jumlah_lantai: z.number().int().min(0).optional(),
  lebar_depan: z.number().positive().optional(),
  panjang: z.number().positive().optional(),
  luas: z.number().positive().optional(),
  harga_sewa: z.number().min(0).optional(),
  nama_pemilik: z.string().min(1).optional(),
  kontak_pemilik: z.string().min(1).optional(),
});

export type UpdateUlokEksternalInput = z.infer<
  typeof updateUlokEksternalSchema
>;

/**
 * Helper untuk mengambil nilai number dari FormData.
 */
function pickNumber(fd: FormData, key: string): number | undefined {
  const raw = fd.get(key);
  if (raw == null || raw === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function pickInt(fd: FormData, key: string): number | undefined {
  const raw = fd.get(key);
  if (raw == null || raw === "") return undefined;
  const n = parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : undefined;
}

function pickString(fd: FormData, key: string): string | undefined {
  const raw = fd.get(key);
  if (raw == null) return undefined;
  const v = String(raw).trim();
  return v.length ? v : undefined;
}

/**
 * Parse + validate untuk CREATE dari FormData → object siap insert (tanpa foto_lokasi).
 * - Hanya field yang diizinkan yang diambil, field lain terabaikan.
 */
export function parseCreateUlokEksternalFromFormData(
  fd: FormData
): CreateUlokEksternalInput {
  const candidate = {
    latitude: pickNumber(fd, "latitude"),
    longitude: pickNumber(fd, "longitude"),
    desa_kelurahan: pickString(fd, "desa_kelurahan"),
    kecamatan: pickString(fd, "kecamatan"),
    kabupaten: pickString(fd, "kabupaten"),
    provinsi: pickString(fd, "provinsi"),
    alamat: pickString(fd, "alamat"),
    bentuk_objek: pickString(fd, "bentuk_objek"),
    alas_hak: pickString(fd, "alas_hak"),
    jumlah_lantai: pickInt(fd, "jumlah_lantai"),
    lebar_depan: pickNumber(fd, "lebar_depan"),
    panjang: pickNumber(fd, "panjang"),
    luas: pickNumber(fd, "luas"),
    harga_sewa: pickNumber(fd, "harga_sewa"),
    nama_pemilik: pickString(fd, "nama_pemilik"),
    kontak_pemilik: pickString(fd, "kontak_pemilik"),
  };

  const parsed = createUlokEksternalSchema.safeParse(candidate);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    throw new Error(msg);
  }
  return parsed.data;
}

/**
 * Parse + validate untuk UPDATE dari FormData → patch object siap update (tanpa foto_lokasi).
 * - Field optional; hanya yang ada di form yang akan dipakai.
 */
export function parseUpdateUlokEksternalFromFormData(
  fd: FormData
): UpdateUlokEksternalInput & { updated_at?: string } {
  const candidate = {
    latitude: pickNumber(fd, "latitude"),
    longitude: pickNumber(fd, "longitude"),
    desa_kelurahan: pickString(fd, "desa_kelurahan"),
    kecamatan: pickString(fd, "kecamatan"),
    kabupaten: pickString(fd, "kabupaten"),
    provinsi: pickString(fd, "provinsi"),
    alamat: pickString(fd, "alamat"),
    bentuk_objek: pickString(fd, "bentuk_objek"),
    alas_hak: pickString(fd, "alas_hak"),
    jumlah_lantai: pickInt(fd, "jumlah_lantai"),
    lebar_depan: pickNumber(fd, "lebar_depan"),
    panjang: pickNumber(fd, "panjang"),
    luas: pickNumber(fd, "luas"),
    harga_sewa: pickNumber(fd, "harga_sewa"),
    nama_pemilik: pickString(fd, "nama_pemilik"),
    kontak_pemilik: pickString(fd, "kontak_pemilik"),
  };

  // buang key undefined agar tidak meng-overwrite dengan null/undefined
  const compact: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(candidate)) {
    if (v !== undefined) compact[k] = v;
  }

  const parsed = updateUlokEksternalSchema.safeParse(compact);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join("; ");
    throw new Error(msg);
  }

  return parsed.data;
}

/**
 * Validasi file untuk foto_lokasi pada CREATE/PATCH.
 */
export function requireFotoFile(fd: FormData): File {
  const f =
    (fd.get("foto_lokasi") as File | null) || (fd.get("file") as File | null);
  if (!f) throw new Error("File foto_lokasi wajib diunggah");
  return f;
}
