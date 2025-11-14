"use client";

import { Handshake, TrendingUp, Zap } from "lucide-react";

export default function BenefitsSection() {
  return (
    <section className="w-full py-16 md:py-20">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Keuntungan bersama <span className="text-primary">Midi</span>
        <span className="text-secondary">Land</span>
      </h2>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Bergabung dengan MidiLand memberikan berbagai keuntungan bagi pemilik
        properti
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <Handshake className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900">
            Kemitraan Terpercaya
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Alfamidi dikenal luas sebagai brand retail terkemuka dengan reputasi
            solid dan jaringan yang luas di seluruh Indonesia. Bermitra dengan
            kami memberikan jaminan bisnis yang stabil dan terpercaya.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900">
            Peluang Menguntungkan
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Dengan menyewakan properti Anda kepada Alfamidi, Anda mendapatkan
            passive income yang stabil dengan kontrak jangka panjang dan rate
            yang kompetitif di pasar.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <Zap className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900">
            Proses Mudah dan Cepat
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Kami menyederhanakan proses pengajuan dan evaluasi properti melalui
            platform digital yang user-friendly. Tidak perlu proses
            berbelit-belit, cukup dalam beberapa langkah mudah.
          </p>
        </div>
      </div>
    </section>
  );
}