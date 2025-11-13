"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NotFound() {
  const [buttonLink, setButtonLink] = useState("/");
  const [buttonText, setButtonText] = useState("Kembali ke Homepage");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setButtonLink("/dashboard");
        setButtonText("Kembali ke Dashboard");
      } else {
        setButtonLink("/");
        setButtonText("Kembali ke Homepage");
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-100/30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-100/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="space-y-8 text-center">
          <div className="flex justify-center opacity-0 animate-fade-in-down">
            <Image
              src="/MidiLand.png"
              alt="MidiLand Logo"
              width={220}
              height={60}
              className="object-contain"
              priority
            />
          </div>

          <div className="relative opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full bg-red-500/10 blur-2xl"></div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="text-[140px] sm:text-[160px] font-black text-gray-200 select-none leading-none">
                404
              </div>
              <div className="absolute">
                <svg
                  className="h-20 w-20 sm:h-24 sm:w-24 text-red-500 animate-float"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-base text-gray-600 max-w-md mx-auto leading-relaxed">
              Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin
              salah ketik atau halaman tersebut telah dipindahkan.
            </p>
          </div>

          <div className="flex justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            {isLoading ? (
              <Button
                className="bg-secondary/80 text-white rounded-lg px-8 py-6 text-base font-medium shadow-lg"
                disabled
              >
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memuat...
              </Button>
            ) : (
              <Button
                asChild
                className="relative overflow-hidden bg-secondary text-white rounded-xl px-8 py-6 text-base font-medium shadow-md transition-all duration-200 hover:shadow-xl hover:brightness-110 active:scale-[0.98] group"
              >
                <Link href={buttonLink} className="flex items-center gap-2 relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {buttonText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}