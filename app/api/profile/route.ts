import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertUsersEksternalSchema } from "@/lib/validation/users_eksternal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Ambil profil pengguna eksternal saat ini
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: row, error } = await supabase
      .from("users_eksternal")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Prefill nama dari DB atau fallback ke metadata auth
    const fallbackNama =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      "";

    return NextResponse.json({
      email: user.email ?? "",
      nama: row?.nama ?? fallbackNama,
      no_telp: row?.no_telp ?? "",
      alamat: row?.alamat ?? "",
    });
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Unknown error";
    return NextResponse.json(
      { error: errorMessage ?? "Unknown error" },
      { status: 500 }
    );
  }
}

// POST: Upsert profil pengguna eksternal
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Body harus JSON" }, { status: 400 });
    }

    const parsed = upsertUsersEksternalSchema.safeParse(json);
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((e) => {
          const path = e.path
            .filter((p) => typeof p === "string" || typeof p === "number")
            .join(".");
          return `${path}: ${e.message}`;
        })
        .join("; ");
      return NextResponse.json({ error: msg }, { status: 422 });
    }

    const { nama, no_telp, alamat } = parsed.data;

    const { error } = await supabase.from("users_eksternal").upsert({
      id: user.id,
      nama: nama.trim(),
      email: (user.email ?? "").trim(), // email diambil dari auth, bukan dari client
      no_telp: no_telp.trim(),
      alamat: alamat.trim(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Unknown error";
    return NextResponse.json(
      { error: errorMessage ?? "Unknown error" },
      { status: 500 }
    );
  }
}
