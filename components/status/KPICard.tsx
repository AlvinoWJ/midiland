import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: number | string;
    Icon: React.ElementType | LucideIcon;
    color: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, Icon, color }) => (
    <div className={`p-6 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-start justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5`}>
        <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <p className="text-4xl font-extrabold text-gray-900 leading-none">{value}</p>
        </div>
        <div className={`p-3 rounded-xl w-fit ${color} bg-opacity-10 self-start`}>
            <Icon className={`w-11   h-11 ${color}`} />
        </div>
        
    </div>
);