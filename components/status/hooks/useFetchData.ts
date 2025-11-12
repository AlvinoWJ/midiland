import { useState, useEffect } from "react";
import { UlokEksternal, TimelineStep } from '@/lib/types/ulok-eksternal';

export const timelineDummy: Record<string, TimelineStep[]> = {
    "4149b6e5-90f9-4036-a619-46e11d901060": [
        { step: "Pengajuan Lokasi", status: "completed", details: "2025-11-06T10:30:00Z" }, 
        { step: "Pengecekan Awal (Survey)", status: "completed", details: "08 Nov 2025" },
        { step: "Verifikasi Dokumen", status: "in-progress", details: "Sedang diproses oleh Tim Legal" },
        { step: "Penawaran & Kontrak", status: "pending" },
    ],
    "0c603888-b385-4bcd-8ebe-5d47628ce23c": [
        { step: "Pengajuan Lokasi", status: "completed", details: "2025-11-05T14:15:00Z" }, 
        { step: "Pengecekan Awal (Survey)", status: "completed", details: "06 Nov 2025" },
        { step: "Verifikasi Dokumen", status: "completed", details: "07 Nov 2025" },
        { step: "Penawaran & Tanda Tangan Kontrak", status: "completed", details: "Disetujui: 07 Nov 2025" },
    ],
    "a3e8d24c-9f70-4b2a-8c01-1e9a7e0a6d5f": [
        { step: "Pengajuan Lokasi", status: "completed", details: "2025-08-01T09:00:00Z" }, 
        { step: "Pengecekan Awal (Survey)", status: "pending", details: "Menunggu Jadwal Survey & Kelengkapan Data" },
        { step: "Verifikasi Dokumen", status: "pending" },
    ]
};

export const getTimelineById = (id: string): TimelineStep[] => {
    return timelineDummy[id] || [];
};

export const generateDefaultTimeline = (property: UlokEksternal): TimelineStep[] => {
    const baseTimeline: TimelineStep[] = [
        { 
            step: "Pengajuan Lokasi", 
            status: "completed", 
            details: property.created_at
        },
    ];

    if (property.status_ulok_eksternal === "Draft") {
        baseTimeline.push(
            { 
                step: "Pengecekan Awal (Survey)", 
                status: "pending", 
                details: "Menunggu proses selanjutnya" 
            },
            { step: "Verifikasi Dokumen", status: "pending" },
            { step: "Penawaran & Kontrak", status: "pending" }
        );
    } else if (property.status_ulok_eksternal === "In Progress") {
        baseTimeline.push(
            { 
                step: "Pengecekan Awal (Survey)", 
                status: "completed", 
                details: "Survey telah dilakukan" 
            },
            { 
                step: "Verifikasi Dokumen", 
                status: "in-progress", 
                details: "Sedang diproses" 
            },
            { step: "Penawaran & Kontrak", status: "pending" }
        );
    } else if (property.status_ulok_eksternal === "OK") {
        baseTimeline.push(
            { 
                step: "Pengecekan Awal (Survey)", 
                status: "completed", 
                details: "Survey selesai" 
            },
            { 
                step: "Verifikasi Dokumen", 
                status: "completed", 
                details: "Dokumen terverifikasi" 
            },
            { 
                step: "Penawaran & Tanda Tangan Kontrak", 
                status: "completed", 
                details: property.approved_at 
                    ? `Disetujui: ${new Date(property.approved_at).toLocaleDateString('id-ID', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                    })}`
                    : "Kontrak aktif"
            }
        );
    } else if (property.status_ulok_eksternal === "Rejected") {
        baseTimeline.push(
            { 
                step: "Pengecekan Awal (Survey)", 
                status: "completed", 
                details: "Survey selesai" 
            },
            { 
                step: "Verifikasi Dokumen", 
                status: "completed", 
                details: "Ditolak oleh sistem" 
            }
        );
    }

    return baseTimeline;
};

export const useFetchData = () => {
    const [data, setData] = useState<UlokEksternal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                console.log('🔄 Fetching data from API...');
                
                const response = await fetch('/api/usulan_lokasi', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    cache: 'no-store',
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Unauthorized. Silakan login kembali.');
                    }
                    
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.error || 
                        `HTTP ${response.status}: ${response.statusText}`
                    );
                }

                const result = await response.json();
                
                if (result.data && Array.isArray(result.data)) {
                    setData(result.data);
                    console.log(`✅ Berhasil memuat ${result.data.length} data usulan lokasi dari Supabase`);
                    console.log('📊 Data:', result.data);
                } else {
                    throw new Error('Format response tidak valid dari API');
                }

            } catch (err: unknown) {
                console.error('❌ Error fetching data:', err);
                
                let errorMessage = "Gagal memuat data aset.";
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                }
                
                setError(errorMessage);
                
                setData([]);
                
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};