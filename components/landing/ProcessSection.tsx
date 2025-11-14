"use client";

import {
  UserPlus,
  ClipboardCheck,
  Home as HomeIcon,
  Handshake,
} from "lucide-react";

export default function ProcessSection() {
  return (
    <section className="w-full py-16 md:py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Bagaimana Prosesnya?
      </h2>
      <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
        Proses kami dibuat sederhana dan transparan. Berikut langkah-langkahnya
        untuk memulai kemitraan dengan Alfamidi
      </p>

      <div className="max-w-5xl mx-auto px-4">
        <div className="hidden sm:flex items-start justify-center mb-12">
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="space-y-2 text-center px-2">
              <h4 className="font-bold text-base md:text-lg text-gray-900 min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center">
                Daftar & Login
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Buat akun atau masuk ke platform MidiLand untuk memulai
              </p>
            </div>
          </div>


          <div className="w-12 md:w-20 lg:w-28 h-1 bg-red-600 mx-1 md:mx-2 mt-8 md:mt-10 flex-shrink-0"></div>


          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <HomeIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="space-y-2 text-center px-2">
              <h4 className="font-bold text-base md:text-lg text-gray-900 min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center">
                Ajukan Property
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Isi detail properti Anda dengan lengkap dan akurat
              </p>
            </div>
          </div>

          <div className="w-12 md:w-20 lg:w-28 h-1 bg-red-600 mx-1 md:mx-2 mt-8 md:mt-10 flex-shrink-0"></div>

          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <ClipboardCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="space-y-2 text-center px-2">
              <h4 className="font-bold text-base md:text-lg text-gray-900 min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center">
                Survey & MOU
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Tim kami akan survey lokasi dan menyiapkan MOU
              </p>
            </div>
          </div>

          <div className="w-12 md:w-20 lg:w-28 h-1 bg-red-600 mx-1 md:mx-2 mt-8 md:mt-10 flex-shrink-0"></div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-4">
              <Handshake className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="space-y-2 text-center px-2">
              <h4 className="font-bold text-base md:text-lg text-gray-900 min-h-[3rem] md:min-h-[3.5rem] flex items-center justify-center">
                Kemitraan
              </h4>
              <p className="text-xs md:text-sm text-gray-600">
                Selamat! Properti Anda resmi bermitra dengan Alfamidi
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:hidden mb-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-3">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1 text-center">
              <h4 className="font-bold text-sm text-gray-900">
                Daftar & Login
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Buat akun atau masuk ke platform MidiLand untuk memulai
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-3">
              <HomeIcon className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1 text-center">
              <h4 className="font-bold text-sm text-gray-900">
                Ajukan Property
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Isi detail properti Anda dengan lengkap dan akurat
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-3">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1 text-center">
              <h4 className="font-bold text-sm text-gray-900">
                Survey & MOU
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Tim kami akan survey lokasi dan menyiapkan MOU
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-3">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1 text-center">
              <h4 className="font-bold text-sm text-gray-900">Kemitraan</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Selamat! Properti Anda resmi bermitra dengan Alfamidi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}