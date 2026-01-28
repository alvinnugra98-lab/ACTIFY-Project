
import React, { useEffect, useState, useCallback } from 'react';
import { EmployeeActingData, ActingStatus } from './types';
import { fetchActingData } from './services/dataService';
import { StatCard } from './components/StatCard';
import { EmployeeTable } from './components/EmployeeTable';
import { DeptDistribution } from './components/DeptDistribution';

const App: React.FC = () => {
  const [data, setData] = useState<EmployeeActingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = useCallback(async () => {
    setLoading(true);
    const actingData = await fetchActingData();
    setData(actingData);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 300000);
    return () => clearInterval(interval);
  }, [loadData]);

  const stats = {
    total: data.length,
    active: data.filter(d => d.status === ActingStatus.ACTIVE).length,
    expiring: data.filter(d => d.status === ActingStatus.EXPIRING_SOON).length,
    expired: data.filter(d => d.status === ActingStatus.EXPIRED).length,
  };

  const sendWhatsAppBroadcast = () => {
    const expiringSoon = data.filter(d => d.status === ActingStatus.EXPIRING_SOON);
    if (expiringSoon.length === 0) {
      alert("Tidak ada karyawan dengan status Expiring Soon saat ini.");
      return;
    }

    let message = `*REMINDER: ACTIFY HR REPORT*\n`;
    message += `Halo Tim HR, berikut daftar karyawan dengan masa Acting yang akan segera berakhir (Expiring Soon):\n\n`;
    
    expiringSoon.forEach((emp, index) => {
      message += `${index + 1}. *${emp.name}*\n`;
      message += `   Dept: ${emp.dept}\n`;
      message += `   End Date: ${emp.endDate}\n\n`;
    });

    message += `Mohon segera ditindaklanjuti. Terima kasih.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-[#1DB954] selection:text-black">
      {/* Premium Navbar - Logo Removed */}
      <nav className="bg-black/60 backdrop-blur-xl border-b border-white/5 px-8 py-5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">ACTIFY</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest -mt-1">Talent Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:block text-right">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Live Feed</p>
              <p className="text-xs text-zinc-300 font-medium tracking-tight">Updated {lastUpdated.toLocaleTimeString()}</p>
            </div>
            <button 
              onClick={loadData}
              className="group relative flex items-center justify-center p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all duration-300 active:scale-95"
              title="Refresh Feed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-white ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-10">
        {/* Header Hero */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Dashboard</h2>
            <p className="text-zinc-400 mt-1 font-medium italic">Monitoring talent mobility and acting roles</p>
          </div>
          
          <button 
            onClick={sendWhatsAppBroadcast}
            className="flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_-5px_rgba(29,185,84,0.4)]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Broadcast to HR
          </button>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            label="Total Talent" 
            value={stats.total} 
            colorClass="text-white bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatCard 
            label="Active Hits" 
            value={stats.active} 
            colorClass="text-[#1DB954] bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 shadow-[0_4px_20px_-10px_rgba(29,185,84,0.3)]"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard 
            label="Ending Soon" 
            value={stats.expiring} 
            colorClass="text-amber-400 bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 shadow-[0_4px_20px_-10px_rgba(251,191,36,0.3)]"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard 
            label="Expired" 
            value={stats.expired} 
            colorClass="text-rose-500 bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 shadow-[0_4px_20px_-10px_rgba(244,63,94,0.3)]"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* Analytics Section */}
        <div className="mb-12">
          <DeptDistribution data={data} />
        </div>

        {/* List Section */}
        <div className="mb-6 flex items-center justify-between">
           <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic underline decoration-[#1DB954] decoration-4 underline-offset-8">The Tracklist</h3>
        </div>
        <EmployeeTable data={data} />
        
        <footer className="mt-20 py-10 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic opacity-50">© 2024 ACTIFY MEDIA CORP. DATA SYNC ENABLED.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
