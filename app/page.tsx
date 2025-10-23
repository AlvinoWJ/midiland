"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Handshake,
  TrendingUp,
  Zap,
  UserPlus,
  FileText,
  ClipboardCheck,
  HomeIcon,
  Mail,
  MessageCircle,
  Phone,
  ChevronDown,
  StoreIcon,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* Navbar */}
      <nav className="w-full flex justify-center h-16 bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full max-w-6xl flex justify-between items-center px-4 md:px-6">
          <Link href="/" className="font-bold text-2xl">
            <span className="text-primary">Midi</span>
            <span className="text-secondary">Land</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="default"
              className="border-primary text-primary font-semibold rounded-full px-6"
            >
              <Link href="/auth/login">Login</Link>
            </Button>

            <Button
              asChild
              variant="default"
              size="default"
              className="font-semibold rounded-full px-6"
            >
              <Link href="/auth/sign-up">Register</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            alt="Peta Indonesia Latar Belakang"
            src="/indonesia.png"
            fill
            className="object-cover"
            quality={75}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
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
              size="lg"
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 rounded-lg text-base"
            >
              Ajukan Property Anda Sekarang
            </Button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-xl lg:max-w-2xl">
              <Image
                src="/alfamidi.svg"
                alt="Alfamidi Ilustration"
                width={500}
                height={560}
                priority
                className="w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 relative z-20 -mt-12 md:-mt-15 mb-16">
        <div className="bg-white rounded-2xl shadow-[1px_1px_6px_rgba(0,0,0,0.25)] p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          <div className="space-y-1 md:space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              2000+
            </div>
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              Mitra Property
            </div>
          </div>
          <div className="space-y-1 md:space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              18+
            </div>
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              Tahun Pengalaman
            </div>
          </div>
          <div className="space-y-1 md:space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              1000+
            </div>
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              Kota/Kabupaten
            </div>
          </div>
          <div className="space-y-1 md:space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-primary">
              20+
            </div>
            <div className="text-gray-600 text-xs md:text-sm font-medium">
              Juta Pelanggan
            </div>
          </div>
        </div>
      </div>

      {/* Container Utama */}
      <div className="flex-1 w-full flex flex-col items-center max-w-6xl mx-auto px-4 md:px-6">
        <section className="w-full flex flex-col md:flex-row items-center gap-12 py-16 md:py-20">
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-50 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8 flex items-center justify-center">
                <Image
                  src="/location.svg"
                  alt="Location"
                  width={350}
                  height={350}
                  className=""
                />
              </div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Apa itu <span className="text-red-600">MidiLand?</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              MidiLand merupakan platform yang dirancang untuk menjembatani
              antara pemilik properti potensial dengan Alfamidi, membuka peluang
              kerjasama yang menguntungkan.
            </p>
            <p className="text-gray-600 leading-relaxed text-base">
              Kami hadir untuk memudahkan Anda yang memiliki properti strategis
              untuk bermitra dengan salah satu jaringan ritel terbesar di
              Indonesia. Dengan platform ini, proses pengajuan properti menjadi
              lebih mudah, cepat, dan transparan.
            </p>
          </div>
        </section>

        {/* Keuntungan Section */}
        <section className="w-full py-16 md:py-20">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Keuntungan bersama <span className="text-primary">Midi</span>
            <span className="text-secondary">Land</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Bergabung dengan MidiLand memberikan berbagai keuntungan bagi
            pemilik properti
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                <Handshake className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-900">
                Kemitraan Terpercaya
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Alfamidi dikenal luas sebagai brand retail terkemuka dengan
                reputasi solid dan jaringan yang luas di seluruh Indonesia.
                Bermitra dengan kami memberikan jaminan bisnis yang stabil dan
                terpercaya.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-900">
                Peluang Menguntungkan
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dengan menyewakan properti Anda kepada Alfamidi, Anda
                mendapatkan passive income yang stabil dengan kontrak jangka
                panjang dan rate yang kompetitif di pasar.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
                <Zap className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-900">
                Proses Mudah dan Cepat
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Kami menyederhanakan proses pengajuan dan evaluasi properti
                melalui platform digital yang user-friendly. Tidak perlu proses
                berbelit-belit, cukup dalam beberapa langkah mudah.
              </p>
            </div>
          </div>
        </section>

        {/* Bagaimana Prosesnya? Section */}
        <section className="w-full py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bagaimana Prosesnya?
          </h2>
          <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
            Proses kami dibuat sederhana dan transparan. Berikut
            langkah-langkahnya untuk memulai kemitraan dengan Alfamidi
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            {/* Connecting Lines - Desktop Only */}
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-red-200"></div>

            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-4 relative">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-gray-900">
                  Daftar & Login
                </h4>
                <p className="text-sm text-gray-600 px-4">
                  Buat akun atau masuk ke platform MidiLand untuk memulai
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-4 relative">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                <HomeIcon className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-gray-900">
                  Ajukan Property
                </h4>
                <p className="text-sm text-gray-600 px-4">
                  Isi detail properti Anda dengan lengkap dan akurat
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-4 relative">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                <ClipboardCheck className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-gray-900">
                  Survey & MOU
                </h4>
                <p className="text-sm text-gray-600 px-4">
                  Tim kami akan survey lokasi dan menyiapkan MOU
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center space-y-4 relative">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg relative z-10">
                <Handshake className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-lg text-gray-900">Kemitraan</h4>
                <p className="text-sm text-gray-600 px-4">
                  Selamat! Properti Anda resmi bermitra dengan Alfamidi
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ & Bantuan Section */}
        <section className="w-full grid md:grid-cols-2 gap-12 py-16 md:py-20 border-t border-gray-200">
          {/* FAQ */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
            <p className="text-gray-600 text-sm">
              Pertanyaan yang sering ditanyakan seputar MidiLand
            </p>

            <div className="space-y-4">
              <details className="group bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900">
                    Apa persyaratan properti yang dapat diajukan?
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-5 pt-0 text-sm text-gray-600 border-t border-gray-100">
                  Properti harus berada di lokasi strategis dengan akses mudah,
                  luas minimal 150m², dan memiliki dokumen legal yang lengkap.
                </div>
              </details>

              <details className="group bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900">
                    Berapa lama proses evaluasi properti?
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-5 pt-0 text-sm text-gray-600 border-t border-gray-100">
                  Proses evaluasi umumnya memakan waktu 2-4 minggu, tergantung
                  pada kelengkapan dokumen dan hasil survey lapangan.
                </div>
              </details>

              <details className="group bg-white rounded-lg shadow-md overflow-hidden">
                <summary className="flex justify-between items-center p-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900">
                    Apakah ada biaya untuk mengajukan properti?
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="p-5 pt-0 text-sm text-gray-600 border-t border-gray-100">
                  Tidak ada biaya apapun untuk mengajukan properti melalui
                  platform MidiLand. Semua proses gratis.
                </div>
              </details>
            </div>
          </div>

          {/* Bantuan */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Butuh Bantuan?
              <br />
              <span className="text-red-600">Tanya Admin Yuk...</span>
            </h2>
            <p className="text-gray-600 text-sm">
              Tim kami siap membantu menjawab pertanyaan Anda melalui berbagai
              channel
            </p>

            <div className="space-y-4 pt-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-14 text-left border-2 hover:border-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    Email Admin Kami
                  </div>
                  <div className="text-xs text-gray-500">
                    info@midiland.co.id
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-14 text-left border-2 hover:border-green-600 hover:bg-green-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    WhatsApp Admin Kami
                  </div>
                  <div className="text-xs text-gray-500">+62 812-3456-7890</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-14 text-left border-2 hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Call Center</div>
                  <div className="text-xs text-gray-500">(021) 500-123</div>
                </div>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm mb-8">
            {/* Col 1 */}
            <div className="space-y-4">
              <Link href="/" className="font-bold text-2xl inline-block">
                <span className="text-primary">Midi</span>
                <span className="text-white">Land</span>
              </Link>
              <p className="text-xs text-gray-400 leading-relaxed">
                Platform terpercaya untuk kemitraan properti dengan Alfamidi
              </p>
              <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} PT Midi Utama Indonesia Tbk.
                All rights reserved.
              </p>
              <div className="flex gap-3 pt-2">
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <span className="text-xs">FB</span>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <span className="text-xs">IG</span>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <span className="text-xs">TW</span>
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-3">
              <h5 className="font-bold text-white mb-4 text-base">Kontak</h5>
              <p className="text-sm">Alfamidi Tower</p>
              <p className="text-sm">Jl. MH Thamrin No. 9</p>
              <p className="text-sm">Jakarta Pusat, 10340</p>
              <p className="text-sm">Email: info@alfamidi.co.id</p>
              <p className="text-sm">Telp: (021) 3199-5000</p>
            </div>

            {/* Col 3 */}
            <div className="space-y-3">
              <h5 className="font-bold text-white mb-4 text-base">
                Jam Operasional
              </h5>
              <p className="text-sm">Senin - Jumat</p>
              <p className="text-sm font-semibold text-red-500">
                08:00 - 17:00 WIB
              </p>
              <p className="text-sm mt-3">Sabtu, Minggu & Libur Nasional</p>
              <p className="text-sm font-semibold text-gray-500">Tutup</p>
            </div>

            {/* Col 4 */}
            <div className="space-y-3">
              <h5 className="font-bold text-white mb-4 text-base">Alfamidi</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors text-sm"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors text-sm"
                  >
                    Karir
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors text-sm"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors text-sm"
                  >
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors text-sm"
                  >
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-xs text-gray-500">
              MidiLand adalah platform resmi PT Midi Utama Indonesia Tbk untuk
              kemitraan properti
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
