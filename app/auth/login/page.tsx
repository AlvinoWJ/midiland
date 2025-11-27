"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";

const carouselSlides = [
  {
    image: "/2.png",
    alt: "Kemitraan Terpercaya",
    title: "Kemitraan Terpercaya",
    subtitle: "Bergabunglah dengan ribuan mitra sukses Alfamidi",
  },
  {
    image: "/3.png",
    alt: "Peluang Menguntungkan",
    title: "Peluang Menguntungkan",
    subtitle: "Raih kesuksesan bersama brand terpercaya",
  },
  {
    image: "/4.png",
    alt: "Proses Mudah dan Cepat",
    title: "Proses Mudah dan Cepat",
    subtitle: "Daftar sekarang dan mulai bisnis Anda",
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const supabase = useRef(createClient()).current;
  const isRedirecting = useRef(false);
  const [showPassword, setShowPassword] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselSlides.length - 1 ? 0 : prev + 1
    );
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselSlides.length - 1 : prev - 1
    );
    setProgress(0);
  };

  useEffect(() => {
    if (isHovered) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, [currentSlide, isHovered]);

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
    } = supabase.auth.onAuthStateChange((event) => {
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

      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        <div className="absolute top-6 right-6 z-30 transition-transform duration-300 hover:scale-105">
          <div className="border-2 border-white rounded-xl p-2 bg-white/95 shadow-lg backdrop-blur-sm">
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
                <div className={`w-full h-full transition-transform duration-700 ${
                  currentSlide === index ? 'scale-105' : 'scale-100'
                }`}>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40 z-10" />

                <div className={`absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center pt-32 px-12 z-20 transition-opacity duration-700 ${
                  currentSlide === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <h2 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-2xl leading-tight mb-4 animate-fade-in-up">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white/90 text-center drop-shadow-lg max-w-md animate-fade-in-up animation-delay-200">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`absolute inset-y-0 left-4 flex items-center z-20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
        
        <div className={`absolute inset-y-0 right-4 flex items-center z-20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setProgress(0);
                }}
                className="group relative"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-secondary scale-125 shadow-lg shadow-secondary/50"
                    : "bg-white/60 hover:bg-white/90 hover:scale-110"
                }`} />
                
                {currentSlide === index && (
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute top-1/4 left-12 w-20 h-20 bg-secondary/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}