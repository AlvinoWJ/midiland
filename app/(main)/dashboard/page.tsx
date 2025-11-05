import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PropertyStatus = "disetujui" | "survey" | "ditolak" | "review";

interface UserProperty {
  id: string;
  nama: string;
  alamat: string;
  status: PropertyStatus;
}
function PropertyCard({ property }: { property: UserProperty }) {
  const getStatusInfo = (status: PropertyStatus) => {
    switch (status) {
      case "disetujui":
        return {
          text: "Disetujui",
          color: "text-green-700 bg-green-50",
          icon: "✅",
        };
      case "survey":
        return {
          text: "Survey",
          color: "text-blue-700 bg-blue-50",
          icon: "📋",
        };
      case "ditolak":
        return {
          text: "Ditolak",
          color: "text-red-700 bg-red-50",
          icon: "❌",
        };
      case "review":
        return {
          text: "Sedang Direview",
          color: "text-yellow-700 bg-yellow-50",
          icon: "⏳",
        };
      default:
        return {
          text: "Draft",
          color: "text-gray-600 bg-gray-50",
          icon: "📝",
        };
    }
  };

  const statusInfo = getStatusInfo(property.status);

  return (
    <Card className="overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-transform hover:-translate-y-1 rounded-2xl bg-white">
      <CardContent className="p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3
            className="text-lg font-semibold text-gray-900 truncate"
            title={property.nama}
          >
            {property.nama}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.color} flex items-center gap-1`}
          >
            <span>{statusInfo.icon}</span> {statusInfo.text}
          </span>
        </div>

        <p
          className="text-sm text-gray-500 leading-snug"
          title={property.alamat}
        >
          {property.alamat}
        </p>

        <div className="flex justify-end pt-2">
          <Link
            href={`/status/${property.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Lihat Detail →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// === Halaman Dashboard ===
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Pengguna";

  // Contoh data properti
  const userProperties: UserProperty[] = [
    {
      id: "1",
      nama: "Ruko 2 Lantai di Tangerang",
      alamat: "Jl. Pahlawan Seribu No. 45, BSD",
      status: "disetujui",
    },
    {
      id: "2",
      nama: "Tanah Kosong di Bekasi",
      alamat: "Jl. Industri Utama Blok B-1, Cikarang",
      status: "survey",
    },
    {
      id: "3",
      nama: "Gudang di Bogor",
      alamat: "Jl. Raya Sentul KM 5, Bogor",
      status: "ditolak",
    },
    {
      id: "4",
      nama: "Ruko di Jakarta Selatan",
      alamat: "Jl. Panglima Polim No. 12",
      status: "review",
    },
  ];

  return (
    <>
      {/* === HERO SECTION === */}
      <section className="relative w-full overflow-hidden bg-gray-50">
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
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8 pt-16 pb-16 md:pt-20">
          <div className="md:w-1/2 flex flex-col justify-center text-center md:text-left items-center md:items-start">
            <h1 className="text-4xl font-bold text-gray-900">Halo,</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-3">
              {userName}
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Kelola properti yang telah Anda ajukan dan pantau statusnya di
              sini.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white font-semibold text-base px-6 py-6 w-full md:w-auto"
            >
              <Link href="/input">
                Ajukan Properti Baru
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-xl lg:max-w-2xl">
              <Image
                src="/alfamidi.svg"
                alt="Ilustrasi Dashboard"
                width={500}
                height={560}
                priority
                className="w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === DAFTAR PROPERTY === */}
      <section className="w-full bg-gray-50">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Total Properti Diajukan
            </h2>
            {userProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {userProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 border-dashed bg-white rounded-2xl">
                <Image
                  src="/no-data.svg"
                  alt="Tidak ada data"
                  width={150}
                  height={150}
                />
                <p className="mt-4 text-lg font-semibold text-gray-700">
                  Anda belum mengajukan properti.
                </p>
                <p className="text-gray-500 mb-6">
                  Mulai ajukan properti pertama Anda sekarang!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="inline-flex items-center gap-2 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white font-semibold text-base px-8 py-6 whitespace-nowrap"
                >
                  <Link href="/input">
                    Ajukan Properti Baru
                    <ArrowRight size={20} />
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* === SECTION HUBUNGI KAMI === */}
      <section className="w-full bg-gray-50">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 pt-4 pb-20 flex flex-col gap-10"></div>
      </section>
    </>
  );
}
