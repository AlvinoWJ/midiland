"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  List,
  Clock,
  CheckCircle,
  Calendar,
  Briefcase,
  Building2,
  Layers,
} from "lucide-react";
import { useFetchData } from "@/components/status/hooks/useFetchData";
import { KPICard } from "@/components/status/KPICard";
import { AssetAccordionRow } from "@/components/status/AssetAccordionRow";
import { TimelineStatus } from "@/components/status/TimelineStatus";
import { StatusBadge } from "@/components/status/StatusBadge";
import { UlokEksternal } from "@/lib/types/ulok-eksternal";

const getAssetIcon = (bentukObjek: string) => {
  const normalized = bentukObjek?.toLowerCase() || "";
  return normalized === "tanah" ? Layers : Building2;
};

const formatFullDateTime = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
};

export default function DashboardWithAccordion() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");

  const { data: fetchedProperties, loading, error } = useFetchData();
  const [propertiesData, setPropertiesData] = useState<UlokEksternal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>(null);
  const daftarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetchedProperties.length > 0) {
      setPropertiesData(fetchedProperties);
    }
  }, [fetchedProperties]);

  const scrollAccordionHeaderToAlignWithTimeline = (accordionId: string) => {
    const element = document.getElementById(`accordion-${accordionId}`);
    if (!element) return;

    const FIXED_TOP_OFFSET = 80;

    requestAnimationFrame(() => {
      const elemRect = element.getBoundingClientRect();
      const targetScrollY =
        window.scrollY + elemRect.top - FIXED_TOP_OFFSET + 4;

      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    if (selectedId && propertiesData.length > 0) {
      const propertyExists = propertiesData.some((p) => p.id === selectedId);
      if (propertyExists) {
        setActiveAccordionId(selectedId);
        setTimeout(() => scrollAccordionHeaderToAlignWithTimeline(selectedId), 300);
      }
    }
  }, [selectedId, propertiesData]);

  const handleAssetUpdate = (updatedProperty: UlokEksternal) => {
    setPropertiesData((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
    );
  };

  const selectedProperty = useMemo(
    () => propertiesData.find((p) => p.id === activeAccordionId) || null,
    [activeAccordionId, propertiesData]
  );

  const total = propertiesData.length;

  const rented = propertiesData.filter((p) => {
      const kplt = p.kplt_approval?.toLowerCase() || '';
      return ['approved', 'disetujui', 'ok'].includes(kplt);
  }).length;

  const pending = propertiesData.filter((p) => {
      const kplt = p.kplt_approval?.toLowerCase() || '';
      const isApproved = ['approved', 'disetujui', 'ok'].includes(kplt);
      const isRejected = p.status_ulok_eksternal === 'Rejected' || kplt.includes('reject') || kplt.includes('tolak') || kplt.includes('nok');
      const isDraft = p.status_ulok_eksternal === 'Draft';
      return !isApproved && !isRejected && !isDraft;
  }).length;

  const recentProperties = useMemo(
    () =>
      [...propertiesData]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3),
    [propertiesData]
  );

  const filteredProperties = useMemo(
    () =>
      propertiesData.filter(
        (p) =>
          p.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.kabupaten.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [propertiesData, searchTerm]
  );

  const handleToggleAccordion = (id: string) => {
    setActiveAccordionId((prevId) => (prevId === id ? null : id));
  };

  const handleRecentClick = (id: string) => {
    setActiveAccordionId(id);

    daftarRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTimeout(() => scrollAccordionHeaderToAlignWithTimeline(id), 500);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Clock className="animate-spin w-10 h-10 text-rose-500" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8 px-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Status Property
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium">
            Kelola dan pantau usulan lokasi Anda secara real-time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <KPICard title="Total Aset Terdaftar" value={total} Icon={List} color="text-indigo-600" />
          <KPICard title="Pengajuan Aktif" value={pending} Icon={Clock} color="text-amber-600" />
          <KPICard title="Aset Aktif Disewa" value={rented} Icon={CheckCircle} color="text-green-600" />
        </div>

        <div className="p-4 md:p-6 bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-rose-500" />
            Aset Terbaru
          </h3>
          <div className="space-y-3">
            {recentProperties.map((p) => {
              const AssetIcon = getAssetIcon(p.bentuk_objek);
              return (
                <div
                  key={p.id}
                  className="flex flex-col-reverse sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-rose-50 hover:to-pink-50 transition-all cursor-pointer border border-gray-200 hover:border-rose-300 hover:shadow-md gap-3 sm:gap-4"
                  onClick={() => handleRecentClick(p.id)}
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <AssetIcon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-1" />
                    <div className="min-w-0 w-full">
                      <p className="text-xs text-gray-500 mb-0.5 flex items-center">
                        <Clock className="w-3 h-3 inline mr-1 text-gray-400" />
                        {formatFullDateTime(p.created_at)}
                      </p>
                      <p className="font-bold text-gray-900 break-all whitespace-normal leading-tight mb-1">
                        {p.alamat}
                      </p>
                      <p className="text-xs text-gray-500 break-words whitespace-normal">
                        {p.kabupaten}, {p.provinsi}
                      </p>
                    </div>
                  </div>
                  <div className="self-start mb-1 sm:mb-0 sm:ml-20 flex-shrink-0">
                    <StatusBadge status={p.status_ulok_eksternal} kplt_approval={p.kplt_approval} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div ref={daftarRef} className="mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            Daftar Usulan Lokasi
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 lg:w-2/3 space-y-4">
            <div className="space-y-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <div key={property.id} id={`accordion-${property.id}`}>
                    <AssetAccordionRow
                      property={property}
                      isSelected={activeAccordionId === property.id}
                      onToggle={handleToggleAccordion}
                      onAssetUpdate={handleAssetUpdate}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center p-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-gray-200">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-bold text-gray-700 mb-2">
                    Tidak ada aset ditemukan
                  </p>
                  <p className="text-sm text-gray-500">
                    Coba kata kunci lain atau tambahkan usulan baru
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => (window.location.href = "/input")}
              className="w-full p-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-rose-300"
            >
              ➕ Tambah Usulan Lokasi Baru
            </button>
          </div>

          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-20 space-y-4">
              
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari alamat, kabupaten, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>

              <div
                id="timeline-wrap"
                className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-y-auto max-h-[calc(100vh-12rem)]"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center pb-3 border-b border-gray-200">
                  <Briefcase className="w-5 h-5 mr-2 text-rose-500" />
                  Riwayat Progres
                </h3>
                <TimelineStatus
                  property={selectedProperty}
                  assetName={selectedProperty?.alamat}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}