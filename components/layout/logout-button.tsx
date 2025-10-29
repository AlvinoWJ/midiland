// File: components/logout-button.tsx

"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React from "react";

interface LogoutButtonProps {
  children: React.ReactNode;
  className?: string; 
}

export function LogoutButton({ children, className }: LogoutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return;
    }

    router.refresh();
  };

  return (
    <span 
      onClick={handleSignOut} 
      className={className} 
      style={{ 
        cursor: 'pointer', 
        width: '100%',
        display: 'contents'
      }}
    >
      {children}
    </span>
  );
}