"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ForgotPasswordForm from "@/components/forgot-password-form";

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

export default function ForgotPasswordPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="relative flex w-full lg:w-1/2 flex-col items-center justify-center px-6 md:px-6 lg:px-10 bg-white overflow-y-auto">
        <div className="w-full max-w-lg space-y-4"> 
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
              Reset Password Anda
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

          <ForgotPasswordForm />

          <div className="text-center text-xs text-gray-700 pt-1">
            Sudah ingat password?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:underline "
            >
              Masuk disini.
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6 lg:p-8 relative overflow-hidden">
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