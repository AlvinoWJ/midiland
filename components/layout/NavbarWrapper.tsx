"use client";

import { usePathname } from "next/navigation";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/sign-up");

  if (hideNavbar) return null;
  return <>{children}</>;
}
