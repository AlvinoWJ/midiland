"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

// DATA CAROUSEL
const carouselSlides = [
  {
    image: "/2.png",
    alt: "Kemitraan Terpercaya",
    title: "Kemitraan Terpercaya",
  },
  {
    image: "/3.png",
    alt: "Peluang Menguntungkan",
    title: "Peluang Menguntungkan",
  },
  {
    image: "/4.png",
    alt: "Proses Mudah dan Cepat",
    title: "Proses Mudah dan Cepat",
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
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* --- LEFT SIDE (FORM) --- */}
      <div className="relative flex w-full lg:w-1/2 flex-col items-center md:justify-center px-6 md:px-6 lg:px-10 bg-white overflow-y-auto z-10">
        <div className="w-full max-w-lg space-y-4 pt-8 md:pt-0">
          <div className="flex justify-center mb-3 lg:hidden">
            <Image
              src="/alfamidilogo.svg"
              alt="Alfamidi Logo"
              width={100}
              height={40}
              className="object-contain md:w-[150px]"
              priority
            />
          </div>

          <div className="flex justify-center text-center lg:text-left mb-3">
            <h1 className="text-xl font-bold text-gray-900">
              Masuk ke <span className="text-secondary">Midi</span>
              <span className="text-primary">Land</span>
            </h1>
          </div>

          <div className="flex justify-center mb-3">
            <Image
              src="/alfamidi.svg"
              alt="Header Gambar"
              width={350}
              height={250}
              className="object-contain"
              priority
            />
          </div>

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
                placeholder="Masukkan alamat email Anda"
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi Anda"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-500 hover:text-gray-700"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
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

          <Button
            variant="outline"
            className="w-full h-10 flex items-center justify-center gap-2 border-gray-300 hover:border-none rounded-lg font-medium text-sm"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image src="/google.svg" alt="Google" width={16} height={16} />
            {isLoading ? "Mengarahkan..." : "Masuk dengan Google"}
          </Button>

          <div className="text-center text-xs text-gray-700 pt-1 pb-8 md:pb-0">
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

      {/* --- RIGHT SIDE (CAROUSEL FULL SCREEN) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-100">
        
        {/* LOGO (Dipertahankan) */}
        <div className="absolute top-6 right-6 z-30">
          <div className="border-2 border-white rounded-xl p-2 bg-white/90 shadow-md backdrop-blur-sm">
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

        {/* CAROUSEL CONTAINER (Full size) */}
        <div className="absolute inset-0 z-0">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className="w-full h-full flex-shrink-0 relative"
              >
                {/* Gambar Full Size */}
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                
                {/* Overlay Hitam Gradasi DARI ATAS KE BAWAH agar teks atas terbaca */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-transparent z-10" />

                {/* Teks Content (Posisi ATAS) */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center pt-24 md:pt-32 px-12 z-20">
                  <h2 className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-xl leading-tight">
                    {slide.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indikator Slide (Dots) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-secondary w-8"
                  : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}