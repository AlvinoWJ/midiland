"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const carouselSlides = [
  {
    image: "/carousel1.svg",
    alt: "Ilustrasi Proses Pengajuan",
    title: "Proses Pengajuan Mudah dan Terpadu",
  },
  {
    image: "/carousel2.svg",
    alt: "Ilustrasi Profesional",
    title: "Survei dan Verifikasi Profesional",
  },
  {
    image: "/carousel3.svg",
    alt: "Ilustrasi Kerja Sama",
    title: "Kerja Sama Aman dan Transparan",
  },
  {
    image: "/carousel4.svg",
    alt: "Ilustrasi Perkembangan",
    title: "Nilai Aset Semakin Berkembang",
  },
];

export default function CompleteProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_telp: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselSlides.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
        });

        if (res.status === 401) {
          router.replace("/auth/login");
          return;
        }

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || "Gagal memuat profil");
        }

        const data = await res.json();
        setForm({
          nama: data.nama || "",
          email: data.email || "",
          no_telp: data.no_telp || "",
          alamat: data.alamat || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Gagal memuat data pengguna");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: form.nama,
          no_telp: form.no_telp,
          alamat: form.alamat,
        }),
      });

      if (res.status === 401) {
        toast.error("Sesi login tidak valid");
        router.replace("/auth/login");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Gagal menyimpan data profil");
      }

      toast.success("Profil berhasil dilengkapi!");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Gagal menyimpan data profil");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 animate-pulse">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="relative flex w-full md:w-1/2 flex-col justify-center items-center px-6 md:px-6 lg:px-10 bg-white overflow-y-auto">
        <div className="w-full max-w-lg space-y-4">
          <div className="flex justify-center text-left mb-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Lengkapi Profil <span className="text-secondary">Midi</span>
              <span className="text-primary">Land</span>
            </h1>
          </div>
          <div className="flex justify-center mb-3">
            <Image
              src="/alfamidi.svg"
              alt="Header Gambar"
              width={350}
              height={250}
              className="object-contain"
              priority
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label
                htmlFor="nama"
                className="text-gray-900 font-medium text-sm"
              >
                Nama Lengkap
              </Label>
              <Input
                id="nama"
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
                className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-gray-900 font-medium text-sm"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="no_telp"
                className="text-gray-900 font-medium text-sm"
              >
                No. Telepon
              </Label>
              <Input
                id="no_telp"
                type="tel"
                name="no_telp"
                value={form.no_telp}
                onChange={handleChange}
                placeholder="Contoh: 08123456789"
                required
                className="h-10 border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="alamat"
                className="text-gray-900 font-medium text-sm"
              >
                Alamat
              </Label>
              <Textarea
                id="alamat"
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                required
                className="border-gray-300 rounded-lg focus:border-secondary focus:ring-secondary text-sm"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan dan Lanjut"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 items-center justify-center p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/login.svg"
            alt="City Background"
            fill
            className="object-cover"
            quality={100}
            priority
          />
        </div>
        
        <div className="absolute top-6 right-6">
          <div className="border-2 border-white rounded-xl p-2 bg-white shadow-md">
            <Image
              src="/alfamidilogo.svg"
              alt="Alfamidi Logo"
              width={150}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md lg:max-w-lg aspect-[4/3] rounded-2xl shadow-xl overflow-hidden backdrop-blur-md bg-white/40">
          <div
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 h-full flex flex-col items-center justify-center text-center p-8 space-y-4"
              >
                <div className="relative w-48 h-48 lg:w-64 lg:h-64 mb-4">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">
                  {slide.title}
                </h2>
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index
                    ? "bg-secondary"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}