import React, { useState } from 'react';
import {
  FileText, Image, User, MapPin, Layers, Calendar, Building2,
  FileCheck, Phone, Ruler, Square, Home, Compass, Map, Save, X
} from 'lucide-react';
import { UlokEksternal } from '@/lib/types/ulok-eksternal';
import { DataRow } from './DataRow';
import { toast } from 'react-hot-toast';
import { ImageModal } from './ImageModal';
import { createClient } from '@/lib/supabase/client'; 

const ImageIcon = Image;
const PinIcon = MapPin;

interface AssetDetailContentProps {
  property: UlokEksternal;
  onUpdateSuccess: (updatedProperty: UlokEksternal) => void;
}

export const AssetDetailContent: React.FC<AssetDetailContentProps> = ({
  property,
  onUpdateSuccess
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState(property);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const supabase = createClient();

  const {
    created_at, bentuk_objek, nama_pemilik, kontak_pemilik,
    provinsi, kabupaten, kecamatan, desa_kelurahan, latitude, longitude,
    lebar_depan, jumlah_lantai, luas, harga_sewa, alamat, alas_hak, panjang,
    foto_lokasi, status_ulok_eksternal, updated_at
  } = editedProperty;

  const statusColor =
    status_ulok_eksternal === "approved" ? "bg-green-100 text-green-700 border-green-300" :
    status_ulok_eksternal === "rejected" ? "bg-red-100 text-red-700 border-red-300" :
    status_ulok_eksternal === "review" ? "bg-blue-100 text-blue-700 border-blue-300" :
    "bg-yellow-100 text-yellow-700 border-yellow-300";

  const handleInputChange = (key: string, value: string | number) => {
    setEditedProperty(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan perubahan...");
    const formData = new FormData();
    const VALID_BENTUK_OBJEK = ['Tanah', 'Bangunan'];

    Object.keys(editedProperty).forEach(key => {
      const value = editedProperty[key as keyof UlokEksternal];
      if (
        key === 'id' ||
        key === 'users_eksternal_id' ||
        key === 'created_at' ||
        key === 'updated_at' ||
        key === 'status_ulok_eksternal'
      ) {
        return;
      }
      if (value == null) return;
      if (key === 'bentuk_objek') {
        const stringValue = String(value);
        const normalized = stringValue.charAt(0).toUpperCase() + stringValue.slice(1).toLowerCase();
        if (
            !VALID_BENTUK_OBJEK.includes(normalized) &&
            property.bentuk_objek === stringValue 
        ) {
            return;
        }
        formData.append('bentuk_objek', normalized);
        return;
      }
      formData.append(key, String(value));
    });

    try {
      const response = await fetch(`/api/usulan_lokasi/${property.id}`, {
        method: 'PATCH',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan data.");

      toast.success("Data berhasil diperbarui!", { id: toastId });
      onUpdateSuccess(result.data);
      setIsEditing(false); 

    } catch (error) {
      console.error("Save Error:", error);
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data.";
      toast.error(message, { id: toastId });

    } finally {
      setIsSaving(false);
    }
  };

  const numericFormatter = new Intl.NumberFormat('id-ID');
  const formattedPriceDisplay = `Rp ${numericFormatter.format(harga_sewa)}`;

  const assetTypeLabel =
    bentuk_objek.charAt(0).toUpperCase() + bentuk_objek.slice(1);

  const floorCountDisplay = jumlah_lantai && jumlah_lantai > 0 ? jumlah_lantai : 1;

  const IconProvinsi = Map;
  const IconKabupaten = Home;
  const IconKecamatan = PinIcon;
  const IconKelurahan = PinIcon;
  const IconKoordinat = Compass;
  const IconBentukObjek = Building2;
  const IconAlasHak = FileText;
  const IconLantai = Layers;
  const IconLebarPanjang = Ruler;
  const IconLuasTanah = Square;
  const IconNamaPemilik = User;
  const IconKontakPemilik = Phone;
  
  const formatDateTime = (dateString: string) => {
    const formatted = new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });

    const parts = formatted.split(', ');
    const datePart = parts[0]; 
    let timePart = parts[1]; 
    
    if (timePart) {
        timePart = timePart.replace(/\./g, ':');
    }
    return `${datePart}, ${timePart}`;
  };

  const hasBeenUpdated = updated_at && new Date(updated_at).getTime() !== new Date(created_at).getTime();

  const handleViewPhoto = () => {
    
    if (foto_lokasi) {
      const NAMA_BUCKET_ANDA = 'file_storage_eksternal'; 

      const { data } = supabase.storage
        .from(NAMA_BUCKET_ANDA)
        .getPublicUrl(foto_lokasi);

      if (data?.publicUrl) {
        console.log("BERHASIL. URL Lengkap:", data.publicUrl);
        setFullImageUrl(data.publicUrl);
        setIsModalOpen(true);
      } else {
        toast.error('Gagal memuat URL gambar.');
      }
    } else {
      toast.error('Tidak ada foto lokasi tersedia.');
    }
  };

  return (
    <> 
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t-4 border-rose-500 space-y-6">
        <div className="flex justify-between items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex flex-col space-y-1"> 
              <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                      <span className="font-medium">Dibuat:</span>{" "}
                      <span className="font-bold">
                          {formatDateTime(created_at)}
                      </span>
                  </span>
              </div>
              
              {hasBeenUpdated && (
                  <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">
                          <span className="font-medium">Di edit pada:</span>{" "}
                          <span className="font-bold">
                              {formatDateTime(updated_at)}
                          </span>
                      </span>
                  </div>
              )}
          </div>
    
          <div className={`px-3 py-1 border rounded-full text-xs font-bold capitalize ${statusColor} flex-shrink-0 mt-0.5`}>
            {status_ulok_eksternal}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">Detail Lokasi</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DataRow label="Provinsi" value={provinsi} Icon={IconProvinsi} isEditing={false} dataKey="provinsi" />
              <DataRow label="Kab/Kota" value={kabupaten} Icon={IconKabupaten} isEditing={false} dataKey="kabupaten" />
              <DataRow label="Kecamatan" value={kecamatan} Icon={IconKecamatan} isEditing={isEditing} onChange={handleInputChange} dataKey="kecamatan" />
              <DataRow label="Kelurahan" value={desa_kelurahan} Icon={IconKelurahan} isEditing={isEditing} onChange={handleInputChange} dataKey="desa_kelurahan" />
              <div className="col-span-2">
                <DataRow label="Alamat Detail" value={alamat} Icon={PinIcon} isEditing={isEditing} onChange={handleInputChange} dataKey="alamat" />
              </div>
              <div className="col-span-2">
                <DataRow label="Koordinat" value={`${latitude}, ${longitude}`} Icon={IconKoordinat} isEditing={false} dataKey="latitude" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-lg">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">Detail Properti</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DataRow
                label="Bentuk Objek"
                value={assetTypeLabel}
                Icon={IconBentukObjek}
                isEditing={isEditing}
                onChange={handleInputChange}
                dataKey="bentuk_objek"
                type="select"
                options={["Tanah", "Bangunan"]}
              />
              <DataRow label="Alas Hak" value={alas_hak} Icon={IconAlasHak} isEditing={false} dataKey="alas_hak" />
              {bentuk_objek.toLowerCase() !== 'tanah' && (
                <DataRow label="Jumlah Lantai" value={floorCountDisplay} Icon={IconLantai} isEditing={isEditing} onChange={handleInputChange} dataKey="jumlah_lantai" type="number" />
              )}
              <DataRow label="Lebar Depan" value={lebar_depan} Icon={IconLebarPanjang} isEditing={isEditing} onChange={handleInputChange} dataKey="lebar_an" type="number" unit="m" />
              <DataRow label="Panjang" value={panjang} Icon={IconLebarPanjang} isEditing={isEditing} onChange={handleInputChange} dataKey="panjang" type="number" unit="m" />
              <DataRow label="Luas Tanah" value={luas} Icon={IconLuasTanah} isEditing={isEditing} onChange={handleInputChange} dataKey="luas" type="number" unit="m²" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-200 text-center">
                {isEditing ? (
                  <DataRow
                    label="Harga Sewa yang Diajukan:"
                    value={harga_sewa}
                    Icon={Home}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                    dataKey="harga_sewa"
                    type="number"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-gray-600 font-medium mb-1">Harga Sewa yang Diajukan:</p>
                    <p className="text-xl font-extrabold text-green-700">{formattedPriceDisplay}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
              <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-2 rounded-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">Data Pemilik</h4>
            </div>
            <div className="space-y-4">
              <DataRow label="Nama Pemilik" value={nama_pemilik} Icon={IconNamaPemilik} isEditing={isEditing} onChange={handleInputChange} dataKey="nama_pemilik" />
              <DataRow label="Kontak Pemilik" value={kontak_pemilik} Icon={IconKontakPemilik} isEditing={isEditing} onChange={handleInputChange} dataKey="kontak_pemilik" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-lg">
                <FileCheck className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">Dokumen Pendukung</h4>
            </div>
            <div className="space-y-3">
              {foto_lokasi && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Foto Lokasi</span>
                  </div>
                  
                  <button 
                    onClick={handleViewPhoto}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 transition cursor-pointer"
                  >
                    Lihat →
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400">
                <Save className="w-5 h-5 mr-2 inline" /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditedProperty(property); }}
                disabled={isSaving}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-500 to-slate-600 text-white font-bold rounded-xl hover:from-gray-600 hover:to-slate-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:bg-gray-400">
                <X className="w-5 h-5 mr-2 inline" /> Batal
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                ✏️ Edit Data Aset
              </button>
            </>
          )}
        </div>
      </div>

      <ImageModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFullImageUrl(null);
        }}
        imageUrl={fullImageUrl}
      />
    </>
  );
};