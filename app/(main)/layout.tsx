"use client";

import { useEffect, useState } from "react";
import NavbarDashboard from "@/components/layout/navbardashboard";
import Footer from "@/components/layout/footer";
import { ChatBotButton } from "@/components/chatbot/ChatBotButton";
import { createClient } from "@/lib/supabase/client";

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 💡 Buat state untuk menampung nama dan avatar
  const [userData, setUserData] = useState<{ name?: string; avatar?: string }>({
    name: undefined,
    avatar: undefined,
  });

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (data.user) {
        const name = data.user.user_metadata.full_name || data.user.email;
        const avatar =
          data.user.user_metadata.avatar_url || data.user.user_metadata.picture;

        setUserData({ name, avatar });
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="relative flex-1 bg-gray-50 min-h-screen">
      <NavbarDashboard />
      <ChatBotButton userName={userData.name} userAvatar={userData.avatar} />
      <div className="relative z-10">{children}</div>
      <Footer />
    </div>
  );
}
