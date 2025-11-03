"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function NavbarLanding() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-primary">Midi</span>
          <span className="text-secondary">Land</span>
        </Link>

        {/* Tombol Auth */}
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
      </div>
    </header>
  );
}
