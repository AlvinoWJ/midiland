"use client";

import Image from "next/image";
// 🛑 PERBAIKAN: Hapus useSearchParams
import { useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
// 🛑 PERBAIKAN: Hapus createClient karena kita tidak akan cek session lagi
// import { createClient } from "@/lib/supabase/client"; 

export default function SignUpSuccessPage() {
  // 🛑 PERBAIKAN: Hapus params
  // const params = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  // 🛑 PERBAIKAN: Sederhanakan useEffect
  useEffect(() => {
    // 1️⃣ Hanya ambil dari localStorage
    const savedEmail = localStorage.getItem("signUpEmail");
    // console.log("Retrieved email from localStorage:", savedEmail);

    if (savedEmail) {
      setEmail(savedEmail);
      // Opsional: Hapus email dari localStorage setelah berhasil dibaca
      // agar tidak muncul lagi jika halaman di-refresh.
      localStorage.removeItem("signUpEmail");
    } else {
      // Jika tidak ada, biarkan state email kosong
      // agar UI menampilkan "(email tidak diketahui)"
      // console.log("Email not found in localStorage.");
    }
    
    // 🛑 PERBAIKAN: Dependency array kosong
    // Ini memastikan useEffect hanya berjalan SEKALI saat komponen mount.
  }, []); 

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 md:p-10 bg-gray-100">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 z-0">
        <Image
          src="/signup.svg"
          alt="City Background"
          fill
          style={{ objectFit: "cover" }}
          quality={80}
          aria-hidden="true"
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="absolute top-8 right-8 md:top-12 md:right-12">
          <Image
            src="/alfamidilogo.svg"
            alt="Alfamidi Logo"
            width={100}
            height={33}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <Mail className="w-12 h-12 text-green-500 mx-auto md:mx-0 mb-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Verifikasi Email Dikirim
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Kami telah mengirimkan email verifikasi ke{" "}
              <span className="font-medium text-gray-900">
                {email || "(email tidak diketahui)"}
              </span>
              .
              <br />
              Silakan periksa kotak masuk kamu dan klik tautan di dalamnya untuk
              mengaktifkan akun.
            </p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-secondary hover:bg-secondary/90 text-white rounded-md mt-4"
            >
              Kembali ke Login
            </Button>
          </div>

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