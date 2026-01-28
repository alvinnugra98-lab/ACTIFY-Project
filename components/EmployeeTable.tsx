
import React, { useState } from 'react';
import { EmployeeActingData, ActingStatus } from '../types';

interface EmployeeTableProps {
  data: EmployeeActingData[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ data }) => {
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredData = data.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(filter.toLowerCase()) || 
                         emp.dept.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sendSingleWA = (emp: EmployeeActingData) => {
    const formattedDate = new Date(emp.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const message = `Halo Tim HR, reminder untuk masa Acting Karyawan: *${emp.name}* (${emp.dept}) yang akan berakhir pada *${formattedDate}*. Mohon segera diproses.`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const getStatusBadge = (emp: EmployeeActingData) => {
    switch (emp.status) {
      case ActingStatus.ACTIVE:
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30">Active</span>;
      case ActingStatus.EXPIRING_SOON:
        return (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-400 border border-amber-400/30">Expiring</span>
            <button 
              onClick={() => sendSingleWA(emp)}
              className="p-1.5 hover:bg-amber-400/10 rounded-lg text-amber-400 transition-colors"
              title="Send WA Reminder"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          </div>
        );
      case ActingStatus.EXPIRED:
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/20 text-rose-500 border border-rose-500/30">Expired</span>;
    }
  };

  return (
    <div className="bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800">
      <div className="p-6 bg-zinc-900 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative group flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            placeholder="Search employees or depts..."
            className="block w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-transparent focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] rounded-xl text-sm text-white placeholder-zinc-500 transition-all outline-none font-medium"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Filter By</span>
           <select 
            className="px-4 py-2.5 bg-zinc-800 border-none focus:ring-2 focus:ring-[#1DB954] rounded-xl text-sm text-zinc-300 font-bold outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value={ActingStatus.ACTIVE}>Active Only</option>
            <option value={ActingStatus.EXPIRING_SOON}>Ending Soon</option>
            <option value={ActingStatus.EXPIRED}>Archived/Expired</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">#</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Talent Name</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Dept</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Position</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">End Date</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {filteredData.map((emp, idx) => (
              <tr key={idx} className="group hover:bg-white/5 transition-all duration-200">
                <td className="px-8 py-5 text-sm font-bold text-zinc-600 group-hover:text-zinc-400">{emp.no}</td>
                <td className="px-8 py-5">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-[#1DB954] transition-colors">{emp.name}</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">Certified Professional</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-sm text-zinc-400 font-medium">{emp.dept}</td>
                <td className="px-8 py-5 text-sm italic text-zinc-500 group-hover:text-zinc-300 transition-colors font-medium">"{emp.position}"</td>
                <td className="px-8 py-5 text-sm font-bold text-zinc-400">
                   {new Date(emp.endDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-8 py-5">
                  {getStatusBadge(emp)}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-40">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p className="text-sm font-black uppercase tracking-widest">No talent found in this tracklist</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
