/* CRUD: List + Create ulok_eksternal (with Zod validation) */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  parseCreateUlokEksternalFromFormData,
  requireFotoFile,
} from "@/lib/validation/ulok_eksternal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper: dapatkan user eksternal dari session Supabase
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

// Helper: normalisasi nama file
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

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentExternalUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = await createClient();

    const { searchParams } = new URL(req.url);
    const limit = Math.max(
      0,
      Math.min(100, Number(searchParams.get("limit") ?? 20))
    );
    const offset = Math.max(0, Number(searchParams.get("offset") ?? 0));

    const { data, count, error } = await supabase
      .from("ulok_eksternal")
      .select("*", { count: "exact" })
      .eq("users_eksternal_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, count, limit, offset });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: (e instanceof Error ? e.message : "Unknown error") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Gunakan multipart/form-data" },
        { status: 415 }
      );
    }

    const user = await getCurrentExternalUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = await createClient();
    const form = await req.formData();

    // Validate body fields via Zod
    const body = parseCreateUlokEksternalFromFormData(form);

    // Validate + ambil file
    const incomingFile = requireFotoFile(form);

    // Force generate UUID untuk dipakai di path storage dan insert id explicit
    const id = crypto.randomUUID();

    const ts = Date.now();
    const originalName = incomingFile.name || "file";
    const fileName = `${ts}_${safeFileName(originalName)}`;
    const objectPath = `${id}/ulok_eksternal/${fileName}`; // format path

    // Upload ke bucket
    const { error: upErr } = await supabase.storage
      .from("file_storage_eksternal")
      .upload(objectPath, incomingFile, {
        contentType: incomingFile.type || "application/octet-stream",
        upsert: false,
      });

    if (upErr) {
      return NextResponse.json(
        { error: `Gagal upload file: ${upErr.message}` },
        { status: 400 }
      );
    }

    // Build row yang aman: backend isi users_eksternal_id, abaikan field terlarang
    const insertRow = {
      id,
      users_eksternal_id: user.id,
      ...body,
      foto_lokasi: objectPath,
    };

    const { data, error } = await supabase
      .from("ulok_eksternal")
      .insert(insertRow)
      .select("*")
      .single();

    if (error) {
      // rollback file jika insert gagal
      await supabase.storage
        .from("file_storage_eksternal")
        .remove([objectPath])
        .catch(() => {});
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
