"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Alert from "@/components/ui/alert";

import {
  Loader2,
  IdCard,
  Smartphone,
  Mail,
  MapPin,
} from "lucide-react";

const MAX_LENGTH_NAMA = 50;
const MAX_LENGTH_TELP = 15;
const MAX_LENGTH_ALAMAT = 255;

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
  type: "success" | "error" | "info";
  text: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<SupabaseUser | null>(null);
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
      console.error("Error:", error);
      setSaveMessage({
        type: "error",
        text: "Gagal memuat data profil.",
      });
    }

    setProfile({
      id: auth.user.id,
      email: auth.user.email || "-",
      nama: data?.nama || "-",
      no_telp: data?.no_telp,
      alamat: data?.alamat,
    });

    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleSaveChanges = async () => {
    if (!user) {
      setSaveMessage({
        type: "error",
        text: "Pengguna tidak terautentikasi.",
      });
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

    const { error } = await createClient()
      .from("users_eksternal")
      .upsert([updateData], { onConflict: "id" });

    setLoading(false);

    if (error) {
      console.error("Gagal menyimpan:", error.message);
      setSaveMessage({
        type: "error",
        text: `Gagal menyimpan: ${error.message}`,
      });
      return;
    }

    setSaveMessage({
      type: "success",
      text: "Perubahan berhasil disimpan!",
    });

    setTimeout(() => fetchUserProfile(), 2000);
  };

  if (loading && !user)
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
          Memuat data...
        </CardContent>
      </Card>
    );

  const namaLength = (profile.nama === "-" ? "" : profile.nama).length;
  const telpLength = (profile.no_telp || "").length;
  const alamatLength = (profile.alamat || "").length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 border-b pb-4 w-full">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>

            <div className="text-center w-full px-2">
              <h2 className="text-xl font-semibold break-words w-full">
                {userName}
              </h2>
              <p className="text-muted-foreground text-sm break-all">
                {profile.email}
              </p>
            </div>
          </div>

          {saveMessage && (
            <Alert
              type={saveMessage.type}
              title={
                saveMessage.type === "error"
                  ? "Error"
                  : saveMessage.type === "success"
                  ? "Berhasil"
                  : "Info"
              }
              message={saveMessage.text}
              autoClose
              duration={3500}
            />
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IdCard className="h-4 w-4 text-red-500" />
                Nama
              </Label>
              <Input
                value={profile.nama === "-" ? "" : profile.nama}
                onChange={(e) =>
                  setProfile({ ...profile, nama: e.target.value })
                }
                maxLength={MAX_LENGTH_NAMA}
              />
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-red-500 font-medium text-left">
                  {namaLength === MAX_LENGTH_NAMA && "Batas maksimal tercapai"}
                </span>
                <span
                  className={`text-xs whitespace-nowrap flex-shrink-0 ${
                    namaLength === MAX_LENGTH_NAMA
                      ? "text-red-500 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {namaLength}/{MAX_LENGTH_NAMA} karakter
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-500" />
                Email
              </Label>
              <Input value={profile.email} disabled />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-red-500" />
                No Telp
              </Label>
              <Input
                type="tel"
                value={profile.no_telp || ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9]/g, "");
                  setProfile({ ...profile, no_telp: numericValue });
                }}
                placeholder="Contoh: 081234567890"
                maxLength={MAX_LENGTH_TELP}
              />
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-red-500 font-medium text-left">
                  {telpLength === MAX_LENGTH_TELP && "Batas maksimal tercapai"}
                </span>
                <span
                  className={`text-xs whitespace-nowrap flex-shrink-0 ${
                    telpLength === MAX_LENGTH_TELP
                      ? "text-red-500 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {telpLength}/{MAX_LENGTH_TELP} digit
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                Alamat
              </Label>
              <Input
                value={profile.alamat || ""}
                onChange={(e) =>
                  setProfile({ ...profile, alamat: e.target.value })
                }
                maxLength={MAX_LENGTH_ALAMAT}
              />
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-red-500 font-medium text-left">
                  {alamatLength === MAX_LENGTH_ALAMAT &&
                    "Batas maksimal tercapai"}
                </span>
                <span
                  className={`text-xs whitespace-nowrap flex-shrink-0 ${
                    alamatLength === MAX_LENGTH_ALAMAT
                      ? "text-red-500 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {alamatLength}/{MAX_LENGTH_ALAMAT} karakter
                </span>
              </div>
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