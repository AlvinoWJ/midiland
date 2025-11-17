"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  nama: string;
  email: string;
  no_telp: string | null;
  alamat: string | null;
}

const initialProfileState: UserProfile = {
  id: "",
  nama: "-",
  email: "-",
  no_telp: null,
  alamat: null,
};

interface MessageState {
  type: "error" | "success" | "info";
  text: string;
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a1.5 1.5 0 011.892-1.436L12 18m0 0l3.607 1.203a1.5 1.5 0 011.892 1.436"
      />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.687a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.383a1.5 1.5 0 00-.475-1.073L18.75 16.5a1.5 1.5 0 00-1.073-.475l-.763-.257a1.5 1.5 0 00-1.289.462l-1.404 1.404a18.024 18.024 0 01-7.079-7.079l1.404-1.404c.346-.346.46-.867.257-1.289l-.257-.763a1.5 1.5 0 00-1.073-.475H3.75A2.25 2.25 0 001.5 3.75v2.25c0 1.243 1.007 2.25 2.25 2.25h14.25"
      />
    </svg>
  );
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<MessageState | null>(null);

  const userName =
    profile.nama && profile.nama !== "-" ? profile.nama : user?.email || "-";

  const avatarFallback = userName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const userAvatar =
    user?.user_metadata?.avatar_url ||
    `https://placehold.co/100x100/dc2626/fdecd5?text=${avatarFallback}`;

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      setUser(null);
      setLoading(false);
      router.replace("/auth/login");
      return;
    }

    setUser(auth.user);

    const { data, error } = await supabase
      .from("users_eksternal")
      .select("nama, no_telp, alamat")
      .eq("id", auth.user.id)
      .maybeSingle();

    if (error) {
      console.error("Gagal mengambil profile:", error);
      setSaveMessage({ type: "error", text: "Gagal memuat data profile." });
    }

    setProfile({
      id: auth.user.id,
      email: auth.user.email || "-",
      nama: data?.nama || "-",
      no_telp: data?.no_telp,
      alamat: data?.alamat,
    });

    setLoading(false);
    setSaveMessage(null);
  }, [router]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleSaveChanges = async () => {
    if (!user) {
      setSaveMessage({ type: "error", text: "Pengguna tidak terautentikasi." });
      return;
    }

    setSaveMessage({ type: "info", text: "Menyimpan perubahan..." });
    setLoading(true);

    const updateData = {
      id: user.id,
      email: profile.email,
      nama: profile.nama.trim() || null,
      no_telp: profile.no_telp?.trim() || null,
      alamat: profile.alamat?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (!updateData.email) {
      setLoading(false);
      setSaveMessage({
        type: "error",
        text: "Email tidak ditemukan di profil.",
      });
      return;
    }

    const { error } = await createClient()
      .from("users_eksternal")
      .upsert([updateData], {
        onConflict: "id",
      });

    setLoading(false);

    if (error) {
      console.error("Gagal menyimpan data ke Supabase:", error.message);
      setSaveMessage({
        type: "error",
        text: `Gagal menyimpan: ${error.message}.`,
      });
      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    } else {
      setSaveMessage({ type: "success", text: "Perubahan berhasil disimpan!" });
      setTimeout(async () => {
        await fetchUserProfile();
      }, 3000);
    }
  };

  if (loading && !user && !saveMessage)
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
          Memuat data...
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 border-b pb-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h2 className="text-xl font-semibold">{userName}</h2>
              <p className="text-muted-foreground text-sm break-words">
                {profile.email}
              </p>
            </div>
          </div>

          {saveMessage && (
            <div
              className={`p-3 rounded-lg transition-all duration-300 ${
                saveMessage.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : saveMessage.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-blue-100 text-blue-700 border border-blue-300"
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-red-500" />
                Nama
              </Label>
              <Input
                value={profile.nama === "-" ? "" : profile.nama}
                onChange={(e) =>
                  setProfile({ ...profile, nama: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-red-500" />
                Email
              </Label>
              <Input value={profile.email} disabled />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-red-500" />
                No Telp
              </Label>
              <Input
                value={profile.no_telp || ""}
                onChange={(e) =>
                  setProfile({ ...profile, no_telp: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-red-500" />
                Alamat
              </Label>
              <Input
                value={profile.alamat || ""}
                onChange={(e) =>
                  setProfile({ ...profile, alamat: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSaveChanges}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}