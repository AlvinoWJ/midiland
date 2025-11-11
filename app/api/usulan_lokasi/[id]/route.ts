/* eslint-disable @typescript-eslint/no-explicit-any */
/* CRUD: Read detail, Update, Delete ulok_eksternal (with Zod validation) */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseUpdateUlokEksternalFromFormData } from "@/lib/validation/ulok_eksternal";
import type { SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getCurrentExternalUser() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id;
  if (!uid) return null;

  const { data: user, error } = await supabase
    .from("users_eksternal")
    .select("id")
    .eq("id", uid)
    .maybeSingle();

  if (error || !user) return null;
  return user;
}

function safeFileName(name: string) {
  const parts = name.split(".");
  const ext = parts.length > 1 ? "." + parts.pop() : "";
  const base = parts.join(".");
  const normalized = base
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
  return (normalized || "file") + ext.toLowerCase();
}


async function ensureOwnedRow(supabase: SupabaseClient, id: string, userId: string) {
  const { data, error } = await supabase
    .from("ulok_eksternal")
    .select("*")
    .eq("id", id)
    .eq("users_eksternal_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return data as any;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentExternalUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const row = await ensureOwnedRow(supabase, params.id, user.id);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: row });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Gunakan multipart/form-data" },
        { status: 415 }
      );
    }

    const user = await getCurrentExternalUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const existing = await ensureOwnedRow(supabase, params.id, user.id);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const form = await req.formData();

    // Validasi patch body (tanpa file)
    const patch = parseUpdateUlokEksternalFromFormData(form) as Record<
      string,
      unknown
    >;

    // Cek apakah ada file baru
    const newFile =
      (form.get("foto_lokasi") as File | null) ||
      (form.get("file") as File | null);

    let newPath: string | undefined;

    if (newFile) {
      const ts = Date.now();
      const fileName = `${ts}_${safeFileName(newFile.name || "file")}`;
      const objectPath = `${params.id}/ulok_eksternal/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from("file_storage_eksternal")
        .upload(objectPath, newFile, {
          contentType: newFile.type || "application/octet-stream",
          upsert: false,
        });

      if (upErr) {
        return NextResponse.json(
          { error: `Gagal upload file: ${upErr.message}` },
          { status: 400 }
        );
      }
      newPath = objectPath;
      patch.foto_lokasi = newPath;
    }

    patch.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("ulok_eksternal")
      .update(patch)
      .eq("id", params.id)
      .eq("users_eksternal_id", user.id)
      .select("*")
      .single();

    if (error) {
      if (newPath) {
        await supabase.storage
          .from("file_storage_eksternal")
          .remove([newPath])
          .catch(() => {});
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Hapus file lama bila upload baru sukses
    if (newPath && existing?.foto_lokasi && existing.foto_lokasi !== newPath) {
      await supabase.storage
        .from("file_storage_eksternal")
        .remove([existing.foto_lokasi])
        .catch(() => {});
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentExternalUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const existing = await ensureOwnedRow(supabase, params.id, user.id);
    if (!existing)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { error } = await supabase
      .from("ulok_eksternal")
      .delete()
      .eq("id", params.id)
      .eq("users_eksternal_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Bersihkan folder storage id/ulok_eksternal (best-effort)
    try {
      const prefix = `${params.id}/ulok_eksternal`;
      const { data: files, error: listErr } = await supabase.storage
        .from("file_storage_eksternal")
        .list(prefix, { limit: 1000 });

      if (!listErr && files && files.length > 0) {
        const paths = files.map((f: any) => `${prefix}/${f.name}`);
        await supabase.storage.from("file_storage_eksternal").remove(paths);
      }
    } catch {
      // abaikan error pembersihan storage
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
