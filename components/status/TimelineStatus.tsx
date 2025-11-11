import React from 'react';
import { Briefcase, CheckCircle, Clock, MinusCircle } from 'lucide-react';
import { UlokEksternal, TimelineStep } from '@/lib/types/ulok-eksternal';
import { getTimelineById, generateDefaultTimeline } from '@/components/status/hooks/useFetchData';

interface TimelineStatusProps {
    property: UlokEksternal | null;
    assetName: string | undefined;
}

export const TimelineStatus: React.FC<TimelineStatusProps> = ({ property, assetName }) => {
    if (!property) {
      return (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Briefcase className="w-8 h-8 text-rose-500" />
            </div>
            <p className="font-bold text-gray-700 mb-2">Pilih Aset</p>
            <p className="text-sm text-gray-500 px-4">Klik salah satu aset untuk melihat progres pengajuan</p>
        </div>
      );
    }
    
    let currentTimeline = getTimelineById(property.id);
    
    if (currentTimeline.length === 0) {
        currentTimeline = generateDefaultTimeline(property);
        console.log(`📋 Generated timeline for ${property.id} based on status: ${property.status_ulok_eksternal}`);
    } else {
        console.log(`📋 Using dummy timeline for ${property.id}`);
    }
    
    if (currentTimeline.length === 0) {
        return (
            <div className="text-gray-500 text-center py-8">
                <p className="font-semibold mb-2">Riwayat progres tidak tersedia</p>
            </div>
        );
    }

    const getStatusClasses = (status: TimelineStep['status']) => {
        switch (status) {
        case 'completed':
            return { Icon: CheckCircle, color: "bg-gradient-to-br from-green-500 to-emerald-600", ring: "ring-green-200"}; 
        case 'in-progress':
            return { Icon: Clock, color: "bg-gradient-to-br from-amber-500 to-orange-600", ring: "ring-orange-200"}; 
        case 'pending':
            return { Icon: MinusCircle, color: "bg-gradient-to-br from-gray-300 to-gray-400", ring: "ring-gray-200"};
        default:
            return { Icon: Clock, color: "bg-gradient-to-br from-gray-300 to-gray-400", ring: "ring-gray-200"};
        }
    };

    return (
        <div className="flow-root">
            <div className="mb-6 p-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                <p className="text-xs font-medium text-gray-600">Aset Terpilih</p>
                <p className="text-sm font-bold text-gray-800 mt-1">{assetName}</p>
            </div>
            <ul role="list" className="space-y-6">
                {currentTimeline.map((item, index) => {
                const { Icon, color, ring } = getStatusClasses(item.status);
                const isLast = index === currentTimeline.length - 1;
                const isCompleted = item.status === 'completed';
                const isInProgress = item.status === 'in-progress';

                return (
                    <li key={index}>
                    <div className="relative">
                        {!isLast && (
                        <span className="absolute top-10 left-4 -ml-px h-full w-0.5 bg-gradient-to-b from-gray-300 to-gray-200" aria-hidden="true" />
                        )}
                        <div className="relative flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <span className={`h-8 w-8 rounded-xl flex items-center justify-center ring-4 ${ring} ${color} shadow-lg`}>
                            <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className={`p-3 rounded-xl ${isInProgress ? 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200' : isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                                <p className={`text-sm font-bold ${isInProgress ? 'text-orange-700' : isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                                    {item.step}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">{item.details}</p>
                                {item.linkText && (
                                    <a href={item.linkUrl || "#"} className="text-xs text-rose-600 font-semibold hover:text-rose-800 transition mt-2 inline-block">
                                        {item.linkText} →
                                    </a>
                                )}
                            </div>
                        </div>
                        </div>
                    </div>
                    </li>
                );
                })}
            </ul>
        </div>
    );
};