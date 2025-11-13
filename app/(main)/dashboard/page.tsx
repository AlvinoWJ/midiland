import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, Search} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PropertyStatus = "disetujui" | "survey" | "ditolak" | "review";
type DbStatus = PropertyStatus | "In Progress"; 

interface DatabaseProperty {
  id: string;
  alamat: string;
  status_ulok_eksternal: DbStatus;
  kabupaten: string | null;
  kecamatan: string | null;     
}

interface UserProperty {
  id: string;
  nama: string;
  alamat: string;
  kabupaten: string | null;
  kecamatan: string | null;
  status: PropertyStatus;
}

const mapStatus = (dbStatus: DbStatus): PropertyStatus => {
  switch (dbStatus) {
    case "disetujui":
    case "survey":
    case "ditolak":
    case "review":
      return dbStatus;
    case "In Progress":
      return "review";
    default:
      return "review";
  }
};

function PropertyCard({ property }: { property: UserProperty }) {
  const getStatusInfo = (status: PropertyStatus) => {
    switch (status) {
      case "disetujui":
        return {
          text: "Disetujui",
          color: "text-emerald-700 bg-emerald-50 border-emerald-200",
          icon: <CheckCircle2 className="w-4 h-4" />,
          dotColor: "bg-emerald-500"
        };
      case "survey":
        return {
          text: "Survey",
          color: "text-blue-700 bg-blue-50 border-blue-200",
          icon: <Clock className="w-4 h-4" />,
          dotColor: "bg-blue-500"
        };
      case "ditolak":
        return {
          text: "Ditolak",
          color: "text-red-700 bg-red-50 border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          dotColor: "bg-red-500"
        };
      case "review":
        return {
          text: "Sedang Direview",
          color: "text-amber-700 bg-amber-50 border-amber-200",
          icon: <AlertCircle className="w-4 h-4" />,
          dotColor: "bg-amber-500"
        };
      default:
        return {
          text: "Draft",
          color: "text-gray-700 bg-gray-50 border-gray-200",
          icon: <Clock className="w-4 h-4" />,
          dotColor: "bg-gray-500"
        };
    }
  };

  const statusInfo = getStatusInfo(property.status);

  const locationText = 
    property.kecamatan && property.kabupaten
      ? `${property.kecamatan}, ${property.kabupaten}`
      : property.alamat;
      
  const locationTitle = property.alamat;

  return (
    <Card className="group relative overflow-hidden border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300 rounded-xl bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="relative p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors" title={property.nama}>
              {property.nama}
            </h3>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed line-clamp-2" title={locationTitle}>
                {locationText}
              </p>
            </div>
          </div>
      
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusInfo.color} shrink-0 transition-transform group-hover:scale-105`}>
            <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor} animate-pulse`} />
            <span className="text-xs font-semibold whitespace-nowrap">{statusInfo.text}</span>
          </div>
        </div>
        <div className="border-t border-gray-100" />

        <Link
          href={`/status?selected=${property.id}`}
          className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
        >
          <span>Lihat Detail</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}

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

  let userProperties: UserProperty[] = [];
  let fetchError: string | null = null;

  if (user) {
    const { data, error } = await supabase
      .from("ulok_eksternal")
      .select("id, alamat, status_ulok_eksternal, kabupaten, kecamatan")
      .eq("users_eksternal_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error.message);
      fetchError = `Gagal memuat data properti: ${error.message}`;
    }

    if (data) {
      userProperties = data.map((prop: DatabaseProperty) => ({
        id: prop.id,
        nama: prop.alamat,
        alamat: prop.alamat,
        status: mapStatus(prop.status_ulok_eksternal),
        kabupaten: prop.kabupaten,
        kecamatan: prop.kecamatan, 
      }));
    }
  } else {
    fetchError = "User tidak terautentikasi. Silakan login kembali.";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative w-full overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 opacity-5">
          <Image
            alt="Peta Indonesia Latar Belakang"
            src="/indonesia.png"
            fill
            className="object-cover"
            quality={75}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-16 lg:py-24">
            <div className="flex-1 flex flex-col text-center lg:text-left items-center lg:items-start max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Dashboard Properti
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Selamat Datang,
                <span className="block text-primary mt-2">{userName}</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Kelola semua properti yang telah Anda ajukan dengan mudah. Pantau status persetujuan dan kelola submission Anda dalam satu tempat.
              </p>
              
              <Button
                asChild
                size="lg"
                className="group rounded-full shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base px-8 py-6 transition-all duration-300"
              >
                <Link href="/input" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Ajukan Properti Baru
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end max-w-md lg:max-w-lg w-full">
              <div className="relative w-full">
                <Image
                  src="/alfamidi.svg"
                  alt="Ilustrasi Dashboard Properti"
                  width={500}
                  height={560}
                  priority
                  className="relative w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {fetchError && (
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Terjadi Kesalahan</h3>
                <p className="text-sm text-red-700">{fetchError}</p>
                <p className="text-xs text-red-600 mt-2">Pastikan user yang login adalah External User dengan ID yang terdaftar di kolom `users_eksternal_id` pada tabel `ulok_eksternal`.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Properti Anda
            </h2>
            <p className="text-gray-600">
              {userProperties.length} {userProperties.length === 1 ? 'properti' : 'properti'} yang telah diajukan
            </p>
          </div>
          
          {userProperties.length > 0 && (
            <Button
              asChild
              variant="outline"
              className="hidden sm:flex items-center gap-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              <Link href="/input">
                <Plus className="w-4 h-4" />
                Ajukan Baru
              </Link>
            </Button>
          )}
        </div>

        {userProperties.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors rounded-2xl bg-white">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Search className="w-16 h-16 mx-auto mb-6 text-gray-300" />
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Belum Ada Properti
              </h3>
              <p className="text-gray-600 mb-8 max-w-md">
                Anda belum mengajukan properti apapun. Mulai perjalanan Anda dengan mengajukan properti pertama sekarang!
              </p>
              
              <Button
                asChild
                size="lg"
                className="group rounded-full shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 transition-all"
              >
                <Link href="/input" className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Ajukan Properti Baru
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}