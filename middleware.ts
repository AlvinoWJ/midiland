// middleware.ts

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const mainAppRoutes = ["/dashboard", "/input", "/status", "/profile"];

const guestRoutes = [
  "/auth/login",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/update-password",
  "/auth/error",
];

const completeProfileRoute = "/auth/complete-profile";

const utilityRoutes = [
  "/auth/callback",
  "/auth/sign-up-success",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (utilityRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isMainAppRoute = mainAppRoutes.some((r) => pathname.startsWith(r));
  const isGuestRoute = guestRoutes.some((r) => pathname.startsWith(r));
  const isProfileRoute = pathname.startsWith(completeProfileRoute);
  const isRootRoute = pathname === "/"; 
  
  if (!session) {
    if (isMainAppRoute || isProfileRoute) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return response;
  }
  

  const userId = session.user.id;

  const { data: profile } = await supabase
    .from("users_eksternal")
    .select("nama, no_telp, alamat")
    .eq("id", userId)
    .maybeSingle();

  const isProfileComplete = Boolean(
    profile?.nama && profile?.no_telp && profile?.alamat
  );

  if (isProfileComplete) {
    if (isGuestRoute || isProfileRoute || isRootRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (isMainAppRoute || isGuestRoute || isRootRoute) {
      return NextResponse.redirect(new URL(completeProfileRoute, request.url));
    }
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};