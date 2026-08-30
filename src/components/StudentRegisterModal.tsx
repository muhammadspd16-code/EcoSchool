import React, { useState } from 'react';
import { User } from '../types';
import { KELAS_X, KELAS_XI, KELAS_XII } from '../data/initialData';
import { 
  UserPlus, 
  X, 
  Sparkles, 
  Check, 
  CreditCard, 
  Phone, 
  GraduationCap, 
  BadgeCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterUser: (newUser: User) => void;
  existingUsers: User[];
}

export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterUser,
  existingUsers,
}) => {
  const [nisn, setNisn] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState('X-1');
  const [noTelepon, setNoTelepon] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisn.trim() || !namaSiswa.trim()) {
      setErrorMsg('NISN dan Nama Lengkap Siswa wajib diisi.');
      return;
    }

    // Check duplicate NISN
    if (existingUsers.some(u => u.NISN === nisn.trim())) {
      setErrorMsg(`Siswa dengan NISN ${nisn} sudah terdaftar sebelumnya.`);
      return;
    }

    // Auto generate next UserID e.g. USR-006
    const nextIdNum = existingUsers.length + 1;
    const formattedId = `USR-${String(nextIdNum).padStart(3, '0')}`;

    const newUser: User = {
      UserID: formattedId,
      NISN: nisn.trim(),
      Nama_Siswa: namaSiswa.trim(),
      Kelas: kelas,
      Total_Poin: 25, // Bonus 25 welcome points!
      No_Telepon: noTelepon.trim() || undefined,
      AvatarColor: 'bg-emerald-500'
    };

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#10b981', '#34d399', '#f59e0b']
    });

    onRegisterUser(newUser);
    onClose();
    setNisn('');
    setNamaSiswa('');
    setNoTelepon('');
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Pendaftaran Anggota Siswa Baru
              </h3>
              <p className="text-xs text-slate-500">
                Buat dompet digital poin & kartu QR EcoSchool
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nomor Induk Siswa Nasional (NISN) *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: 12350 atau 0081234567"
              value={nisn}
              onChange={(e) => {
                setNisn(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nama Lengkap Siswa *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Muhammad Farhan"
              value={namaSiswa}
              onChange={(e) => setNamaSiswa(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kelas
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              >
                <optgroup label="── KELAS X (X-1 s/d X-13) ──">
                  {KELAS_X.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </optgroup>
                <optgroup label="── KELAS XI (XI A1 s/d XI F12) ──">
                  {KELAS_XI.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </optgroup>
                <optgroup label="── KELAS XII (XII A1 s/d XII F12) ──">
                  {KELAS_XII.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                No. WhatsApp (Opsional)
              </label>
              <input
                type="tel"
                placeholder="0812xxxx"
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Bonus Sambutan 25 Poin!</strong> Siswa baru langsung mendapatkan saldo awal 25 poin dan QR Code terverifikasi.
            </span>
          </div>

          <div className="pt-2 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Daftarkan Siswa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
