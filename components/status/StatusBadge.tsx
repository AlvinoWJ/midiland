import React from 'react';
import { CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { UlokEksternal } from '@/lib/types/ulok-eksternal';

interface StatusBadgeProps {
    status: UlokEksternal['status_ulok_eksternal'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let colorClass = "bg-gray-100 text-gray-700";
  let text: string;
  let Icon = Clock;

  switch (status) {
    case 'OK':
      colorClass = "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200";
      text = "Aktif Disewa"; 
      Icon = CheckCircle;
      break;
    case 'In Progress':
      colorClass = "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-200";
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

  return (
    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${colorClass}`}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {text}
    </span>
  );
};