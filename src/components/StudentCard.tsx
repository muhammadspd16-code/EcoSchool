import React, { useState, useEffect } from 'react';
import { User, LogTransaksi, LogPenukaran } from '../types';
import { generateQRDataUrl } from '../utils/qrUtils';
import { 
  QrCode, 
  Wallet, 
  Coins, 
  Printer, 
  TrendingUp, 
  Recycle, 
  History, 
  Award,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

interface StudentCardProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  transactions: LogTransaksi[];
  redemptions: LogPenukaran[];
  onGoToDeposit: (user: User) => void;
  onGoToRewards: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  currentUser,
  users,
  onSelectUser,
  transactions,
  redemptions,
  onGoToDeposit,
  onGoToRewards,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Generate QR with standard payload
    const payload = JSON.stringify({
      nisn: currentUser.NISN,
      name: currentUser.Nama_Siswa,
      id: currentUser.UserID,
      app: 'EcoSchool'
    });
    generateQRDataUrl(payload).then(setQrUrl);
  }, [currentUser]);

  // Calculations for current student
  const studentTransactions = transactions.filter(t => t.NISN_Siswa === currentUser.NISN);
  const totalWeightGram = studentTransactions.reduce((sum, t) => sum + t.Berat_Gram, 0);
  const totalWeightKg = (totalWeightGram / 1000).toFixed(1);
  const studentRedemptions = redemptions.filter(r => r.NISN_Siswa === currentUser.NISN);

  const handlePrintCard = () => {
    window.print();
  };

  const handleCopyNISN = () => {
    navigator.clipboard.writeText(currentUser.NISN);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Stat Cards (Sleek Theme Archetype) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Saldo Poin Aktif</div>
          <div className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-baseline gap-1.5">
            {currentUser.Total_Poin.toLocaleString()}
            <span className="text-xs font-bold text-emerald-600 uppercase">Pts</span>
          </div>
          <div className="mt-2 text-emerald-600 text-xs font-medium flex items-center gap-1">
            <span>↑ Siap ditukarkan ke reward</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Sampah Disetor</div>
          <div className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-baseline gap-1.5">
            {totalWeightKg}
            <span className="text-xs font-bold text-slate-500 uppercase">Kg</span>
          </div>
          <div className="mt-2 text-blue-600 text-xs font-medium">
            Dari {studentTransactions.length}x penyetoran
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Kupon & Hadiah Aktif</div>
          <div className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-baseline gap-1.5">
            {studentRedemptions.length}
            <span className="text-xs font-bold text-amber-600 uppercase">Item</span>
          </div>
          <div className="mt-2 text-amber-600 text-xs font-medium">
            Klaim di kantin/koperasi
          </div>
        </div>
      </div>

      {/* Student Selector Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Profil Akun Siswa Aktif
            </div>
            <div className="text-base font-bold text-slate-900">
              {currentUser.Nama_Siswa} <span className="text-slate-400 font-medium">({currentUser.Kelas})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="student-select" className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Ganti Siswa:
          </label>
          <select
            id="student-select"
            value={currentUser.NISN}
            onChange={(e) => {
              const selected = users.find(u => u.NISN === e.target.value);
              if (selected) onSelectUser(selected);
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800 cursor-pointer shadow-2xs"
          >
            {users.map(u => (
              <option key={u.NISN} value={u.NISN}>
                {u.Nama_Siswa} - {u.Kelas} ({u.Total_Poin} Poin)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Digital ID Card & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: The Virtual Digital Student Card */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-emerald-950 text-white p-6 shadow-xl border border-emerald-800/40 flex flex-col justify-between min-h-[380px]">
            {/* Background Glow */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
              <Recycle className="w-32 h-32 text-emerald-400" />
            </div>

            {/* Top Header of Card */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-400/20">
                  E
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight text-white">EcoSchool</h3>
                  <p className="text-[11px] text-emerald-300 font-semibold">SMAN 2 Banjarmasin • Bank Sampah</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700/60 text-emerald-300">
                {currentUser.UserID}
              </span>
            </div>

            {/* Middle Section: QR Code & Student Details */}
            <div className="my-5 grid grid-cols-12 gap-4 items-center relative z-10">
              {/* QR Code Container */}
              <div className="col-span-5 bg-white p-2.5 rounded-2xl shadow-lg border-2 border-emerald-400/60 flex flex-col items-center justify-center">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt={`QR Code ${currentUser.Nama_Siswa}`}
                    className="w-full aspect-square object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400 text-xs">
                    Membuat QR...
                  </div>
                )}
                <span className="text-[9px] font-extrabold text-emerald-900 uppercase tracking-wider mt-1 text-center">
                  Scan Petugas
                </span>
              </div>

              {/* Student Details */}
              <div className="col-span-7 space-y-2 pl-1">
                <div>
                  <div className="text-[10px] text-emerald-300/80 font-bold uppercase tracking-wider">Nama Siswa</div>
                  <div className="text-lg font-extrabold text-white leading-tight truncate">
                    {currentUser.Nama_Siswa}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <div className="text-[10px] text-emerald-300/80 uppercase font-bold">NISN</div>
                    <div className="text-xs font-mono font-bold text-emerald-200">
                      {currentUser.NISN}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-300/80 uppercase font-bold">Kelas</div>
                    <div className="text-xs font-bold text-emerald-200 truncate">
                      {currentUser.Kelas}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Balance Bar */}
            <div className="pt-4 border-t border-emerald-900 flex items-center justify-between relative z-10">
              <div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold">
                  Saldo Dompet Poin
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-2xl font-black text-amber-300 tracking-tight">
                    {currentUser.Total_Poin.toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-200 font-bold">Pts</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyNISN}
                  className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-900/80 hover:bg-emerald-800 text-white rounded-xl border border-emerald-700/60 transition-colors flex items-center gap-1"
                  title="Salin NISN"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Tersalin' : 'NISN'}</span>
                </button>
                <button
                  onClick={handlePrintCard}
                  className="p-2 bg-emerald-900/80 hover:bg-emerald-800 text-white rounded-xl border border-emerald-700/60 transition-colors"
                  title="Cetak Kartu Siswa"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons under Card */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onGoToDeposit(currentUser)}
              className="flex items-center justify-center gap-2 p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all active:scale-95"
            >
              <Recycle className="w-4 h-4" />
              <span>Setor Sampah</span>
            </button>
            <button
              onClick={onGoToRewards}
              className="flex items-center justify-center gap-2 p-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs rounded-2xl shadow-sm transition-all active:scale-95"
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Katalog Hadiah</span>
            </button>
          </div>
        </div>

        {/* Right: Personal Activity & Log History */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-slate-800 text-sm sm:text-base">
                  Riwayat Setoran Siswa
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                {studentTransactions.length} Transaksi
              </span>
            </div>

            <div className="flex-1 overflow-auto max-h-[340px]">
              {studentTransactions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Recycle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold">Belum ada aktivitas penyetoran sampah.</p>
                  <button
                    onClick={() => onGoToDeposit(currentUser)}
                    className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Mulai Setor Sekarang →
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white sticky top-0 shadow-2xs">
                    <tr>
                      <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase">ID Transaksi</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase">Jenis Sampah</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase text-right">Berat</th>
                      <th className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase text-right">Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentTransactions.map((trx) => (
                      <tr key={trx.ID_Transaksi} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-mono text-xs font-bold text-slate-600">{trx.ID_Transaksi}</div>
                          <div className="text-[10px] text-slate-400">{trx.Timestamp}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 inline-block">
                            {trx.Jenis_Sampah}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium text-xs text-slate-600">
                          {trx.Berat_Gram >= 1000 ? `${(trx.Berat_Gram / 1000).toFixed(1)} Kg` : `${trx.Berat_Gram} g`}
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-emerald-600 text-sm">
                          +{trx.Poin_Didapat}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Claimed Vouchers Mini Card if any */}
          {studentRedemptions.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Kupon & Hadiah yang Telah Diklaim ({studentRedemptions.length})</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {studentRedemptions.map(r => (
                  <div key={r.ID_Penukaran} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
                    <span className="font-bold text-slate-800 truncate pr-2">{r.Nama_Item}</span>
                    <span className="font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                      {r.KodeKlaim}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
