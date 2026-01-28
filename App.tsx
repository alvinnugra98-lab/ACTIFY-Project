
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
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

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
    <div className="h-screen w-full flex flex-col bg-[#121212] text-white overflow-hidden selection:bg-[#1DB954] selection:text-black">
      {/* Immersive Header */}
      <nav className="bg-black border-b border-white/5 px-8 py-5 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">ACTIFY</h1>
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-1">Talent Management System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:block text-right">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Database Status</p>
            <p className="text-xs text-[#1DB954] font-bold">Online • {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 rounded-full p-1 border border-white/5">
            <button 
              onClick={toggleFullscreen}
              className="p-2 hover:bg-zinc-800 rounded-full transition-all text-zinc-400 hover:text-white"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9L4 4m0 0l5 0m-5 0l0 5m5 11l5 5m0 0l-5 0m5 0l0-5m-11-5l-5 5m0 0l0-5m0 5l5 0m11-11l5-5m0 0l0 5m0-5l-5 0" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              )}
            </button>
            <button 
              onClick={loadData}
              className={`p-2 hover:bg-zinc-800 rounded-full transition-all text-zinc-400 hover:text-white ${loading ? 'animate-spin' : ''}`}
              title="Refresh Data"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area - Separately Scrollable */}
      <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
        <main className="max-w-7xl mx-auto px-8 py-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-5xl font-black text-white tracking-tight">Executive Feed</h2>
              <p className="text-zinc-500 mt-2 font-medium text-lg italic tracking-tight">Tracking temporary talent assignments in real-time</p>
            </div>
            
            <button 
              onClick={sendWhatsAppBroadcast}
              className="flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_15px_30px_-10px_rgba(29,185,84,0.5)] group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Broadcast HR Reminder
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
              label="Acting Total" 
              value={stats.total} 
              colorClass="text-white bg-[#181818] border-white/5 hover:bg-zinc-800 transition-colors"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <StatCard 
              label="Playing Now" 
              value={stats.active} 
              colorClass="text-[#1DB954] bg-[#181818] border-white/5 hover:bg-zinc-800 transition-colors"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              label="Ending Soon" 
              value={stats.expiring} 
              colorClass="text-amber-400 bg-[#181818] border-white/5 hover:bg-zinc-800 transition-colors"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              label="Archived" 
              value={stats.expired} 
              colorClass="text-rose-500 bg-[#181818] border-white/5 hover:bg-zinc-800 transition-colors"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-3">
              <DeptDistribution data={data} />
            </div>
          </div>

          <div className="mb-8 flex items-center justify-between">
             <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic border-l-4 border-[#1DB954] pl-4">The Tracklist</h3>
          </div>
          <EmployeeTable data={data} />
          
          <footer className="mt-24 py-12 border-t border-white/5 text-center">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">© 2024 ACTIFY MEDIA GLOBAL • ENTERPRISE EDITION</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
