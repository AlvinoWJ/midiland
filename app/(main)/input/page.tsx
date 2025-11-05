"use client";

import { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import WilayahSelect from "@/components/ui/wilayahselect";

interface WilayahItem {
  code: string;
  name: string;
}

export default function InputPage() {
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

  // Ambil data Provinsi pertama kali
  useEffect(() => {
    fetchWilayahData("provinces", null, setProvinces, setProvincesLoading);
  }, []);

  // Ambil kabupaten/kota setelah provinsi dipilih
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

  // Ambil kecamatan setelah kabupaten dipilih
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

  // Ambil kelurahan/desa setelah kecamatan dipilih
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

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Data Usulan Lokasi */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-4 shadow-[1px_1px_6px_rgba(0,0,0,0.25)]">
          <div className="bg-red-600 text-white p-4 flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Data Usulan Lokasi</h1>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lokasi <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder=""
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WilayahSelect
                label="Provinsi"
                placeholder="Pilih Provinsi"
                options={provinces}
                selectedValue={selectedProvince}
                onSelect={setSelectedProvince}
                isLoading={provincesLoading}
                disabled={provincesLoading}
              />

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

              <WilayahSelect
                label="Kecamatan"
                placeholder={
                  !selectedRegency ? "Pilih Kab/Kota Dulu" : "Pilih Kecamatan"
                }
                options={districts}
                selectedValue={selectedDistrict}
                onSelect={setSelectedDistrict}
                isLoading={districtsLoading}
                disabled={!selectedRegency}
              />

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
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder=""
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latlong <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10"
                  placeholder=""
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-700"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Store */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8 shadow-[1px_1px_6px_rgba(0,0,0,0.25)]">
          <div className="bg-red-600 text-white p-4 flex items-center gap-3">
            <MapPin className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Data Store</h1>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bentuk Objek <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">Pilih Objek</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-6 h-6 rounded-full border-2 border-red-600 flex items-center justify-center">
                      <ChevronDown className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alas Hak <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
