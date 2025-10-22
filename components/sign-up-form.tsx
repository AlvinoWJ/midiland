// alvinowj/midiland/midiland-front_end/components/sign-up-form.tsx
"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
// Hapus Card components jika kita styling manual
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image"; // Import Image
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOff } from "lucide-react"; // Contoh ikon visibility

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState(""); // Tambah state untuk Nama
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
      // Tambahkan 'name' ke metadata jika diinginkan
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // emailRedirectTo: `${window.location.origin}/protected`, // Sesuaikan redirect
          data: {
            full_name: name, // Contoh menyimpan nama
          },
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success"); // Arahkan ke halaman sukses
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

  // Handler untuk Google Sign Up (placeholder)
  const handleGoogleSignUp = async () => {
    alert("Google Sign-Up belum diimplementasikan");
  };

  // return (
  //   // Hapus Card component bawaan, ganti dengan div styling manual
  //   <div className={cn("flex flex-col gap-6", className)} {...props}>
  //     <Card>...</Card>
  //   </div>
  // );

  // Ganti return di atas dengan ini:
  return (
    // Card Container Utama
    <div
      className={cn(
        "bg-white rounded-2xl shadow-xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center", // Grid 2 kolom di md+, padding, shadow, rounded
        className
      )}
      {...props}
    >
      {/* Kolom Kiri: Form */}
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {" "}
          {/* text-midiland-text */}
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
              placeholder="" // Kosongkan placeholder jika sesuai desain
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md"
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
              placeholder=""
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md"
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
              type="password" // Ganti ke "text" jika visibility on
              placeholder=""
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md pr-10" // Padding kanan untuk ikon
            />
            {/* Placeholder Ikon Visibility */}
            <button
              type="button"
              className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
            >
              <EyeOff size={18} /> {/* Ganti dengan logic toggle & ikon Eye */}
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
              type="password" // Ganti ke "text" jika visibility on
              placeholder=""
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="rounded-md pr-10"
            />
            {/* Placeholder Ikon Visibility */}
            <button
              type="button"
              className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
            >
              <EyeOff size={18} /> {/* Ganti dengan logic toggle & ikon Eye */}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center pt-2">{error}</p>
          )}

          {/* Tombol Daftar & Google */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              className="bg-secondary hover:bg-secondary/90 text-white rounded-md h-10 px-8" // Biru, padding
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>
            <span className="text-xs text-gray-500">Atau</span>
            <Button
              variant="outline"
              type="button" // Type button agar tidak submit form
              className="flex items-center justify-center gap-2 border-gray-300 rounded-md h-10 text-gray-700 px-4" // Outline
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              {/* GANTI dengan Image/Ikon Google */}
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={16}
                height={16}
              />
              Daftar dengan Google
            </Button>
          </div>
        </form>

        {/* Link Login */}
        <div className="mt-6 text-center text-xs text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/auth/login" // Arahkan ke halaman login
            className="font-medium text-secondary hover:underline" // Biru
          >
            Masuk disini.
          </Link>
        </div>
      </div>

      {/* Kolom Kanan: Ilustrasi */}
      <div className="hidden md:flex justify-center items-center">
        {/* === TEMPATKAN IMAGE ILUSTRASI TOKO ANDA DI SINI === */}
        <Image
          src="/alfamidi.svg" // <<< GANTI DENGAN PATH ILUSTRASI ANDA
          alt="Ilustrasi Alfamidi"
          width={350} // Sesuaikan ukuran
          height={326} // Sesuaikan ukuran
          className="w-full max-w-xs h-auto" // Responsif
        />
      </div>
    </div>
  );
}
