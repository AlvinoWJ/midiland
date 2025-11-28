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

const carouselSlides = [
  {
    image: "/2.svg",
    alt: "Ilustrasi Kemitraan",
    title: "Kemitraan Terpercaya",
    description: "Bergabunglah dengan ribuan mitra terpercaya kami.",
  },
  {
    image: "/3.svg",
    alt: "Ilustrasi Peluang",
    title: "Peluang Menguntungkan",
    description: "Raih peluang bisnis yang menguntungkan bersama kami.",
  },
  {
    image: "/4.svg",
    alt: "Ilustrasi Proses",
    title: "Proses Mudah dan Cepat",
    description: "Proses pendaftaran yang sederhana dan cepat.",
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

      const { data, error } = await supabase.auth.getSession();
      if (error) return;

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
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <div className="relative flex w-full lg:w-1/2 flex-col items-center md:justify-center px-6 md:px-6 lg:px-10 bg-white overflow-y-auto">
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
            <h1 className="text-lg lg:text-4xl font-bold text-gray-900">
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

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/login.svg"
            alt="City Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 backdrop-blur-2xl bg-white/30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30"></div>
        </div>

        <div className="relative z-10 w-full h-full flex items-center justify-center p-14">
          <div className="w-full h-full rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-xl bg-white/40 border border-white/60 relative flex flex-col">
            <div className="absolute top-6 right-6 z-50">
              <div className="border border-white/50 rounded-xl p-2 bg-white/80 shadow-sm backdrop-blur-sm">
                <Image
                  src="/alfamidilogo.svg"
                  alt="Alfamidi Logo"
                  width={120}
                  height={35}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`w-full flex-shrink-0 h-full flex flex-col items-center px-4 lg:px-8 transition-opacity duration-500 ${
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center z-20 mb-4 mt-10 lg:mt-24 flex-none">
                    <h2
                      className={`text-2xl lg:text-3xl xl:text-4xl font-extrabold text-gray-800 tracking-tight relative transition-all duration-700 ${
                        currentSlide === index
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-8 opacity-0"
                      }`}
                    >
                      {slide.title}
                    </h2>

                    <p
                      className={`text-base lg:text-lg xl:text-xl text-gray-700 font-medium max-w-xl lg:max-w-2xl leading-relaxed mt-2 transition-all duration-700 delay-100 ${
                        currentSlide === index
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      {slide.description}
                    </p>
                  </div>

                  <div
                    className={`relative w-full flex-1 z-10 transition-all duration-700 ease-out 
                    transform scale-110 lg:scale-110 xl:scale-[1.45] origin-bottom pb-10
                    ${
                      currentSlide === index
                        ? "opacity-100 rotate-0"
                        : "opacity-0 rotate-6"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[70px] animate-pulse opacity-50"></div>
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      className="object-contain object-bottom drop-shadow-2xl"
                      priority={index === 0}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/40 z-30">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-500 rounded-full ${
                    currentSlide === index
                      ? "w-8 h-2.5 bg-gradient-to-r from-primary to-secondary shadow-md"
                      : "w-2.5 h-2.5 bg-gray-400/70 hover:bg-gray-600 hover:scale-110"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}