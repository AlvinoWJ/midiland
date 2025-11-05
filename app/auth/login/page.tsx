// app/auth/login/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const carouselSlides = [
  {
    image: "/carousel1.svg",
    alt: "Ilustrasi Proses Pengajuan",
    title: "Proses Pengajuan Mudah dan Terpadu",
  },
  {
    image: "/carousel2.svg",
    alt: "Ilustrasi Profesional",
    title: "Survei dan Verifikasi Profesional",
  },
  {
    image: "/carousel3.svg",
    alt: "Ilustrasi Kerja Sama",
    title: "Kerja Sama Aman dan Transparan",
  },
  {
    image: "/carousel4.svg",
    alt: "Ilustrasi Perkembangan",
    title: "Nilai Aset Semakin Berkembang",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const supabase = useRef(createClient()).current;
  const isRedirecting = useRef(false);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselSlides.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    const safeRedirect = () => {
      if (isRedirecting.current) return;
      isRedirecting.current = true;

      console.log("Sesi terdeteksi. Me-redirect ke /dashboard...");
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

      console.log(
        "Pesan 'auth_success' diterima. Memeriksa sesi secara manual..."
      );

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Gagal getSession:", error.message);
        return;
      }

      if (data.session) {
        console.log("Sesi terdeteksi dari getSession() manual.");
        safeRedirect();
      } else {
        console.log(
          "getSession() tidak menemukan sesi. Menunggu onAuthStateChange..."
        );
      }
    };

    window.addEventListener("message", handleMessage);

    const {
      data: { subscription },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_IN") {
        console.log("Event SIGNED_IN terdeteksi dari onAuthStateChange.");
        safeRedirect();
      }
    });

    return () => {
      window.removeEventListener("message", handleMessage);
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Redirect seperti biasa untuk login password
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // redirectTo: `https://midiland.vercel.app/auth/callback`,
          queryParams: {
            prompt: "select_account",
          },
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data.url) {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        window.open(
          data.url,
          "googleLogin",
          `width=${width},height=${height},top=${top},left=${left}`
        );
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Terjadi kesalahan saat login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ... (SISA KODE JSX TIDAK SAYA UBAH) ...
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Kolom Kiri: Form Login */}
      <div className="relative flex w-full md:w-1/2 flex-col justify-center items-center px-6 md:px-6 lg:px-10 bg-white overflow-y-auto">
        <div className="w-full max-w-lg space-y-4">
          <div className="flex justify-center text-left mb-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Masuk ke <span className="text-secondary">Midi</span>
              <span className="text-primary">Land</span>
            </h1>
          </div>
          {/* Gambar tambahan di atas teks “Masuk ke MidiLand” */}
          <div className="flex justify-center mb-3">
            <Image
              src="/alfamidi.svg" // ganti nama file kamu jadi ini di folder public
              alt="Header Gambar"
              width={350}
              height={250}
              className="object-contain"
              priority
            />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-gray-900 font-medium text-sm"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-gray-900 font-medium text-sm"
                >
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm"
              />
            </div>

            {error && (
              <p className="text-xs text-primary bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          {/* Separator */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-500 font-medium">
                Atau
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full h-10 flex items-center justify-center gap-2 border-gray-300 hover:border-none rounded-lg font-medium text-sm"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image src="/google.svg" alt="Google" width={16} height={16} />
            {isLoading ? "Mengarahkan..." : "Masuk dengan Google"}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center text-xs text-gray-700 pt-1">
            Belum punya akun?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold text-primary hover:underline "
            >
              Buat akun disini.
            </Link>
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Carousel */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/login.svg"
            alt="City Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
        </div>
        {/* Logo Alfamidi di pojok kanan atas */}
        <div className="absolute top-6 right-6">
          <div className="border-2 border-white rounded-xl p-2 bg-white shadow-md">
            <Image
              src="/alfamidilogo.svg"
              alt="Alfamidi Logo"
              width={150}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md lg:max-w-lg aspect-[4/3] rounded-2xl shadow-xl overflow-hidden backdrop-blur-md bg-white/40">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 h-full flex flex-col items-center justify-center text-center p-8 space-y-4"
              >
                <div className="relative w-48 h-48 lg:w-64 lg:h-64 mb-4">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                  {slide.title}
                </h2>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index
                    ? "bg-secondary"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
