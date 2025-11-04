"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./ProfileMenu";

export default function NavbarDashboard() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pengajuan Properti", href: "/input" },
    { name: "Status Properti", href: "/status" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/main/dashboard" className="text-xl font-bold">
          <span className="text-primary">Midi</span>
          <span className="text-secondary">Land</span>
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary relative pb-1 ${
                isActive(item.href) ? "text-primary" : "text-gray-700"
              }`}
            >
              {item.name}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </Link>
          ))}
        </nav>

        {/* Profile menu */}
        <div className="flex items-center gap-4">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
