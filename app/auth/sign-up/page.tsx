// app/auth/sign-up/page.tsx (Tanpa Email Confirmation)
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  // === State untuk Form ===
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // === State dan Ref untuk Google OAuth ===
  const supabase = useRef(createClient()).current;
  const isRedirecting = useRef(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // === Logika Email/Password Sign Up (AUTO-LOGIN) ===
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (password !== repeatPassword) {
      setError("Konfirmasi kata sandi tidak cocok");
      setIsLoading(false);
      return;
    }
    
    try {
      // console.log("Attempting sign up with:", { email, name });
      
      // 1. Sign up user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });
      
      if (signUpError) {
        // console.error("Supabase signUp error:", signUpError);
        throw signUpError;
      }

      // console.log("SignUp success, attempting auto-login...");

      // 2. Auto-login setelah sign up
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        // console.error("Auto-login error:", signInError);
        // Jika auto-login gagal (misal email confirmation masih ON di Supabase),
        // redirect ke halaman login dengan pesan
        setError("Akun berhasil dibuat. Silakan login.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
        return;
      }

      // console.log("Auto-login success, redirecting to dashboard...");
      
      // 3. Redirect ke dashboard
      router.push("/dashboard");
      router.refresh();
      
    } catch (error: unknown) {
      // console.error("SignUp catch error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mendaftar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // === Logika Google OAuth ===
  useEffect(() => {
    const safeRedirect = () => {
      if (isRedirecting.current) return;
      isRedirecting.current = true;
      router.push("/dashboard");
      router.refresh();
    };
    
    const handleMessage = async (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.data !== "auth_success"
      ) {
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        safeRedirect();
      }
    };
    
    window.addEventListener("message", handleMessage);
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        safeRedirect();
      }
    });

    return () => {
      window.removeEventListener("message", handleMessage);
      subscription.unsubscribe();
    };
  }, [supabase, router]);
  
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setGoogleError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account" },
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data.url) {
        const width = 600, height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          data.url,
          "googleLogin",
          `width=${width},height=${height},top=${top},left=${left}`
        );
      }
    } catch (error: unknown) {
      setGoogleError(
        error instanceof Error ? error.message : "Terjadi kesalahan"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  // === JSX (Render) ===
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 md:p-10 bg-gray-100">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-1/2 z-0">
        <Image
          src="/signup.svg"
          alt="City Background"
          layout="fill"
          objectFit="cover"
          quality={80}
          aria-hidden="true"
        />
      </div>
      
      {/* Card Form */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        {/* Logo Alfamidi */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12">
          <Image
            src="/alfamidilogo.svg"
            alt="Alfamidi Logo"
            width={100}
            height={33}
          />
        </div>
        
        {/* Grid Konten Card */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Kolom Kiri: Form */}
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
                  disabled={isLoading || googleLoading}
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
                  disabled={isLoading || googleLoading}
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
                  disabled={isLoading || googleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
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
                  disabled={isLoading || googleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600"
                  aria-label="Toggle repeat password visibility"
                >
                  {showRepeatPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>

              {/* Error/Success Message */}
              {error && (
                <p className={`text-xs text-center pt-2 ${
                  error.includes("berhasil") ? "text-green-600" : "text-red-500"
                }`}>
                  {error}
                </p>
              )}

              {/* Tombol Daftar */}
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-md transition-all duration-200"
                disabled={isLoading || googleLoading}
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

            {/* Error Message Google */}
            {googleError && (
              <p className="text-xs text-red-500 text-center pt-2">{googleError}</p>
            )}

            {/* Tombol Google */}
            <Button
              variant="outline"
              type="button"
              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400 rounded-md text-gray-700 transition-all duration-200"
              onClick={handleGoogleSignUp}
              disabled={isLoading || googleLoading}
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={18}
                height={18}
              />
              <span className="hidden sm:inline">
                {googleLoading ? "Memproses..." : "Daftar dengan Google"}
              </span>
              <span className="sm:hidden">
                {googleLoading ? "..." : "Google"}
              </span>
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

          {/* Kolom Kanan: Ilustrasi */}
          <div className="hidden md:flex justify-center items-center">
            <Image
              src="/alfamidi.svg"
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