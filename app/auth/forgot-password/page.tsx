import { ForgotPasswordForm } from "@/components/forgot-password-form";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative flex min-h-screen items-center justify-center p-4 py-8 lg:bg-white lg:p-8">
        {/* Latar belakang untuk mobile (menggunakan login.svg dari public) */}
        <div className="absolute inset-0 -z-10 lg:hidden">
          <Image
            src="/login.svg" 
            alt="Background"
            fill
            priority
            className="object-cover"
          />
        </div>
        
        {/* Memanggil komponen Form */}
        <ForgotPasswordForm />
      </div>

      {/* Gambar sisi untuk desktop (menggunakan login.svg dari public) */}
      <div className="relative hidden h-screen w-full lg:block">
        <Image
          src="/login.svg"
          alt="MidiLand Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}