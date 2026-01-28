
import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass }) => (
  <div className={`rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between group cursor-default ${colorClass}`}>
    <div className="flex items-start justify-between">
      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-current group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase opacity-40">
        Real-Time
      </div>
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{label}</p>
      <p className="text-4xl font-black tracking-tighter leading-none">{value}</p>
    </div>
  </div>
);
