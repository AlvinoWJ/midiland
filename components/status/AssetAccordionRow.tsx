import React from 'react';
import { Home, Layers, Calendar, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { UlokEksternal } from '@/lib/types/ulok-eksternal';
import { StatusBadge } from './StatusBadge';
import { AssetDetailContent } from './AssetDetailContent';

interface AssetAccordionRowProps {
    property: UlokEksternal;
    isSelected: boolean;
    onToggle: (id: string) => void;
    onAssetUpdate?: (updatedProperty: UlokEksternal) => void; 
}

export const AssetAccordionRow: React.FC<AssetAccordionRowProps> = ({ property, isSelected, onToggle, onAssetUpdate }) => {
    const { id, kabupaten, provinsi, alamat, status_ulok_eksternal, created_at, bentuk_objek } = property;
    
    const handleUpdateSuccess = (updatedProperty: UlokEksternal) => {
        if (onAssetUpdate) {
            onAssetUpdate(updatedProperty);
        }
    };
    
    const getPropertyIcon = () => {
        switch(bentuk_objek) {
            case 'Ruko': return Building2;
            case 'Tanah': return Layers;
            case 'Gudang': return Home;
            default: return Building2;
        }
    };
    
    const PropertyIcon = getPropertyIcon();
    
    return (
        <div className={`rounded-2xl transition-all duration-300 ${isSelected ? 'shadow-2xl ring-2 ring-rose-500 bg-white' : 'shadow-md bg-white hover:shadow-xl'}`}>
            <button
                onClick={() => onToggle(id)}
                className={`w-full p-5 flex items-center justify-between text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 ${isSelected ? 'bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-2xl' : 'hover:bg-gray-50 rounded-2xl'}`}
            >
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isSelected ? 'bg-gradient-to-br from-rose-500 to-pink-600' : 'bg-gradient-to-br from-gray-600 to-slate-700'}`}>
                        <PropertyIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500 font-medium">
                                {new Date(created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                        <p className="text-base font-bold text-gray-800 truncate">{alamat}</p>
                        <p className="text-sm text-gray-600 truncate">{kabupaten}, {provinsi}</p>
                    </div>
                </div>
                
                <div className="flex-shrink-0 flex flex-col items-end space-y-2 ml-4">
                    <StatusBadge status={status_ulok_eksternal} />
                    <div className={`p-1.5 rounded-full transition-colors ${isSelected ? 'bg-rose-100' : 'bg-gray-100'}`}>
                        {isSelected ? <ChevronUp className="w-5 h-5 text-rose-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                    </div>
                </div>
            </button>
            
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isSelected ? 'max-h-[5000px]' : 'max-h-0'}`}>
                <AssetDetailContent 
                    property={property} 
                    onUpdateSuccess={handleUpdateSuccess} 
                />
            </div>
        </div>
    );
};