// components/layout/ProfileMenu.tsx

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { History, LogOut, Settings, User as UserIcon, FilePlus } from "lucide-react";

export function ProfileMenu() {
  const [user, setUser] = useState<User | null>(null);

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
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar} alt={userName || "User Avatar"} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={0}
        className="w-72 p-0 border-0 rounded-lg overflow-visible relative"
        sideOffset={12}
        forceMount
      >
        <div className="shadow-lg rounded-lg relative border border-red-600">
          <div
            className="absolute top-[-9px] right-6 w-4 h-4 transform rotate-45 z-30 bg-white border-t border-l border-red-600"
          ></div>

          <div className="py-4 px-4 bg-white rounded-t-lg relative z-20 text-gray-900">
            <p className="text-sm font-semibold leading-none">
              {userName}
            </p>
            <p className="text-xs leading-none text-muted-foreground mt-1 break-words">
              {userEmail}
            </p>
          </div>

          <div className="px-4 bg-white">
            <div className="h-px bg-gray-200" />
          </div>

          <div className="p-2 bg-white text-gray-900">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profil Saya</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/input">
                <FilePlus className="mr-2 h-4 w-4" />
                <span>Pengajuan Properti</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/status">
                <History className="mr-2 h-4 w-4" />
                <span>Status Properti</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/profile/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </Link>
            </DropdownMenuItem>
          </div>

          <div className="px-4 bg-white">
            <div className="h-px bg-gray-200" />
          </div>

          <div className="p-2 bg-white rounded-b-lg">
            <LogoutButton>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </LogoutButton>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}