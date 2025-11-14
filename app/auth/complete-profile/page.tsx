"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users_eksternal/profile", {
          method: "GET",
          // credentials include cookie session by default on same-origin
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-semibold text-gray-800 text-center">
          Lengkapi Data Profil
        </h1>

        <div>
          <label className="text-sm text-gray-600">Nama Lengkap</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full border rounded-lg p-2 mt-1 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">No. Telepon</label>
          <input
            type="tel"
            name="no_telp"
            value={form.no_telp}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: 08123456789"
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Alamat</label>
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Masukkan alamat lengkap"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan dan Lanjut"}
        </button>
      </form>
    </div>
  );
}
