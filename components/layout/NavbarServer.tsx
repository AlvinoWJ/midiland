// File: components/layout/NavbarServer.tsx
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "./ProfileMenu";

export default async function NavbarServer() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const Logo = (
    <Link href="/" className="font-bold text-2xl">
      <span className="text-primary">Midi</span>
      <span className="text-secondary">Land</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {Logo}

        {session ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/tentang-kami" className="text-sm font-medium">
                Tentang Kami
              </Link>
            </Button>
            <ProfileMenu />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary font-semibold rounded-full px-6"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="default"
              className="font-semibold rounded-full px-6"
            >
              <Link href="/auth/sign-up">Register</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
