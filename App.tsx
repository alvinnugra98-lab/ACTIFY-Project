
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
    const interval = setInterval(loadData, 300000); // Sync every 5 mins
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

  // Sync fullscreen state if user exits via ESC key
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

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

    let message = `*ACTIFY: HR URGENT REPORT*\n`;
    message += `Berikut adalah daftar Acting yang akan segera berakhir:\n\n`;
    
    expiringSoon.forEach((emp, index) => {
      message += `${index + 1}. *${emp.name}*\n`;
      message += `   Dept: ${emp.dept}\n`;
      message += `   End Date: ${emp.endDate}\n\n`;
    });

    message += `Mohon segera diproses untuk perpanjangan atau penyelesaian.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#121212] text-white overflow-hidden selection:bg-[#1DB954] selection:text-black">
      {/* Standalone Header */}
      <nav className="bg-black/80 backdrop-blur-xl border-b border-white/5 px-8 py-5 flex items-center justify-between flex-shrink-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">ACTIFY</h1>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">HR Intelligence Platform</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">Cloud Sync</p>
            <p className="text-xs text-[#1DB954] font-bold">Active • {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900/50 rounded-full p-1 border border-white/5">
            <button 
              onClick={toggleFullscreen}
              className="p-2.5 hover:bg-zinc-800 rounded-full transition-all text-zinc-400 hover:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 9L4 4m0 0l5 0m-5 0l0 5m5 11l5 5m0 0l-5 0m5 0l0-5m-11-5l-5 5m0 0l0-5m0 5l5 0m11-11l5-5m0 0l0 5m0-5l-5 0" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              )}
            </button>
            <button 
              onClick={loadData}
              className={`p-2.5 hover:bg-zinc-800 rounded-full transition-all text-zinc-400 hover:text-white ${loading ? 'animate-spin' : ''}`}
              title="Refresh Data Feed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container - Independent Scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#181818] to-[#121212]">
        <main className="max-w-7xl mx-auto px-8 py-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h2 className="text-6xl font-black text-white tracking-tight italic">Dashboard</h2>
              <p className="text-zinc-500 mt-2 font-medium text-lg tracking-tight">Managing global talent mobility and temporary acting roles.</p>
            </div>
            
            <button 
              onClick={sendWhatsAppBroadcast}
              className="flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(29,185,84,0.4)] group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Broadcast HR Reminder
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <StatCard 
              label="Acting Total" 
              value={stats.total} 
              colorClass="text-white bg-[#282828] border-white/5 hover:bg-[#333333] transition-colors shadow-lg"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <StatCard 
              label="Currently Active" 
              value={stats.active} 
              colorClass="text-[#1DB954] bg-[#282828] border-white/5 hover:bg-[#333333] transition-colors shadow-lg"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              label="Ending Soon" 
              value={stats.expiring} 
              colorClass="text-amber-400 bg-[#282828] border-white/5 hover:bg-[#333333] transition-colors shadow-lg"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard 
              label="Closed Roles" 
              value={stats.expired} 
              colorClass="text-rose-500 bg-[#282828] border-white/5 hover:bg-[#333333] transition-colors shadow-lg"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-3">
              <DeptDistribution data={data} />
            </div>
          </div>

          {/* Table Header Section */}
          <div className="mb-8 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-2 h-10 bg-[#1DB954] rounded-full"></div>
               <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">Tracklist</h3>
             </div>
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Sorting by: Recency</p>
          </div>
          
          <EmployeeTable data={data} />
          
          <footer className="mt-32 py-16 border-t border-white/5 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 opacity-30 grayscale">
                <span className="text-xl font-black italic">ACTIFY MEDIA</span>
                <span className="h-4 w-px bg-white"></span>
                <span className="text-xs font-bold uppercase tracking-widest">Enterprise Talent Solutions</span>
              </div>
              <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.5em] leading-relaxed">
                CONFIDENTIAL DATA • FOR INTERNAL USE ONLY • POWERED BY REAL-TIME CLOUD SYNC
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
