"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Image from "next/image";
// Import komponen lain yang mungkin Anda buat (misal: Card, Accordion dari shadcn/ui)
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50">
      {" "}
      {/* navbar */}
      <nav className="w-full flex justify-center h-16 bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full max-w-6xl flex justify-between items-center px-4 md:px-6">
          <Link href="/" className="font-bold text-2xl">
            <span className="text-secondary">Midi</span>
            <span className="text-primary">Land</span>
          </Link>

          {/* Tombol Login & Register */}
          <div className="flex items-center gap-3">
            {/* Tombol Login - Outline Red */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className=" border-primary text-primary font-semibold rounded-full px-6"
            >
              <Link href="/auth/login">Login</Link>
            </Button>

            {/* Tombol Register - Solid Black */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-black text-black font-semibold hover:bg-gray-800 rounded-full px-6"
            >
              <Link href="/auth/sign-up">Register</Link>
            </Button>
          </div>
        </div>
      </nav>
      {/* Container Utama untuk Konten Halaman */}
      <div className="flex-1 w-full flex flex-col items-center max-w-6xl mx-auto px-4">
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Peta PNG */}
          <div className="absolute inset-0 z-0 opacity-10">
            <Image
              src="/indonesia.png" // Contoh path
              alt="Peta Indonesia Latar Belakang"
              layout="fill" // Mengisi div parent
              objectFit="cover" // Atau 'contain' jika ingin seluruh peta terlihat
              quality={75} // Sesuaikan kualitas gambar jika perlu
            />
          </div>
          {/* Konten Hero (Teks, Tombol, Ilustrasi Toko) */}
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-8 py-16 md:py-24 ">
            <div className="md:w-1/2 space-y-4 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-midiland-text">
                Punya property strategis?
              </h1>
              <p className="text-lg md:text-xl text-midiland-text/80">
                Jadikan peluang bisnis bersama
                <strong className="text-midiland-primary">Alfamidi!</strong>
              </p>
              <Button
                size="lg"
                variant="outline"
                className="mt-6 border-midiland-primary text-midiland-primary font-semibold rounded-full px-6 hover:bg-midiland-primary hover:text-white" // Sesuaikan kelas
              >
                Ajukan Property Anda Sekarang
              </Button>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
              <Image
                src="/alfamidi.png"
                alt="Alfamidi Ilustration"
                width={450}
                height={423}
                priority
                className="max-w-md w-full h-auto" // Buat responsif
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-12 border-y">
          {/* Item 1: 2000+ Mitra */}
          <div className="space-y-1">
            <div className="text-3xl font-bold text-red-600">2000+</div>
            <div className="text-gray-500 text-sm">Mitra Property</div>
            {/* Tambahkan ikon jika perlu */}
          </div>
          {/* Item 2: 18+ Tahun */}
          <div className="space-y-1">
            <div className="text-3xl font-bold text-red-600">18+</div>
            <div className="text-gray-500 text-sm">Tahun Pengalaman</div>
            {/* Tambahkan ikon jika perlu */}
          </div>
          {/* Item 3: 1000+ Kota */}
          <div className="space-y-1">
            <div className="text-3xl font-bold text-red-600">1000+</div>
            <div className="text-gray-500 text-sm">Kota/Kabupaten</div>
            {/* Tambahkan ikon jika perlu */}
          </div>
          {/* Item 4: 20+ Juta */}
          <div className="space-y-1">
            <div className="text-3xl font-bold text-red-600">20+</div>
            <div className="text-gray-500 text-sm">Juta Pelanggan</div>
            {/* Tambahkan ikon jika perlu */}
          </div>
        </section>

        {/* Apa itu Midiland? Section */}
        <section className="w-full flex flex-col md:flex-row items-center gap-12 py-16 md:py-24">
          <div className="md:w-1/2 flex justify-center">
            {/* Placeholder untuk Ilustrasi Peta */}
            {/* Ganti dengan komponen Image */}
            <div className="w-full max-w-md h-64 bg-gray-200 rounded flex items-center justify-center">
              [Ilustrasi Peta]
            </div>
          </div>
          <div className="md:w-1/2 space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Apa itu <span className="text-red-600">Midiland?</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              MidilLand merupakan platform yang dirancang untuk menjembatani
              antara pemilik properti potensial dengan Alfamidi, membuka peluang
              kerjasama yang menguntungkan... (Lanjutkan teks dari desain)
            </p>
          </div>
        </section>

        {/* Keuntungan Section */}
        <section className="w-full py-16 md:py-24 bg-white rounded-lg shadow-md -mx-4 px-4 md:-mx-6 md:px-6">
          {" "}
          {/* Contoh background berbeda */}
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-12">
            Keuntungan bersama <span className="text-red-600">MidiLand</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Kemitraan Terpercaya */}
            <div className="text-center p-6 border rounded-lg space-y-3">
              {/* Icon */}
              <div className="text-red-600">[Icon Kemitraan]</div>
              <h3 className="font-semibold text-lg">Kemitraan Terpercaya</h3>
              <p className="text-sm text-gray-500">
                Alfamidi dikenal luas sebagai brand retail terkemuka dengan
                reputasi... (Lanjutkan teks)
              </p>
            </div>
            {/* Card 2: Peluang Menguntungkan */}
            <div className="text-center p-6 border rounded-lg space-y-3">
              {/* Icon */}
              <div className="text-red-600">[Icon Peluang]</div>
              <h3 className="font-semibold text-lg">Peluang Menguntungkan</h3>
              <p className="text-sm text-gray-500">
                Dengan menyewakan properti Anda kepada Alfamidi, Anda
                mendapatkan... (Lanjutkan teks)
              </p>
            </div>
            {/* Card 3: Proses Mudah */}
            <div className="text-center p-6 border rounded-lg space-y-3">
              {/* Icon */}
              <div className="text-red-600">[Icon Proses]</div>
              <h3 className="font-semibold text-lg">Proses Mudah dan Cepat</h3>
              <p className="text-sm text-gray-500">
                Kami menyederhanakan proses pengajuan dan evaluasi properti...
                (Lanjutkan teks)
              </p>
            </div>
          </div>
        </section>

        {/* Bagaimana Prosesnya? Section */}
        <section className="w-full py-16 md:py-24 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            Bagaimana Prosesnya?
          </h2>
          <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
            Proses kami dibuat sederhana dan transparan. Berikut
            langkah-langkahnya...
          </p>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="text-red-600">[Icon Daftar]</div>
              <h4 className="font-semibold">Daftar & Login</h4>
              <p className="text-xs text-gray-500">Buat akun atau masuk...</p>
            </div>
            {/* Arrow (placeholder) */}
            <div className="hidden md:block text-gray-300 text-2xl px-4">
              &rarr;
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="text-red-600">[Icon Ajukan]</div>
              <h4 className="font-semibold">Ajukan Property</h4>
              <p className="text-xs text-gray-500">Isi detail properti...</p>
            </div>
            {/* Arrow (placeholder) */}
            <div className="hidden md:block text-gray-300 text-2xl px-4">
              &rarr;
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="text-red-600">[Icon Survey]</div>
              <h4 className="font-semibold">Survey & MOU</h4>
              <p className="text-xs text-gray-500">Tim kami akan survey...</p>
            </div>
            {/* Arrow (placeholder) */}
            <div className="hidden md:block text-gray-300 text-2xl px-4">
              &rarr;
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="text-red-600">[Icon Kemitraan]</div>
              <h4 className="font-semibold">Kemitraan</h4>
              <p className="text-xs text-gray-500">Selamat! Properti Anda...</p>
            </div>
          </div>
        </section>

        {/* FAQ & Bantuan Section */}
        <section className="w-full grid md:grid-cols-2 gap-16 py-16 md:py-24 border-t">
          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">FAQ</h2>
            {/* Placeholder untuk Accordion */}
            {/* Gunakan komponen Accordion dari shadcn/ui */}
            <div className="space-y-2">
              <div className="p-4 border rounded">FAQ Item 1</div>
              <div className="p-4 border rounded">FAQ Item 2</div>
              <div className="p-4 border rounded">FAQ Item 3</div>
            </div>
          </div>

          {/* Bantuan */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Butuh Bantuan? Tanya Admin Yuk...
            </h2>
            <p className="text-gray-500">
              Tim kami siap membantu menjawab pertanyaan Anda.
            </p>
            <div className="space-y-3 pt-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                {" "}
                {/* Sesuaikan style */}
                <span>[Icon Email]</span> Email Admin Kami
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                {" "}
                {/* Sesuaikan style */}
                <span>[Icon WhatsApp]</span> WhatsApp Admin Kami
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                {" "}
                {/* Sesuaikan style */}
                <span>[Icon Call]</span> Call Center
              </Button>
            </div>
          </div>
        </section>

        {/* Siap Memulai Kerjasama? Section */}
        <section className="w-full text-center py-16 md:py-24 bg-white rounded-lg shadow-md -mx-4 px-4 md:-mx-6 md:px-6 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Siap Memulai Kerjasama?
          </h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Jangan lewatkan kesempatan emas ini untuk menjadikan properti Anda
            sebagai bagian dari jaringan Alfamidi.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            {" "}
            {/* Sesuaikan warna */}
            Ajukan Usulan Property
          </Button>
        </section>
      </div>
      {/* Footer Section */}
      <footer className="w-full bg-gray-800 text-gray-300 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          {/* Footer Col 1: Logo, Copyright, Social */}
          <div className="space-y-4">
            {/* Logo Alfamidi (Putih) */}
            <div className="text-white font-bold">[Logo Alfamidi Putih]</div>
            <p className="text-xs">
              &copy; {new Date().getFullYear()} PT Midi Utama Indonesia Tbk...
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">[Social Icons]</div>
          </div>

          {/* Footer Col 2: Kontak */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white mb-3">Kontak</h5>
            <p>Alfamidi Tower...</p>
            <p>Jl. MH Thamrin...</p>
            <p>Email: example@example.com</p>
            <p>Telp: (021) 123456</p>
          </div>

          {/* Footer Col 3: Jam Operasional */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white mb-3">Jam Operasional</h5>
            <p>Senin - Jumat: 08:00 - 17:00</p>
            <p>Sabtu, Minggu, Libur Nasional: Tutup</p>
            <ThemeSwitcher /> {/* Pindahkan ke sini jika sesuai */}
          </div>

          {/* Footer Col 4: Alfamidi Links */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white mb-3">Alfamidi</h5>
            <ul className="space-y-1">
              <li>
                <a href="#" className="hover:text-white">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
