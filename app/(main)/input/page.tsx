"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import WilayahSelect from "@/components/ui/wilayahselect";
import { useRouter } from "next/navigation";
import {
  Loader2,
  UploadCloud,
  X,
  MapPin,
  ChevronDown,
  StoreIcon,
  User,
  Eye,
  HelpCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const LocationPickerModal = dynamic(
  () => import("../../../components/map/LocationPickerModal"),
  { ssr: false }
);

interface WilayahItem {
  code: string;
  name: string;
}

interface FormErrors {
  [key: string]: string;
}

const formatNumber = (value: string): string => {
  if (!value) return "";
  const numberValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
  if (isNaN(numberValue)) return "";
  return numberValue.toLocaleString("id-ID");
};

const unformatNumber = (value: string): string => {
  return value.replace(/\./g, "");
};

export default function InputPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [provinces, setProvinces] = useState<WilayahItem[]>([]);
  const [regencies, setRegencies] = useState<WilayahItem[]>([]);
  const [districts, setDistricts] = useState<WilayahItem[]>([]);
  const [villages, setVillages] = useState<WilayahItem[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedRegency, setSelectedRegency] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);

  const [provincesLoading, setProvincesLoading] = useState(false);
  const [regenciesLoading, setRegenciesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [villagesLoading, setVillagesLoading] = useState(false);

  const [formData, setFormData] = useState({
    alamat: "",
    latlong: "",
    bentuk_objek: "",
    alas_hak: "",
    jumlah_lantai: "",
    lebar_depan: "",
    panjang: "",
    luas: "",
    harga_sewa: "",
    nama_pemilik: "",
    kontak_pemilik: "",
  });

  const [hargaSewaDisplay, setHargaSewaDisplay] = useState("");
  const [fotoLokasi, setFotoLokasi] = useState<File | null>(null);
  const fetchWilayahData = async (
    type: string,
    code: string | null,
    setData: React.Dispatch<React.SetStateAction<WilayahItem[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLoading(true);
    try {
      let url = `/api/wilayah?type=${type}`;
      if (code) url += `&code=${code}`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayahData("provinces", null, setProvinces, setProvincesLoading);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
      setSelectedRegency(null);
      setSelectedDistrict(null);
      setSelectedVillage(null);
      fetchWilayahData(
        "regencies",
        selectedProvince,
        setRegencies,
        setRegenciesLoading
      );
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedRegency) {
      setDistricts([]);
      setVillages([]);
      setSelectedDistrict(null);
      setSelectedVillage(null);
      fetchWilayahData(
        "districts",
        selectedRegency,
        setDistricts,
        setDistrictsLoading
      );
    }
  }, [selectedRegency]);

  useEffect(() => {
    if (selectedDistrict) {
      setVillages([]);
      setSelectedVillage(null);
      fetchWilayahData(
        "villages",
        selectedDistrict,
        setVillages,
        setVillagesLoading
      );
    }
  }, [selectedDistrict]);

  const handleMapLocationSelect = (latlng: { lat: number; lng: number }) => {
    const formattedLatLong = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(
      5
    )}`;
    setFormData((prev) => ({
      ...prev,
      latlong: formattedLatLong,
    }));
    setIsMapOpen(false);
    if (errors.latlong) {
      setErrors((prev) => ({ ...prev, latlong: "" }));
    }
  };

  useEffect(() => {
    const panjang = parseFloat(formData.panjang);
    const lebar = parseFloat(formData.lebar_depan);

    if (!isNaN(panjang) && !isNaN(lebar) && panjang > 0 && lebar > 0) {
      const calculatedLuas = (panjang * lebar).toString();
      setFormData((prev) => ({ ...prev, luas: calculatedLuas }));
    } else {
      setFormData((prev) => ({ ...prev, luas: "" }));
    }
  }, [formData.panjang, formData.lebar_depan]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericOnlyFields = ["jumlah_lantai", "kontak_pemilik"];
    const decimalFields = ["lebar_depan", "panjang"];

    if (name === "harga_sewa") {
      const rawValue = value.replace(/[^0-9]/g, "");

      setFormData((prev) => ({ ...prev, [name]: rawValue }));
      setHargaSewaDisplay(formatNumber(rawValue));
    } else if (numericOnlyFields.includes(name)) {
      const rawValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: rawValue }));
    }
    else if (decimalFields.includes(name)) {
      const rawValue = value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*?)\..*/g, "$1");
      setFormData((prev) => ({ ...prev, [name]: rawValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoLokasi(e.target.files[0]);
      if (errors.foto) {
        setErrors((prev) => ({ ...prev, foto: "" }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.alamat) newErrors.alamat = "Alamat wajib diisi";
    if (!formData.latlong) newErrors.latlong = "Latlong wajib diisi";
    if (!formData.bentuk_objek)
      newErrors.bentuk_objek = "Bentuk objek wajib dipilih";
    if (!formData.alas_hak) newErrors.alas_hak = "Alas hak wajib diisi";
    if (!formData.jumlah_lantai)
      newErrors.jumlah_lantai = "Jumlah lantai wajib diisi";
    if (!formData.lebar_depan)
      newErrors.lebar_depan = "Lebar depan wajib diisi";
    if (!formData.panjang) newErrors.panjang = "Panjang wajib diisi";
    if (!formData.luas) newErrors.luas = "Luas wajib diisi";
    if (!formData.harga_sewa) newErrors.harga_sewa = "Harga sewa wajib diisi";
    if (!formData.nama_pemilik)
      newErrors.nama_pemilik = "Nama pemilik wajib diisi";
    if (!formData.kontak_pemilik)
      newErrors.kontak_pemilik = "Kontak pemilik wajib diisi";
    if (!selectedProvince) newErrors.provinsi_id = "Provinsi wajib dipilih";
    if (!selectedRegency)
      newErrors.kabupaten_id = "Kabupaten/Kota wajib dipilih";
    if (!selectedDistrict) newErrors.kecamatan_id = "Kecamatan wajib dipilih";
    if (!selectedVillage)
      newErrors.kelurahan_id = "Kelurahan/Desa wajib dipilih";
    if (!fotoLokasi) newErrors.foto = "Foto lokasi wajib di-upload";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    setIsSubmitting(true);

    const data = new FormData();

    const [lat, lng] = formData.latlong.split(",").map((s) => s.trim());
    data.append("latitude", lat);
    data.append("longitude", lng);

    const provName = provinces.find((p) => p.code === selectedProvince)?.name;
    const regName = regencies.find((r) => r.code === selectedRegency)?.name;
    const distName = districts.find((d) => d.code === selectedDistrict)?.name;
    const villName = villages.find((v) => v.code === selectedVillage)?.name;

    data.append("provinsi", provName || "");
    data.append("kabupaten", regName || "");
    data.append("kecamatan", distName || "");
    data.append("desa_kelurahan", villName || "");
    data.append("foto_lokasi", fotoLokasi!);
    data.append("alamat", formData.alamat);
    data.append("bentuk_objek", formData.bentuk_objek);
    data.append("alas_hak", formData.alas_hak);
    data.append("jumlah_lantai", formData.jumlah_lantai);
    data.append("lebar_depan", formData.lebar_depan);
    data.append("panjang", formData.panjang);
    data.append("luas", formData.luas);
    data.append("harga_sewa", formData.harga_sewa);
    data.append("nama_pemilik", formData.nama_pemilik);
    data.append("kontak_pemilik", formData.kontak_pemilik);

    try {
      const res = await fetch("/api/usulan_lokasi", {
        method: "POST",
        body: data,
      });

      const responseJson = await res.json();

      if (!res.ok) {
        throw new Error(responseJson.error || "Gagal menyimpan data");
      }

      alert("Data berhasil disimpan!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Submit Error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      popoverClass: "driverjs-theme",
      steps: [
        {
          element: "#form-lokasi",
          popover: {
            title: "Data Usulan Lokasi",
            description:
              "Bagian ini untuk mengisi data alamat dan lokasi dari usulan Anda.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#select-provinsi",
          popover: {
            title: "Pemilihan Wilayah",
            description:
              "Pilih Provinsi, lalu Kabupaten, Kecamatan, dan Kelurahan. Pilihan akan muncul otomatis.",
          },
        },
        {
          element: "#input-latlong",
          popover: {
            title: "Koordinat Lokasi",
            description:
              "Masukkan koordinat (Latlong). Anda juga bisa klik ikon Peta untuk memilih lokasi dari map.",
          },
        },
        {
          element: "#upload-foto",
          popover: {
            title: "Foto Lokasi",
            description: "Upload foto lokasi yang diusulkan. Ini wajib diisi.",
          },
        },
        {
          element: "#form-store",
          popover: {
            title: "Data Store",
            description:
              "Bagian ini mencakup detail properti seperti bentuk objek, ukuran, dan harga sewa.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#select-objek",
          popover: {
            title: "Bentuk Objek",
            description:
              "Pilih bentuk objek properti, apakah tanah atau bangunan.",
          },
        },
        {
          element: "#input-harga",
          popover: {
            title: "Harga Sewa",
            description:
              "Masukkan harga sewa. Format angka akan otomatis diatur.",
          },
        },
        {
          element: "#form-pemilik",
          popover: {
            title: "Data Pemilik",
            description: "Informasi kontak pemilik properti.",
            side: "left",
            align: "start",
          },
        },
        {
          element: "#tombol-simpan",
          popover: {
            title: "Simpan Data",
            description:
              "Setelah semua data terisi, klik di sini untuk menyimpan usulan Anda.",
            side: "top",
            align: "end",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div
            id="form-lokasi"
            className="bg-white rounded-lg shadow-md overflow-hidden mt-4 shadow-[1px_1px_6px_rgba(0,0,0,0.25)]"
          >
            <div className="bg-red-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6" />
                <h1 className="text-xl font-semibold">Data Usulan Lokasi</h1>
              </div>
              <button
                type="button"
                onClick={startTour}
                className="bg-white text-red-600 px-3 py-1 rounded-md shadow-md flex items-center gap-2 hover:bg-red-50 transition-colors"
                title="Mulai Tur Panduan"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Panduan</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div id="select-provinsi">
                  <WilayahSelect
                    label="Provinsi"
                    placeholder="Pilih Provinsi"
                    options={provinces}
                    selectedValue={selectedProvince}
                    onSelect={setSelectedProvince}
                    isLoading={provincesLoading}
                    disabled={provincesLoading}
                  />
                  {errors.provinsi_id && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.provinsi_id}
                    </p>
                  )}
                </div>
                <div>
                  <WilayahSelect
                    label="Kabupaten/Kota"
                    placeholder={
                      !selectedProvince
                        ? "Pilih Provinsi Dulu"
                        : "Pilih Kabupaten/Kota"
                    }
                    options={regencies}
                    selectedValue={selectedRegency}
                    onSelect={setSelectedRegency}
                    isLoading={regenciesLoading}
                    disabled={!selectedProvince}
                  />
                  {errors.kabupaten_id && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.kabupaten_id}
                    </p>
                  )}
                </div>
                <div>
                  <WilayahSelect
                    label="Kecamatan"
                    placeholder={
                      !selectedRegency
                        ? "Pilih Kab/Kota Dulu"
                        : "Pilih Kecamatan"
                    }
                    options={districts}
                    selectedValue={selectedDistrict}
                    onSelect={setSelectedDistrict}
                    isLoading={districtsLoading}
                    disabled={!selectedRegency}
                  />
                  {errors.kecamatan_id && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.kecamatan_id}
                    </p>
                  )}
                </div>
                <div>
                  <WilayahSelect
                    label="Kelurahan/Desa"
                    placeholder={
                      !selectedDistrict
                        ? "Pilih Kecamatan Dulu"
                        : "Pilih Kelurahan/Desa"
                    }
                    options={villages}
                    selectedValue={selectedVillage}
                    onSelect={setSelectedVillage}
                    isLoading={villagesLoading}
                    disabled={!selectedDistrict}
                  />
                  {errors.kelurahan_id && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.kelurahan_id}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Alamat <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan alamat"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.alamat && (
                    <p className="text-sm text-red-600 mt-1">{errors.alamat}</p>
                  )}
                </div>

                <div id="input-latlong">
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Latlong <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="latlong"
                      value={formData.latlong}
                      onChange={handleInputChange}
                      placeholder="Masukkan latlong"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-700"
                      onClick={() => setIsMapOpen(true)}
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>
                  {errors.latlong && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.latlong}
                    </p>
                  )}
                </div>
              </div>

              <div id="upload-foto">
                <label className="block text-md font-medium text-gray-700 mb-2">
                  Foto Lokasi <span className="text-red-600">*</span>
                </label>

                {fotoLokasi ? (
                  <div className="w-full border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <UploadCloud className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-700 truncate">
                            {fotoLokasi.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(fotoLokasi.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <button
                          type="button"
                          onClick={() => {
                            const url = URL.createObjectURL(fotoLokasi);
                            window.open(url, "_blank");
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow transition-colors"
                          title="Lihat preview"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFotoLokasi(null)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow transition-colors"
                          title="Hapus foto"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">
                            Klik untuk upload
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}

                {errors.foto && (
                  <p className="text-sm text-red-600 mt-1">{errors.foto}</p>
                )}
              </div>
            </div>
          </div>

          <div
            id="form-store"
            className="bg-white rounded-lg shadow-md overflow-hidden mt-8 shadow-[1px_1px_6px_rgba(0,0,0,0.25)]"
          >
            <div className="bg-red-600 text-white p-4 flex items-center gap-3">
              <StoreIcon className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Data Store</h1>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div id="select-objek">
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Bentuk Objek <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="bentuk_objek"
                      value={formData.bentuk_objek}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="" disabled hidden>
                        Pilih Objek
                      </option>
                      <option value="Tanah">Tanah</option>
                      <option value="Bangunan">Bangunan</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
                        <ChevronDown className="w-4 h-4 text-red-600" />
                      </div>
                    </div>
                  </div>
                  {errors.bentuk_objek && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.bentuk_objek}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Alas Hak <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="alas_hak"
                    value={formData.alas_hak}
                    onChange={handleInputChange}
                    placeholder="Masukkan alas hak"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.alas_hak && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.alas_hak}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Jumlah Lantai <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="jumlah_lantai"
                    value={formData.jumlah_lantai}
                    onChange={handleInputChange}
                    placeholder="Masukkan jumlah lantai"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.jumlah_lantai && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.jumlah_lantai}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Lebar Depan (m) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    step="0.01"
                    name="lebar_depan"
                    value={formData.lebar_depan}
                    onChange={handleInputChange}
                    placeholder="Masukkan lebar depan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.lebar_depan && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.lebar_depan}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Panjang (m) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    step="0.01"
                    name="panjang"
                    value={formData.panjang}
                    onChange={handleInputChange}
                    placeholder="Masukkan panjang"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.panjang && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.panjang}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Luas (m²) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="luas"
                    value={formData.luas}
                    onChange={handleInputChange}
                    placeholder="Masukkan luas"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.luas && (
                    <p className="text-sm text-red-600 mt-1">{errors.luas}</p>
                  )}
                </div>
                <div id="input-harga">
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Harga Sewa (+PPH 10%){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="harga_sewa"
                    value={hargaSewaDisplay}
                    onChange={handleInputChange}
                    placeholder="Masukkan harga sewa"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.harga_sewa && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.harga_sewa}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            id="form-pemilik"
            className="bg-white rounded-lg shadow-md overflow-hidden mt-8 mb-8 shadow-[1px_1px_6px_rgba(0,0,0,0.25)]"
          >
            <div className="bg-red-600 text-white p-4 flex items-center gap-3">
              <User className="w-6 h-6" />
              <h1 className="text-xl font-semibold">Data Pemilik</h1>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Nama Pemilik <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_pemilik"
                    value={formData.nama_pemilik}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama pemilik"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.nama_pemilik && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.nama_pemilik}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Kontak Pemilik <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="kontak_pemilik"
                    value={formData.kontak_pemilik}
                    onChange={handleInputChange}
                    placeholder="Masukkan kontak pemilik"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  {errors.kontak_pemilik && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.kontak_pemilik}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div id="tombol-simpan" className="flex justify-end mb-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md shadow-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Usulan Lokasi"
              )}
            </button>
          </div>
        </form>
      </div>
      {isMapOpen && (
        <LocationPickerModal
          onClose={() => setIsMapOpen(false)}
          onLocationSelect={handleMapLocationSelect}
        />
      )}
    </main>
  );
}