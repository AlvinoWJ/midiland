import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const mainAppRoutes = ["/dashboard", "/input", "/status"];
const completeProfileRoute = "/auth/complete-profile";
const loginRoute = "/auth/login";

export async function middleware(request: NextRequest) {
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

  const pathname = request.nextUrl.pathname;
  const isMainAppRoute = mainAppRoutes.some((r) => pathname.startsWith(r));
  const isProfileRoute = pathname.startsWith(completeProfileRoute);
  const isLoginRoute = pathname.startsWith(loginRoute);

  if (!session) {
    if (isMainAppRoute || isProfileRoute) {
      return NextResponse.redirect(new URL(loginRoute, request.url));
    }
    return response;
  }

  const userId = session.user.id;
  const { data: profile, error: profileError } = await supabase
    .from("users_eksternal")
    .select("nama, no_telp, alamat")
    .eq("id", userId)
    .single();

  let isProfileComplete = false;
  if (profile && !profileError) {
    if (profile.nama && profile.no_telp && profile.alamat) {
      isProfileComplete = true;
    }
  }
  if (!isProfileComplete && isMainAppRoute) {
    return NextResponse.redirect(new URL(completeProfileRoute, request.url));
  }
  if (isProfileComplete && (isProfileRoute || isLoginRoute)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua rute kecuali file statis dan gambar.
     * Ini akan menjalankan middleware di SEMUA halaman,
     * yang penting untuk logika "redirect jika sudah login".
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/error).*)",
  ],
};
