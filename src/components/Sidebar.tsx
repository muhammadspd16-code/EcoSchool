import React from 'react';
import { 
  Recycle, 
  User as UserIcon, 
  Scale, 
  FileSpreadsheet, 
  Sparkles, 
  Gift, 
  ShieldCheck,
  BookOpenCheck,
  UserPlus,
  RotateCcw,
  Menu,
  X,
  QrCode,
  Camera
} from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  activeTab: 'siswa' | 'petugas' | 'scanner' | 'sheets' | 'analytics';
  setActiveTab: (tab: 'siswa' | 'petugas' | 'scanner' | 'sheets' | 'analytics') => void;
  totalUsersCount: number;
  totalTransactionsCount: number;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenRegister: () => void;
  onOpenAppSheetGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  totalUsersCount,
  totalTransactionsCount,
  isMobileOpen,
  setIsMobileOpen,
  onOpenRegister,
  onOpenAppSheetGuide,
}) => {
  const navItems = [
    {
      id: 'siswa' as const,
      label: 'Portal Siswa & QR',
      icon: <UserIcon className="w-5 h-5 opacity-90" />,
      badge: 'QR Card'
    },
    {
      id: 'scanner' as const,
      label: 'Scanner QR Siswa',
      icon: <Camera className="w-5 h-5 opacity-90" />,
      badge: 'Kamera'
    },
    {
      id: 'petugas' as const,
      label: 'Setor Sampah',
      icon: <Scale className="w-5 h-5 opacity-90" />,
      badge: 'Timbang'
    },
    {
      id: 'sheets' as const,
      label: 'Database Sheets',
      icon: <FileSpreadsheet className="w-5 h-5 opacity-90" />,
      badge: '4 Tab Live'
    },
    {
      id: 'analytics' as const,
      label: 'Statistik & Peringkat',
      icon: <Sparkles className="w-5 h-5 opacity-90" />,
      badge: 'Adiwiyata'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-emerald-950 text-white flex flex-col flex-shrink-0 
        transition-transform duration-300 ease-in-out border-r border-emerald-900/80
        md:static md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-emerald-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-400 rounded-xl flex items-center justify-center text-emerald-950 font-bold text-xl shadow-md shadow-emerald-400/20">
              E
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block font-display">EcoSchool</span>
              <span className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase block">SMAN 2 Banjarmasin</span>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer text-left ${
                  isActive 
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs' 
                    : 'text-emerald-100/80 hover:bg-emerald-900/70 hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={isActive ? 'text-emerald-300' : 'text-emerald-400'}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-emerald-700 text-emerald-100' 
                      : 'bg-emerald-900/80 text-emerald-300 border border-emerald-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
            Pintasan & Integrasi
          </div>
          
          <button
            onClick={() => {
              onOpenAppSheetGuide();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-emerald-200/90 hover:bg-emerald-900/60 hover:text-white transition-colors text-left text-xs font-medium"
          >
            <BookOpenCheck className="w-4 h-4 text-teal-400" />
            <span>Panduan Google AppSheet</span>
          </button>

          <button
            onClick={() => {
              onOpenRegister();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-emerald-200/90 hover:bg-emerald-900/60 hover:text-white transition-colors text-left text-xs font-medium"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Pendaftaran Siswa Baru</span>
          </button>
        </nav>

        {/* Sidebar Footer Station Card */}
        <div className="p-4 mt-auto">
          <div className="bg-emerald-900/60 rounded-2xl p-4 border border-emerald-800/80 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">Admin Active</p>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </div>
            <p className="text-sm font-semibold text-white">OSIS Central Station</p>
            <p className="text-xs text-emerald-200/70 mt-1">
              {totalUsersCount} Siswa Terdaftar • {totalTransactionsCount} Setoran
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
