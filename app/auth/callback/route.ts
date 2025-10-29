// File: app/auth/callback/route.ts

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies(); 
    
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.delete({ name, ...options });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Autentikasi Berhasil</title>
          <script>
            // Kirim pesan "auth_success" ke halaman induk
            window.opener.postMessage("auth_success", "${origin}");
            
            // Tutup jendela pop-up ini
            window.close();
          </script>
        </head>
        <body>
          Menyelesaikan login... Jendela ini akan tertutup secara otomatis.
        </body>
        </html>
        `,
        {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }
      );
    }
  }

  console.error("Error during auth callback:", "No code or exchange error");
  const errorUrl = new URL("/auth/error", origin);
  return NextResponse.redirect(errorUrl);
}