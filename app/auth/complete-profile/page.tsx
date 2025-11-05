"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function CompleteProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_telp: "",
    alamat: "",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.replace("/auth/login");
          return;
        }

        setForm((prev) => ({
          ...prev,
          email: user.email || "",
          nama:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "",
        }));
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Gagal memuat data pengguna");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUser();
  }, [router, supabase]);

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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Sesi login tidak valid");
        router.replace("/auth/login");
        return;
      }

      const { error } = await supabase.from("users_eksternal").upsert({
        id: user.id,
        nama: form.nama.trim(),
        email: form.email.trim(),
        no_telp: form.no_telp.trim(),
        alamat: form.alamat.trim(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

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
