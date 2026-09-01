import React from 'react';
import { 
  Menu, 
  Download, 
  UserPlus, 
  RotateCcw,
  Sparkles,
  Award,
  Camera,
  QrCode,
  Smartphone,
  Cloud,
  Database
} from 'lucide-react';
import { User } from '../types';
import { EcoSchoolLogo } from './EcoSchoolLogo';

interface HeaderProps {
  activeTab: 'siswa' | 'petugas' | 'scanner' | 'sheets' | 'analytics';
  onOpenMobileMenu: () => void;
  onOpenRegister: () => void;
  onOpenScanner: () => void;
  onOpenInstallModal: () => void;
  onResetData: () => void;
  totalWeightKg: string;
  selectedUser: User;
  isCloudConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenRegister,
  onOpenScanner,
  onOpenInstallModal,
  onResetData,
  totalWeightKg,
  selectedUser,
  isCloudConnected = true,
}) => {
  const getTabInfo = () => {
    switch (activeTab) {
      case 'siswa':
        return {
          title: 'Portal Siswa & Dompet Poin',
          subtitle: 'Kartu QR Siswa Digital & Penukaran Hadiah'
        };
      case 'scanner':
        return {
          title: 'Scanner QR Card Siswa',
          subtitle: 'Pemindai Kamera Live Real-Time & Cek Saldo'
        };
      case 'petugas':
        return {
          title: 'Pos Penimbangan & Setor Sampah',
          subtitle: 'Workstation Petugas Bank Sampah OSIS/PMR'
        };
      case 'sheets':
        return {
          title: 'Database Google Sheets (4 Tab)',
          subtitle: 'Live Sync: Users, Log_Transaksi, Katalog_Reward, & Log_Penukaran'
        };
      case 'analytics':
        return {
          title: 'Dashboard Dampak Lingkungan & Peringkat',
          subtitle: 'Monitoring Reduksi CO₂ & Leaderboard Adiwiyata'
        };
      default:
        return {
          title: 'Selamat Datang di EcoSchool',
          subtitle: 'Bank Sampah Digital SMAN 2 Banjarmasin'
        };
    }
  };

  const info = getTabInfo();
  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 sticky top-0 z-20 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <EcoSchoolLogo size={42} variant="icon" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {info.title}
              </h1>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isCloudConnected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <Cloud className="w-3 h-3" />
                <span className="hidden sm:inline">{isCloudConnected ? 'Cloud Online' : 'Offline'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {today} • SMAN 2 Banjarmasin • <span className="text-emerald-700 font-medium">{info.subtitle}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        {/* Metric Highlight */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Total Sampah Terkumpul
          </span>
          <span className="text-sm font-black text-emerald-600 underline underline-offset-4 decoration-2">
            {totalWeightKg} Kg
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Buka Kamera Scanner QR Siswa"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Scanner QR</span>
          </button>

          <button
            onClick={onOpenInstallModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Instal Aplikasi di HP Android"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Instal App di Android</span>
            <span className="sm:hidden">Instal App</span>
          </button>

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Daftar Siswa</span>
            <span className="sm:hidden">+ Siswa</span>
          </button>

          <button
            onClick={onResetData}
            className="p-2 text-slate-500 hover:text-emerald-700 bg-slate-100/80 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Muat Ulang / Reset Data ke Kondisi Awal"
          >
            <RotateCcw className="w-4 h-4 text-slate-600 hover:text-emerald-700" />
            <span className="hidden xl:inline text-xs font-semibold">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
