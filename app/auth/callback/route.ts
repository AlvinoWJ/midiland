import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const redirectTo = searchParams.get("redirect");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  // ✅ Versi aman & kompatibel penuh TypeScript
  const cookieStore = await Promise.resolve(cookies());

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  // Tukar kode Supabase menjadi session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    //console.error("❌ Error during exchangeCodeForSession:", error.message);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  // ✅ Jika login via popup (misal Google OAuth)
  if (redirectTo === "popup") {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head><title>Login Sukses</title></head>
        <body>
          <script>
            window.opener.postMessage("auth_success", "${origin}");
            window.close();
          </script>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  // ✅ Kalau hasil dari verifikasi email (sign up)
  if (type === "signup") {
    return NextResponse.redirect(new URL("/auth/complete-profile", origin));
  }

  // ✅ Kalau hasil dari login biasa
  return NextResponse.redirect(new URL("/dashboard", origin));
}
