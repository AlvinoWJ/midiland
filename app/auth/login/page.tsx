// alvinowj/midiland/midiland-front_end/app/auth/login/page.tsx
"use client"; // Diperlukan karena kita menggunakan state dan event handling

import Link from "next/link";
import Image from "next/image"; // Untuk logo dan ilustrasi
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Impor ikon Google jika Anda punya (misalnya dari lucide-react atau SVG)
// import { GoogleIcon } from '@/components/icons/google';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Arahkan ke halaman setelah login berhasil (misal: dashboard)
      router.push("/"); // Ganti "/protected" dengan rute yang sesuai
      router.refresh(); // Refresh halaman untuk memastikan state auth terupdate
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk Google Sign In (implementasi nanti)
  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    // setIsLoading(true); // Opsional
    // setError(null); // Opsional
    // try {
    //   const { error } = await supabase.auth.signInWithOAuth({
    //     provider: 'google',
    //     options: {
    //       redirectTo: `${window.location.origin}/auth/callback`, // Sesuaikan jika perlu
    //     },
    //   });
    //   if (error) throw error;
    // } catch (error: unknown) {
    //   setError(error instanceof Error ? error.message : "Google Sign-In failed");
    //   // setIsLoading(false); // Opsional
    // }
    alert("Google Sign-In belum diimplementasikan");
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Kolom Kiri: Form Login (Terlihat di semua ukuran layar) */}
      <div className="flex flex-1 flex-col justify-center items-center p-6 md:p-10 lg:p-16 bg-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo Alfamidi */}
          <div className="flex justify-center mb-4">
            {/* Ganti dengan Image component */}
            <div className="h-10 w-32 bg-gray-200 flex items-center justify-center text-sm">
              [Logo Alfamidi]
            </div>
          </div>
          {/* Ilustrasi Toko Kecil (opsional, bisa ada atau tidak sesuai preferensi) */}
          <div className="flex justify-center mb-6">
            {/* Ganti dengan Image component */}
            <div className="h-32 w-48 bg-gray-200 flex items-center justify-center text-sm">
              [Ilustrasi Toko]
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Masuk ke MidiLand
            </h1>
            {/* Tambahkan deskripsi jika ada */}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-base md:text-sm" // Pastikan styling konsisten
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password" // Arahkan ke halaman lupa password
                  className="ml-auto inline-block text-sm text-blue-600 hover:underline" // Sesuaikan warna
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-base md:text-sm" // Pastikan styling konsisten
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {" "}
              {/* Sesuaikan warna */}
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {/* Separator "Atau" */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Atau</span>
            </div>
          </div>

          {/* Tombol Google Sign In */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-gray-300"
            onClick={handleGoogleSignIn}
            disabled={isLoading} // Optional: disable while main login is processing
          >
            {/* <GoogleIcon className="h-4 w-4" /> */}
            <span className="h-4 w-4 bg-gray-200 text-xs">[G]</span>{" "}
            {/* Placeholder Ikon Google */}
            Masuk dengan Google
          </Button>

          {/* Link Sign Up */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/auth/sign-up" // Arahkan ke halaman sign up
              className="font-medium text-blue-600 hover:underline" // Sesuaikan warna
            >
              Buat akun disini.
            </Link>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Ilustrasi (Hanya terlihat di layar medium ke atas) */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gray-100 items-center justify-center p-10 relative">
        {/* Anda bisa menggunakan background image atau komponen Image */}
        {/* Contoh dengan background color placeholder */}
        <div className="absolute inset-0 bg-blue-200 flex items-center justify-center">
          {/* Placeholder untuk ilustrasi besar */}
          <div className="w-3/4 h-3/4 bg-gray-300 rounded-lg flex flex-col items-center justify-center text-center p-8 space-y-4 shadow-lg backdrop-blur-sm bg-white/30">
            {/* Placeholder ilustrasi 'Proposal' */}
            <div className="w-48 h-32 bg-blue-300 mb-4">
              [Ilustrasi Proposal]
            </div>
            <h2 className="text-2xl font-semibold text-gray-700">
              Proses Pengajuan Mudah dan Terpadu
            </h2>
          </div>
        </div>
        {/* Jika menggunakan komponen Image:
         <Image
           src="/path/ke/ilustrasi-kanan.jpg" // Ganti dengan path gambar Anda di folder public
           alt="Ilustrasi Proses Pengajuan Midiland"
           layout="fill" // Mengisi div container
           objectFit="cover" // Sesuaikan objectFit (cover, contain, etc.)
           className="z-0"
         />
         <div className="relative z-10 text-center bg-white/70 backdrop-blur-sm p-8 rounded-lg shadow-lg">
             {/* Placeholder ilustrasi 'Proposal' di atas teks */}
        {/* <div className="w-48 h-32 bg-blue-300 mb-4 mx-auto">[Ilustrasi Proposal]</div>
             <h2 className="text-2xl font-semibold text-gray-700">Proses Pengajuan Mudah dan Terpadu</h2>
         </div>
         */}
      </div>
    </div>
  );
}
