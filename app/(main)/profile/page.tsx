"use client";

import { useState, useEffect, useCallback } from "react";
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

type ActiveTab = "user-info" | "notifications" | "setting";
type SettingView = "main" | "change-password";

const tabTitles: Record<ActiveTab, string> = {
  "user-info": "User Info",
  notifications: "Notifikasi",
  setting: "Pengaturan Akun",
};

interface MessageState {
  type: "error" | "success" | "info";
  text: string;
}

interface ChangePasswordFormProps {
  setSettingView: React.Dispatch<React.SetStateAction<SettingView>>;
}

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
);

const ChangePasswordForm = ({ setSettingView }: ChangePasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<MessageState | null>(null);
  const [loading, setLoading] = useState(false);

  const isPasswordValid = newPassword.length >= 8;
  const isConfirmationMatch = newPassword === confirmPassword;

  const handleSubmit = async () => {
    setMessage(null);

    if (!isPasswordValid) {
      setMessage({ type: "error", text: "Password baru harus minimal 8 karakter." });
      return;
    }

    if (!isConfirmationMatch) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: "error", text: "Gagal mengganti password: " + error.message });
    } else {
      setMessage({ type: "success", text: "Password berhasil diganti!" });
      setNewPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LockIcon className="w-6 h-6 text-red-500" />
            Ganti Password
          </h2>
          <Button
            variant="link"
            onClick={() => setSettingView("main")}
            className="text-red-500 p-0 h-auto"
          >
            ← Kembali
          </Button>
        </div>

        <div className="space-y-6 max-w-lg mx-auto">
          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-2">
            <Label>Password Baru</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
            />
          </div>

          <div className="space-y-2">
            <Label>Konfirmasi Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            disabled={loading || !isPasswordValid || !isConfirmationMatch}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Ubah Password"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("user-info");
  const [settingView, setSettingView] = useState<SettingView>("main");
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
  }, []);

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
        setSaveMessage({ type: "error", text: "Email tidak ditemukan di profil." });
        return;
    }

    const { error } = await createClient().from("users_eksternal").upsert([updateData], {
      onConflict: "id",
    });

    setLoading(false);

    if (error) {
        console.error("Gagal menyimpan data ke Supabase:", error.message); 
        setSaveMessage({ 
            type: "error", 
            text: `Gagal menyimpan: ${error.message}.`
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
  const renderContent = () => {
    if (loading && !user && !saveMessage) 
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
            Memuat data...
          </CardContent>
        </Card>
      );
    
    if (activeTab === "user-info") {
      if (settingView !== "main") setSettingView("main");

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

    if (activeTab === "setting") {
      if (settingView === "change-password") {
        return <ChangePasswordForm setSettingView={setSettingView} />;
      }

      return (
        <Card>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">Pengaturan Akun</h2>
            <Button
              variant="outline"
              className="w-full justify-start text-left gap-3 text-red-500 border-red-200"
              onClick={() => setSettingView("change-password")}
            >
              <LockIcon className="h-5 w-5" /> Ganti Password
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (activeTab === "notifications") {
        if (settingView !== "main") setSettingView("main");
        
        return (
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold">Notifikasi</h2>
                    <p className="text-muted-foreground text-sm mt-2">
                        Pengaturan notifikasi akan tersedia segera.
                    </p>
                </CardContent>
            </Card>
        );
    }
    
    return null;
  };
  
  const MobileNav = () => (
    <nav className="bg-white border-r py-4 px-2 flex flex-col gap-4 md:hidden">
      <button
        onClick={() => setActiveTab("user-info")}
        className={`p-3 rounded-lg transition-colors ${
          activeTab === "user-info"
            ? "bg-red-500 text-white"
            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
        }`}
        title="User Info"
      >
        <UserCircleIcon className="h-6 w-6" />
      </button>

      <button
        onClick={() => setActiveTab("notifications")}
        className={`p-3 rounded-lg transition-colors ${
          activeTab === "notifications"
            ? "bg-red-500 text-white"
            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
        }`}
        title="Notifikasi"
      >
        <BellIcon className="h-6 w-6" />
      </button>

      <button
        onClick={() => setActiveTab("setting")}
        className={`p-3 rounded-lg transition-colors ${
          activeTab === "setting"
            ? "bg-red-500 text-white"
            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
        }`}
        title="Pengaturan Akun"
      >
        <SettingsIcon className="h-6 w-6" />
      </button>
    </nav>
  );

  return (
    <div className="flex h-screen w-full">
      <MobileNav />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-7 px-4 md:px-6">
          <h1 className="text-3xl font-bold tracking-tight mb-8 hidden md:block">
            {tabTitles[activeTab]}
          </h1>

          <h1 className="text-2xl font-bold tracking-tight mb-6 md:hidden">
            {tabTitles[activeTab]}
          </h1>

          <div className="flex flex-col md:flex-row gap-10 w-full">
            <nav className="hidden md:flex md:flex-col gap-2 w-1/4 lg:w-1/5 sticky top-24 self-start">
              <Button
                variant="ghost"
                className={`justify-start gap-3 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-500 ${
                  activeTab === "user-info"
                    ? "text-red-500 border-r-2 border-red-500 bg-red-50/50"
                    : ""
                }`}
                onClick={() => setActiveTab("user-info")}
              >
                <UserCircleIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">User Info</span>
              </Button>

              <Button
                variant="ghost"
                className={`justify-start gap-3 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-500 ${
                  activeTab === "notifications"
                    ? "text-red-500 border-r-2 border-red-500 bg-red-50/50"
                    : ""
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <BellIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">Notifications</span>
              </Button>

              <Button
                variant="ghost"
                className={`justify-start gap-3 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-500 ${
                  activeTab === "setting"
                    ? "text-red-500 border-r-2 border-red-500 bg-red-50/50"
                    : ""
                }`}
                onClick={() => setActiveTab("setting")}
              >
                <SettingsIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">Account Settings</span>
              </Button>
            </nav>
            <main className="w-full md:flex-1 md:w-3/4 lg:w-4/5 min-h-[500px]">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}
function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a1.5 1.5 0 011.892-1.436L12 18m0 0l3.607 1.203a1.5 1.5 0 011.892 1.436" />
    </svg>
  );
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.687a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.383a1.5 1.5 0 00-.475-1.073L18.75 16.5a1.5 1.5 0 00-1.073-.475l-.763-.257a1.5 1.5 0 00-1.289.462l-1.404 1.404a18.024 18.024 0 01-7.079-7.079l1.404-1.404c.346-.346.46-.867.257-1.289l-.257-.763a1.5 1.5 0 00-1.073-.475H3.75A2.25 2.25 0 001.5 3.75v2.25c0 1.243 1.007 2.25 2.25 2.25h14.25" />
    </svg>
  );
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}