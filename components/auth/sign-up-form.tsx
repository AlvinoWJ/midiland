"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOff } from "lucide-react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Konfirmasi kata sandi tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      // console.log("Attempting sign up with:", { email, password, name });
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
          data: { full_name: name },
        },
      });

      if (error) {
        // console.log("Supabase signUp error:", error); // 🔹 log error dari Supabase
        throw error;
      }

      // ✅ Simpan email ke localStorage agar tetap bisa diambil
      // console.log("SignUp success, saving email to localStorage:", email);
      localStorage.setItem("signUpEmail", email);

      // 🛑 PERBAIKAN:
      // Hapus query parameter. Kita hanya akan navigasi ke halaman.
      // Data email akan dibaca dari localStorage di halaman berikutnya.
      router.push(`/auth/sign-up-success`);
      
    } catch (err: unknown) {
      // console.log("SignUp catch error:", err); // 🔹 log catch error
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat mendaftar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    // ... (kode handleGoogleSignUp tidak berubah)
    const supabase = createClient();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=popup`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal login dengan Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center",
        className
      )}
      {...props}
    >
      {/* ... (sisa JSX tidak berubah) ... */}
      {/* Kiri: Form */}
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Buat Akun <span className="text-primary">Midi</span>
          <span className="text-secondary">Land</span>
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Nama */}
          <div className="grid gap-1">
            <Label htmlFor="name" className="text-sm font-medium text-gray-600">
              Nama *
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="grid gap-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-600">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="grid gap-1 relative">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-600"
            >
              Buat Kata Sandi *
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-[2.1rem] text-gray-400"
            >
              <EyeOff size={18} />
            </button>
          </div>

          {/* Konfirmasi Password */}
          <div className="grid gap-1 relative">
            <Label
              htmlFor="repeat-password"
              className="text-sm font-medium text-gray-600"
            >
              Konfirmasi Kata Sandi *
            </Label>
            <Input
              id="repeat-password"
              type="password"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-[2.1rem] text-gray-400"
            >
              <EyeOff size={18} />
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center pt-2">{error}</p>
          )}

          {/* Tombol */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary/90 text-white rounded-md h-10 px-8"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>
            <span className="text-xs text-gray-500">Atau</span>
            <Button
              variant="outline"
              type="button"
              className="flex items-center justify-center gap-2 border-gray-300 rounded-md h-10 text-gray-700 px-4"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <Image src="/google.svg" alt="Google" width={16} height={16} />
              Daftar dengan Google
            </Button>
          </div>
        </form>

        {/* Link Login */}
        <div className="mt-6 text-center text-xs text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-secondary hover:underline"
          >
            Masuk disini.
          </Link>
        </div>
      </div>

      {/* Kanan: Ilustrasi */}
      <div className="hidden md:flex justify-center items-center">
        <Image
          src="/alfamidi.svg"
          alt="Ilustrasi Alfamidi"
          width={350}
          height={326}
          className="w-full max-w-xs h-auto"
        />
      </div>
    </div>
  );
}