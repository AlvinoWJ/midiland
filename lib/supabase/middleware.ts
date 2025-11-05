// // middleware.ts (root project)

// import { NextResponse, type NextRequest } from "next/server";
// import { createServerClient } from "@supabase/ssr";
// import { hasEnvVars } from "@/lib/utils";


// const protectedRoutes = ["/(main)/dashboard", "/(main)/input", "/(main)/status"];

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({ request });

//   if (!hasEnvVars) return response;

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll();
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) =>
//             request.cookies.set(name, value)
//           );
//           response = NextResponse.next({ request });
//           cookiesToSet.forEach(({ name, value, options }) =>
//             response.cookies.set(name, value, options)
//           );
//         },
//       },
//     }
//   );

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const pathname = request.nextUrl.pathname;

//   if (!session && protectedRoutes.some((r) => pathname.startsWith(r))) {
//     const loginUrl = new URL("/auth/login", request.url);
//     return NextResponse.redirect(loginUrl);
//   }
//   if (session && pathname.startsWith("/(main)")) {
//     const user = session.user;
//     const name = user?.user_metadata?.name;
//     const picture = user?.user_metadata?.avatar_url;

//     if (!name || !picture) {
//       const completeProfileUrl = new URL("/auth/complete-profile", request.url);
//       return NextResponse.redirect(completeProfileUrl);
//     }
//   }

//   return response;
// }

// export const config = {
//   matcher: [
//     "/(main)/dashboard/:path*",
//     "/(main)/input/:path*",
//     "/(main)/status/:path*",
//   ],
// };
