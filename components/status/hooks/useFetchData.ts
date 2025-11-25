import { useState, useEffect, useCallback } from "react";
import { UlokEksternal } from '@/lib/types/ulok-eksternal';

export const useFetchData = () => {
    const [data, setData] = useState<UlokEksternal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        const controller = new AbortController();
        const signal = controller.signal;

        try {
            const response = await fetch('/api/usulan_lokasi?limit=100', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store',
                signal: signal 
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.data && Array.isArray(result.data)) {
                setData(result.data);
            } else {
                setData([]);
            }
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') {
                return;
            }

            console.error('Error fetching data:', err);
            let errorMessage = "Gagal memuat data";
            
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }

        return () => controller.abort();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    return { data, loading, error, refetch: fetchData };
};