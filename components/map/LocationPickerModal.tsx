// components/map/LocationPickerModal.tsx
"use client";

import { X } from "lucide-react";
import LocationPickerMap from "./LocationPickerMap";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

interface LocationPickerModalProps {
  onClose: () => void;
  onLocationSelect: (latlng: { lat: number; lng: number }) => void;
}

export default function LocationPickerModal({
  onClose,
  onLocationSelect,
}: LocationPickerModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMapConfirm = (lat: number, lng: number) => {
    onLocationSelect({ lat, lng });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
      {/* Kontainer Modal (Box Putih) */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] overflow-hidden">
        {/* Tombol Close */}
        {/* z-index di sini (misal z-[1100]) adalah relatif terhadap parent-nya (z-[1000]), jadi ini aman */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[1100] bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
          title="Tutup Peta"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Render Peta Anda */}
        <LocationPickerMap onConfirm={handleMapConfirm} />
      </div>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
}
