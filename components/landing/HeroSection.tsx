"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50">
      <div className="absolute inset-0 z-0 opacity-10">
        <img
          alt="Peta Indonesia Latar Belakang"
          src="/indonesia.png"
          className="object-cover w-full h-full absolute inset-0"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8 pt-16 pb-16 md:pt-20">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Punya property strategis?
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Jadikan peluang bisnis bersama{" "}
            <strong className="text-primary">Midi</strong>
            <strong className="text-secondary">Land</strong>
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white font-semibold text-base px-6 py-6"
          >
            <a href="/dashboard">
              Ajukan Property Anda Sekarang
              <ArrowRight size={20} className="ml-2" />
            </a>
          </Button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-xl lg:max-w-2xl">
            <img
              src="/alfamidi.svg"
              alt="Alfamidi Ilustration"
              width={500}
              height={560}
              className="w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}