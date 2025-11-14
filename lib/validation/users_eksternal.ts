import { z } from "zod";

export const upsertUsersEksternalSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  no_telp: z.string().min(1, "No. Telepon wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
});

export type UpsertUsersEksternalInput = z.infer<
  typeof upsertUsersEksternalSchema
>;
