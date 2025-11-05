// middleware.ts

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const mainAppRoutes = ["/dashboard", "/input", "/status"];
const completeProfileRoute = "/auth/complete-profile";
const loginRoute = "/auth/login";

// DAFTAR PUTIH: Rute-rute ini tidak akan memicu middleware sama sekali.
// Kita tidak perlu mengecek sesi untuk halaman-halaman ini.
const publicRoutes = [
  "/auth/sign-up",
  "/auth/sign-up-success", // <-- PENTING: Mencegah query param hilang
  "/auth/callback", // <-- PENTING: Untuk verifikasi email
  "/auth/forgot-password",
  "/auth/update-password",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 🔹 Cek DAFTAR PUTIH terlebih dahulu
  // Jika rute saat ini ada di daftar, langsung lanjutkan tanpa memproses.
  if (publicRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // --- Mulai Logika Middleware yang Ada ---

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 'pathname' sudah didefinisikan di atas
  const isMainAppRoute = mainAppRoutes.some((r) => pathname.startsWith(r));
  const isProfileRoute = pathname.startsWith(completeProfileRoute);
  const isLoginRoute = pathname.startsWith(loginRoute);

  // 🔹 Jika belum login → arahkan ke login
  if (!session) {
    if (isMainAppRoute || isProfileRoute) {
      return NextResponse.redirect(new URL(loginRoute, request.url));
    }
    return response;
  }

  const userId = session.user.id;

  // 🔹 Ambil data profil user
  const { data: profile } = await supabase
    .from("users_eksternal")
    .select("nama, no_telp, alamat")
    .eq("id", userId)
    .maybeSingle();

  const isProfileComplete = Boolean(
    profile?.nama && profile?.no_telp && profile?.alamat
  );

  // 🔹 Jika user belum isi profil dan buka dashboard → redirect ke complete profile
  if (!isProfileComplete && isMainAppRoute) {
    return NextResponse.redirect(new URL(completeProfileRoute, request.url));
  }

  // 🔹 Jika user sudah isi profil tapi buka /auth/login atau /auth/complete-profile → redirect ke dashboard
  if (isProfileComplete && (isProfileRoute || isLoginRoute)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Tetap sama, karena logika di atas sudah menangani pengecualian
    "/((?!_next/static|_next/image|favicon.ico|auth/error).*)",
  ],
};