// alvinowj/midiland/midiland-front_end/app/auth/sign-up/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  // === DIKEMBALIKAN KE VERSI ASLI ===
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  // ===================================

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // === FUNGSI SIGNUP ASLI DIKEMBALIKAN ===
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendaftar"
      );
    } finally {
      setIsLoading(false);
    }
  };
  // =========================================

  const handleGoogleSignUp = async () => {
    alert("Google Sign-Up belum diimplementasikan");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 md:p-10 bg-gray-100">
      {/* === PERBAIKAN BACKGROUND === */}
      {/* Wrapper ini membatasi gambar hanya di 50% atas layar */}
      <div className="absolute top-0 left-0 w-full h-1/2 z-0">
        <Image
          src="/signup.svg" // <<< PATH BACKGROUND KOTA
          alt="City Background"
          layout="fill"
          objectFit="cover"
          quality={80}
          aria-hidden="true"
        />
      </div>
      {/* === AKHIR PERBAIKAN === */}
      {/* Card Form - z-10 agar berada di atas background */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Logo Alfamidi - Kembali ke posisi asli (kanan atas) */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12">
          <Image
            src="/alfamidilogo.svg" // <<< PATH LOGO ALFAMIDI
            alt="Alfamidi Logo"
            width={100} // Sesuaikan ukuran
            height={33} // Sesuaikan ukuran
          />
        </div>
        {/* Grid Konten Card */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Kolom Kiri: Form - KEMBALI KE VERSI ASLI */}
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Buat Akun <span className="text-primary">Midi</span>
              <span className="text-secondary">Land</span>
            </h1>

            <form onSubmit={handleSignUp} className="max-w-lg space-y-4">
              {/* Nama */}
              <div className="grid gap-1">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-600"
                >
                  Nama *
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md border-gray-300 focus:border-secondary focus:ring-secondary"
                />
              </div>

              {/* Email */}
              <div className="grid gap-1">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-600"
                >
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border-gray-300 focus:border-secondary focus:ring-secondary"
                />
              </div>

              {/* Buat Kata Sandi */}
              <div className="grid gap-1 relative">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-600"
                >
                  Buat Kata Sandi *
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md border-gray-300 focus:border-secondary focus:ring-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* Konfirmasi Kata Sandi */}
              <div className="grid gap-1 relative">
                <Label
                  htmlFor="repeat-password"
                  className="text-sm font-medium text-gray-600"
                >
                  Konfirmasi Kata Sandi Anda *
                </Label>
                <Input
                  id="repeat-password"
                  type={showRepeatPassword ? "text" : "password"}
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="rounded-md border-gray-300 focus:border-secondary focus:ring-secondary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                  aria-label={
                    showRepeatPassword
                      ? "Sembunyikan konfirmasi kata sandi"
                      : "Tampilkan konfirmasi kata sandi"
                  }
                >
                  {showRepeatPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-xs text-red-500 text-center pt-2">{error}</p>
              )}

              {/* Tombol Daftar */}
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-md transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>
            </form>

            {/* Separator */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500 font-medium">
                  Atau
                </span>
              </div>
            </div>

            {/* Tombol Google */}
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400 rounded-md text-gray-700 transition-all duration-200"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={18}
                height={18}
              />
              <span className="hidden sm:inline">Daftar dengan Google</span>
              <span className="sm:hidden">Google</span>
            </Button>

            {/* Link ke Login */}
            <div className="mt-6 text-center text-sm text-gray-700">
              Sudah punya akun?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-primary hover:underline"
              >
                Masuk disini.
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Ilustrasi (Versi Asli) */}
          <div className="hidden md:flex justify-center items-center">
            <Image
              src="/alfamidi.svg" // <<< GANTI DENGAN PATH ILUSTRASI ANDA
              alt="Ilustrasi Alfamidi"
              width={350}
              height={326}
              className="w-full max-w-xs lg:max-w-sm h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
