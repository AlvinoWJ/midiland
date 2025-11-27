import React from 'react';
import { CheckCircle, Clock, XCircle, FileText, HelpCircle } from 'lucide-react';
import { UlokEksternal } from '@/lib/types/ulok-eksternal';

interface StatusBadgeProps {
    status: UlokEksternal['status_ulok_eksternal'];
    kplt_approval?: string | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, kplt_approval }) => {
  let colorClass = "bg-gray-100 text-gray-700";
  let text: string = status;
  let Icon = HelpCircle;

  const kplt = kplt_approval ? kplt_approval.toLowerCase() : '';

  if (kplt) {
      if (['approved', 'disetujui', 'ok'].includes(kplt)) {
          colorClass = "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200";
          text = "Disetujui"; 
          Icon = CheckCircle;
      }
      else if (kplt.includes('reject') || kplt.includes('tolak') || kplt.includes('nok')) {
          colorClass = "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200";
          text = "Ditolak (KPLT)";
          Icon = XCircle;
      }
      else {
          colorClass = "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200";
          text = "Review KPLT";
          Icon = Clock;
      }
  } 
  else {
      switch (status) {
        case 'OK':
          colorClass = "bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-200";
          text = "Menunggu Rapat Internal"; 
          Icon = Clock;
          break;
        case 'In Progress':
          colorClass = "bg-gradient-to-r from-gray-500 to-gray-500 text-white shadow-lg shadow-gray-200";
          text = "Dalam Proses";
          Icon = Clock;
          break;
        case 'Rejected':
          colorClass = "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200";
          text = "Ditolak";
          Icon = XCircle;
          break;
        case 'Draft':
          colorClass = "bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg shadow-slate-200";
          text = "Draft";
          Icon = FileText;
          break;
        default:
          text = status;
          break;
      }
  }

  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${colorClass}`}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {text}
    </span>
  );
};