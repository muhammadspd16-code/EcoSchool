import React from 'react';
import { EcoSchoolLogo } from './EcoSchoolLogo';
import { 
  Recycle, 
  User as UserIcon, 
  Scale, 
  FileSpreadsheet, 
  Sparkles, 
  Gift, 
  ShieldCheck,
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
  onOpenRegister?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  totalUsersCount,
  totalTransactionsCount,
  isMobileOpen,
  setIsMobileOpen,
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
        <div className="p-5 flex items-center justify-between border-b border-emerald-900/50">
          <div className="flex items-center gap-3">
            <EcoSchoolLogo size={42} variant="icon" />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block font-display">
                Eco<span className="text-emerald-400">School</span>
              </span>
              <span className="text-[10px] text-emerald-300 font-bold tracking-wider uppercase block">
                SMAN 2 Banjarmasin
              </span>
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
        </nav>
      </aside>
    </>
  );
};
