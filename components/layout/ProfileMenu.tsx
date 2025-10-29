// File: components/layout/ProfileMenu.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { useTheme } from "next-themes";

export function ProfileMenu() {
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const userEmail = user?.email;
  const userAvatar =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "Pengguna";
  const avatarFallback = userName
    ? userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Tombol Avatar Trigger */}
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName || "User Avatar"} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* Konten Dropdown Baru Sesuai Desain */}
      <DropdownMenuContent className="w-64" align="end" forceMount>

        {/* Bagian Header Info Profil */}
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-11 w-11">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-semibold leading-none truncate">
              {userName}
            </p>
            <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
              {userEmail}
            </p>
          </div>
        </div>

        {/* Tombol "Profil Saya" (Menggantikan View Profile) */}
        <div className="px-2 pb-2">
          <Button
            asChild
            variant="outline"
            className="w-full justify-center bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 font-medium"
          >
            <Link href="/auth/complete-profile">Profil Saya</Link>
          </Button>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Relevan Untuk Aplikasi Anda */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/properti-saya">
            {/* --- SVG ICON: Properti (Gedung) --- */}
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M8.25 21v-13.5M15.75 21v-13.5M3.75 6h16.5m-16.5 3h16.5m-16.5 3h16.5m-16.5 3h16.5m-16.5 3h16.5"
              />
            </svg>
            <span>Properti Saya</span>
          </Link>
        </DropdownMenuItem>

        {/* --- MENU BARU "EDIT PROFILE" --- */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/auth/complete-profile">
            {/* --- SVG ICON: Edit/Settings (Gerigi) --- */}
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-1.003 1.11-1.226.554-.225 1.151-.24 1.702-.055a2.12 2.12 0 0 1 1.423 1.423c.185.551.17 1.148-.055 1.702-.225.55-.684 1.02-1.226 1.11a2.11 2.11 0 0 1-2.065-2.065Zm0 0a2.11 2.11 0 0 0-2.065-2.065.424.424 0 0 0-.383.219l-.022.044a2.087 2.087 0 0 0-.882 1.616c.01.631.293 1.176.745 1.55a2.087 2.087 0 0 0 1.616-.882l.044-.022a.424.424 0 0 0 .219-.383Zm0 0a2.11 2.11 0 0 1 2.065 2.065.424.424 0 0 1 .383-.219l.022-.044a2.087 2.087 0 0 1 .882-1.616c-.01-.631-.293-1.176-.745-1.55a2.087 2.087 0 0 1-1.616.882l-.044.022a.424.424 0 0 1-.219.383Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12.963 10.606a2.11 2.11 0 0 1-2.065 2.065.424.424 0 0 0-.383.219l-.022.044a2.087 2.087 0 0 0-.882 1.616c.01.631.293 1.176.745 1.55a2.087 2.087 0 0 0 1.616-.882l.044-.022a.424.424 0 0 0 .219-.383Zm0 0a2.11 2.11 0 0 0-2.065-2.065.424.424 0 0 0-.383.219l-.022.044a2.087 2.087 0 0 0-.882 1.616c.01.631.293 1.176.745 1.55a2.087 2.087 0 0 0 1.616-.882l.044-.022a.424.424 0 0 0 .219-.383Zm0 0a2.11 2.11 0 0 1 2.065 2.065.424.424 0 0 1 .383-.219l.022-.044a2.087 2.087 0 0 1 .882-1.616c-.01-.631-.293-1.176-.745-1.55a2.087 2.087 0 0 1-1.616.882l-.044.022a.424.424 0 0 1-.219.383Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.963 18.23-2.065 2.065.424.424.044.022a2.087 2.087 0 0 0 1.616.882c.631-.01 1.176-.293 1.55-.745a2.087 2.087 0 0 0-.882-1.616l-.022-.044a.424.424 0 0 0-.383-.219Zm0 0a2.11 2.11 0 0 0 2.065-2.065.424.424 0 0 0-.219-.383l-.044-.022a2.087 2.087 0 0 0-1.616.882c-.452.374-.735.919-.745 1.55a2.087 2.087 0 0 0 .882 1.616l.022.044a.424.424 0 0 0 .383.219Zm0 0a2.11 2.11 0 0 1-2.065 2.065.424.424 0 0 1-.383-.219l-.022-.044a2.087 2.087 0 0 1-.882-1.616c.01-.631.293-1.176.745-1.55a2.087 2.087 0 0 1 1.616.882l.044.022a.424.424 0 0 1 .219.383Z"
              />
            </svg>
            <span>Edit Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/bantuan">
            {/* --- SVG ICON: Bantuan (Tanda Tanya) --- */}
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
            <span>Bantuan</span>
          </Link>
        </DropdownMenuItem>

        {/* Toggle Dark Mode */}
        <DropdownMenuItem
          onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="cursor-pointer"
        >
          {theme === "dark" ? (
            // --- SVG ICON: Mode Terang (Matahari) ---
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591"
              />
            </svg>
          ) : (
            // --- SVG ICON: Mode Gelap (Bulan) ---
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-6.248Z"
              />
            </svg>
          )}
          <span>{theme === "dark" ? "Mode Terang" : "Mode Gelap"}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Tombol Logout */}
        <LogoutButton>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer" 
          >
            {/* --- SVG ICON: Logout (Keluar) --- */}
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3H6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 6 21h7.5a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
            <span>Keluar</span>
          </DropdownMenuItem>
        </LogoutButton>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}