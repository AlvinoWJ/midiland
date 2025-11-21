"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

type Step = "enter_email" | "enter_code" | "enter_new_password";
type Message = { type: "error" | "success"; content: string } | null;

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("enter_email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<Message>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (step !== "enter_code" || countdown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    );

    if (resetError) {
      setMessage({
        type: "error",
        content: "Email tidak terdaftar atau gagal mengirim.",
      });
      setIsLoading(false);
      return;
    }

    setStep("enter_code");
    setCountdown(60);
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (error) throw error;
      
      setToken("");
      setCountdown(60);
      setMessage({ type: "success", content: "Kode verifikasi baru telah dikirim." });
    } catch (err) {
      setMessage({
        type: "error",
        content:
          err instanceof Error ? err.message : "Gagal mengirim ulang kode.",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length < 6) {
      setMessage({ type: "error", content: "Silakan masukkan 6 digit kode lengkap." });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "recovery",
      });
      if (verifyError) throw verifyError;
      if (!data.session)
        throw new Error("Could not verify your identity. Please try again.");
      setStep("enter_new_password");
    } catch {
      setMessage({
        type: "error",
        content:
          "Kode yang Anda masukkan salah. Silakan cek kembali kode pada email Anda.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", content: "Password tidak sama / tidak sesuai." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", content: "Password minimal 6 karakter." });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      await supabase.auth.signOut();

      setMessage({
        type: "success",
        content: "Password berhasil diubah! Mengarahkan ke login...",
      });
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (err) {
      setMessage({
        type: "error",
        content:
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mereset password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTokenChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const char = value.slice(-1);
    const newToken = [...token.split("")];
    newToken[index] = char;
    setToken(newToken.join("").slice(0, 6));
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      handleVerifyOtp(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    setToken(pastedData);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const renderMessage = () => {
    if (!message) return null;
    if (message.type === 'error') {
      return <p className="text-xs text-primary bg-red-50 p-2 rounded-lg">{message.content}</p>;
    }
    if (message.type === 'success') {
      return <p className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">{message.content}</p>;
    }
    return null;
  };

  const renderStepContent = () => {
    const labelClasses = "text-gray-900 font-medium text-sm";
    const inputClasses = "h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm";
    const buttonClasses = "w-full bg-secondary hover:bg-secondary/90 text-white rounded-md h-10";

    switch (step) {
      case "enter_email":
        return (
          <form onSubmit={handleSendRecoveryEmail} className="space-y-3">
            {message && renderMessage()}
            <div className="space-y-1">
              <Label htmlFor="email" className={labelClasses}>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan alamat email Anda"
                className={inputClasses}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button 
              type="submit"
              className={buttonClasses}
              disabled={isLoading}
            >
              {isLoading ? "Mengirim..." : "Kirim Kode Verifikasi"}
            </Button>
          </form>
        );

      case "enter_code":
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Kode 6 digit telah dikirim ke <span className="font-semibold text-gray-900">{email}</span>
            </p>
            {message && renderMessage()}
            <div>
              <Label htmlFor="token-0" className={cn(labelClasses, "text-center block mb-2")}>
                Masukkan Kode Verifikasi
              </Label>
              <div
                className="flex justify-center gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    id={`token-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={token[index] || ""}
                    onChange={(e) => handleTokenChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className="aspect-square h-auto w-full max-w-[48px] rounded-lg text-center text-2xl font-bold bg-white border-2 border-gray-300 text-gray-900 focus:border-secondary focus:ring-secondary focus:outline-none transition-all duration-200"
                    autoComplete="one-time-code"
                    required
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center text-sm">
              {countdown > 0 ? (
                <p className="text-gray-600">
                  Kirim ulang kode dalam <span className="font-mono font-semibold text-gray-900">{formatTime(countdown)}</span>
                </p>
              ) : (
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={handleResendOtp}
                  disabled={isResending}
                >
                  {isResending ? "Mengirim ulang..." : "Kirim Ulang Kode"}
                </button>
              )}
            </div>
            
            <Button 
              type="submit"
              className={buttonClasses}
              disabled={isLoading || token.length < 6}
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi Kode"}
            </Button>
            
            <button
              type="button"
              onClick={() => setStep("enter_email")}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              ← Kembali
            </button>
          </form>
        );

      case "enter_new_password":
        return (
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            {message && renderMessage()}
            
            <div className="space-y-1">
              <Label htmlFor="newPassword" className={labelClasses}>Password Baru</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  className={cn(inputClasses, "pr-10")}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle new password visibility"
                >
                  {showNewPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className={labelClasses}>Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  className={cn(inputClasses, "pr-10")}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit"
              className={buttonClasses}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Reset Password"}
            </Button>
          </form>
        );
    }
  };

  return (
    <div className="w-full">
      {renderStepContent()}
    </div>
  );
}