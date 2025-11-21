"use client";

import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageCircle,
  Phone,
  ChevronDown,
} from "lucide-react";

export default function FaqAndContactSection() {
  return (
    <section className="w-full grid md:grid-cols-2 gap-12 py-16 md:py-20 border-t border-gray-200">
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
              Properti harus berada di lokasi strategis dengan akses mudah, luas
              minimal 150m², dan memiliki dokumen legal yang lengkap.
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
              Proses evaluasi umumnya memakan waktu 2-4 minggu, tergantung pada
              kelengkapan dokumen dan hasil survey lapangan.
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
              Tidak ada biaya apapun untuk mengajukan properti melalui platform
              MidiLand. Semua proses gratis.
            </div>
          </details>
        </div>
      </div>

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
  );
}