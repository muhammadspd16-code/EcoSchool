import React from 'react';
import { 
  Menu, 
  BookOpenCheck, 
  UserPlus, 
  RotateCcw,
  Sparkles,
  Award,
  Camera,
  QrCode
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  activeTab: 'siswa' | 'petugas' | 'scanner' | 'sheets' | 'analytics';
  onOpenMobileMenu: () => void;
  onOpenRegister: () => void;
  onOpenScanner: () => void;
  onOpenAppSheetGuide: () => void;
  onResetData: () => void;
  totalWeightKg: string;
  selectedUser: User;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenRegister,
  onOpenScanner,
  onOpenAppSheetGuide,
  onResetData,
  totalWeightKg,
  selectedUser,
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

        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {info.title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {today} • SMAN 2 Banjarmasin • <span className="text-emerald-700 font-medium">{info.subtitle}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
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
            <span>Scanner QR</span>
          </button>

          <button
            onClick={onOpenAppSheetGuide}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
            title="Panduan Google AppSheet"
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Panduan AppSheet</span>
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
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
            title="Reset Data ke Default Lomba"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* User Avatar with initials */}
        <div 
          className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200"
          title={`Siswa Aktif: ${selectedUser.Nama_Siswa} (${selectedUser.Kelas})`}
        >
          <div className="w-9 h-9 rounded-full bg-emerald-100 border-2 border-emerald-500/20 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-xs">
            {selectedUser.Nama_Siswa.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
