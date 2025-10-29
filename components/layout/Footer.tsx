// File: components/layout/MainFooter.tsx
import Link from "next/link";

export default function MainFooter() {
  return (
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
  );
}