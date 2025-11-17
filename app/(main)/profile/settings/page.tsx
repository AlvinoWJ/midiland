"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type SettingView = "main" | "change-password";
interface MessageState {
  type: "error" | "success" | "info";
  text: string;
}
interface ChangePasswordFormProps {
  setSettingView: React.Dispatch<React.SetStateAction<SettingView>>;
}

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      setMessage({
        type: "error",
        text: "Password baru harus minimal 8 karakter.",
      });
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
      setMessage({
        type: "error",
        text: "Gagal mengganti password: " + error.message,
      });
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

export default function SettingsPage() {
  const [settingView, setSettingView] = useState<SettingView>("main");

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