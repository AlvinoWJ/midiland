"use client";

import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="w-full text-center py-16 md:py-20 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl shadow-2xl -mx-4 px-8 md:-mx-6 mb-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Siap Memulai Kerjasama?
        </h2>
        <p className="text-red-100 mb-8 max-w-2xl mx-auto text-lg">
          Jangan lewatkan kesempatan emas ini untuk menjadikan properti Anda
          sebagai bagian dari jaringan Alfamidi yang tersebar di seluruh
          Indonesia
        </p>
        <Button
          size="lg"
          className="bg-white text-red-600 hover:bg-gray-100 font-bold px-10 py-6 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
        >
          Ajukan Usulan Property
        </Button>
      </div>
    </section>
  );
}