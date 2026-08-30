import React, { useState } from 'react';
import { User, LogTransaksi, WasteType } from '../types';
import { WASTE_TYPES } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  Scale, 
  QrCode, 
  UserCheck, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Package, 
  User as UserIcon, 
  Leaf,
  Camera
} from 'lucide-react';

interface WasteDepositFormProps {
  selectedUser: User | null;
  users: User[];
  onOpenScanner: () => void;
  onSelectUser: (user: User) => void;
  onAddTransaction: (trx: Omit<LogTransaksi, 'ID_Transaksi' | 'Timestamp'>) => void;
}

export const WasteDepositForm: React.FC<WasteDepositFormProps> = ({
  selectedUser,
  users,
  onOpenScanner,
  onSelectUser,
  onAddTransaction,
}) => {
  const [selectedWaste, setSelectedWaste] = useState<WasteType>(WASTE_TYPES[0]);
  const [weightGram, setWeightGram] = useState<number>(500);
  const [officerName, setOfficerName] = useState<string>('OSIS Div. Lingkungan');
  const [notes, setNotes] = useState<string>('');
  const [isSuccessAnim, setIsSuccessAnim] = useState<boolean>(false);

  // Real-time auto-calculated points
  const pointsEarned = Math.round(weightGram * selectedWaste.pointsPerGram);
  const co2SavedKg = ((weightGram / 1000) * selectedWaste.co2Factor).toFixed(2);

  const handleQuickWeightAdd = (addGram: number) => {
    setWeightGram(prev => Math.max(10, prev + addGram));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Silakan pilih atau scan QR Siswa terlebih dahulu.');
      return;
    }
    if (weightGram <= 0) {
      alert('Berat sampah harus lebih dari 0 gram.');
      return;
    }

    // Trigger confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#34d399', '#f59e0b']
    });

    onAddTransaction({
      NISN_Siswa: selectedUser.NISN,
      Jenis_Sampah: selectedWaste.name.split(' (')[0], // e.g. "Botol Plastik"
      Berat_Gram: weightGram,
      Poin_Didapat: pointsEarned,
      Petugas: officerName,
      Catatan: notes || 'Penyetoran via Pos Bank Sampah'
    });

    setIsSuccessAnim(true);
    setTimeout(() => {
      setIsSuccessAnim(false);
      setNotes('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Stat Cards for Workstation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Petugas Aktif</div>
          <div className="text-2xl font-bold text-slate-900">{officerName.split(' ')[0]}</div>
          <div className="mt-2 text-emerald-600 text-xs font-medium">Ready di Pos Timbang</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Kategori Terpilih</div>
          <div className="text-2xl font-bold text-slate-900 truncate">{selectedWaste.name.split(' (')[0]}</div>
          <div className="mt-2 text-blue-600 text-xs font-medium">
            Tarif: {Math.round(selectedWaste.pointsPerGram * 1000)} Pts/Kg
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Estimasi Poin</div>
          <div className="text-2xl font-bold text-slate-900 text-emerald-600">+{pointsEarned} Pts</div>
          <div className="mt-2 text-amber-600 text-xs font-medium">≈ {co2SavedKg} Kg CO₂e Reduksi</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: QR Action Card & Student Verification */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Sleek QR Scanner Card from Sleek Interface theme */}
          <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-emerald-500 rounded-lg">
                  <Camera className="w-4 h-4 text-white" />
                </span>
                <h3 className="text-lg font-bold text-white">Scan QR Siswa</h3>
              </div>
              <p className="text-emerald-100 text-xs mb-5">
                Arahkan kamera ke kartu NISN siswa untuk validasi cepat tanpa mengetik manual.
              </p>
              <button
                type="button"
                onClick={onOpenScanner}
                className="w-full py-3.5 bg-white text-emerald-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-emerald-50 transition-all active:scale-98 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-700" />
                <span>Buka Kamera Scanner</span>
              </button>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-500/50 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Student Status Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Siswa Penyetor</span>
              </div>
              {selectedUser && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  Terverifikasi
                </span>
              )}
            </div>

            {selectedUser ? (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {selectedUser.UserID}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1.5 leading-tight">
                      {selectedUser.Nama_Siswa}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Kelas: <span className="font-bold text-slate-800">{selectedUser.Kelas}</span>
                    </p>
                    <p className="text-xs font-mono text-slate-500">
                      NISN: {selectedUser.NISN}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Saldo Saat Ini</div>
                    <div className="flex items-center gap-1 text-emerald-700 font-black text-lg">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>{selectedUser.Total_Poin}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-medium">
                    Status: <strong className="text-slate-800">Siap Ditimbang</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = users.find(u => u.NISN !== selectedUser.NISN);
                      if (next) onSelectUser(next);
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline font-semibold"
                  >
                    Ganti
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <UserIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">Belum Ada Siswa Dipilih</h4>
                <p className="text-[11px] text-slate-500 mt-1 mb-3">
                  Pindai QR pada kartu atau pilih dari daftar siswa di bawah.
                </p>
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" /> Scan QR
                </button>
              </div>
            )}

            {/* Quick dropdown for manual select */}
            <div>
              <label htmlFor="select-student-deposit" className="text-[11px] font-bold text-slate-500 block mb-1">
                Pilih Manual Dari Database:
              </label>
              <select
                id="select-student-deposit"
                value={selectedUser?.NISN || ''}
                onChange={(e) => {
                  const u = users.find(x => x.NISN === e.target.value);
                  if (u) onSelectUser(u);
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="" disabled>-- Pilih Siswa --</option>
                {users.map(u => (
                  <option key={u.NISN} value={u.NISN}>
                    {u.Nama_Siswa} ({u.Kelas}) - {u.NISN}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Waste Input & Weight Calculation */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            
            {/* Step 1: Select Waste Type */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Pilih Kategori Sampah Terpilah
                </label>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {WASTE_TYPES.length} Kategori Tersedia
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WASTE_TYPES.map(waste => {
                  const isSelected = selectedWaste.id === waste.id;
                  return (
                    <button
                      key={waste.id}
                      type="button"
                      onClick={() => setSelectedWaste(waste)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-snug">
                          {waste.name}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                          {waste.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-emerald-700">
                          {Math.round(waste.pointsPerGram * 1000)} Poin/kg
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Weight Scale Input & Quick Chips */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>2. Masukkan Hasil Timbangan Berat (Gram)</span>
                </label>
                <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {(weightGram / 1000).toFixed(2)} Kg
                </span>
              </div>

              {/* Main Weight Input */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="10"
                    max="100000"
                    step="10"
                    value={weightGram}
                    onChange={(e) => setWeightGram(Number(e.target.value) || 0)}
                    className="w-full text-2xl font-black text-slate-900 bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-2xs"
                    placeholder="Contoh: 500"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 uppercase">
                    Gram
                  </span>
                </div>
              </div>

              {/* Quick Weight Adjuster Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Tambah Cepat:</span>
                {[100, 250, 500, 1000, 2000].map(add => (
                  <button
                    key={add}
                    type="button"
                    onClick={() => handleQuickWeightAdd(add)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    +{add >= 1000 ? `${add / 1000}kg` : `${add}g`}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setWeightGram(500)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800 underline ml-auto font-medium"
                >
                  Reset (500g)
                </button>
              </div>
            </div>

            {/* Step 3: Officer Details & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="officer-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Petugas Validasi (OSIS / PMR)
                </label>
                <select
                  id="officer-select"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="OSIS Div. Lingkungan">OSIS Divisi Lingkungan Hidup</option>
                  <option value="PMR Unit Sekolah">PMR Unit Palang Merah Remaja</option>
                  <option value="Tim Adiwiyata Sekolah">Tim Kader Adiwiyata Sekolah</option>
                  <option value="Petugas Bank Sampah Utama">Petugas Bank Sampah Utama</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Cth: Bersih, botol dipipihkan rapi"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Total Points Calculation Banner & Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Poin Otomatis Didapat:</div>
                  <div className="text-2xl font-black text-emerald-600">
                    +{pointsEarned}{' '}
                    <span className="text-xs font-semibold text-slate-600">Poin EcoSchool</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedUser || weightGram <= 0}
                className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all ${
                  selectedUser && weightGram > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Setoran & Tambah Poin</span>
              </button>
            </div>

            {isSuccessAnim && (
              <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Penyetoran Berhasil Tercatat & Tersimpan di Sheet 2 (Log_Transaksi)!</span>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};
