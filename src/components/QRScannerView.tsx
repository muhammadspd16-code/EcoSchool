import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { User } from '../types';
import { parseStudentQR } from '../utils/qrUtils';
import { playScanSuccessSound } from '../utils/soundUtils';
import { 
  Camera, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  SwitchCamera, 
  Scale, 
  User as UserIcon, 
  Search, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Zap
} from 'lucide-react';

interface QRScannerViewProps {
  users: User[];
  onSelectStudentForDeposit: (user: User) => void;
  onSelectStudentForWallet: (user: User) => void;
  onOpenRegister: () => void;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({
  users,
  onSelectStudentForDeposit,
  onSelectStudentForWallet,
  onOpenRegister,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const [manualQuery, setManualQuery] = useState<string>('');
  const [isFileScanning, setIsFileScanning] = useState<boolean>(false);
  const [recentScans, setRecentScans] = useState<User[]>([]);

  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerId = 'dedicated-view-qr-reader';

  useEffect(() => {
    let isMounted = true;
    setCameraError(null);

    const initScanner = async () => {
      try {
        await new Promise(r => setTimeout(r, 200));
        const el = document.getElementById(containerId);
        if (!el) return;

        if (qrScannerRef.current) {
          try {
            await qrScannerRef.current.stop();
          } catch {}
        }

        const html5QrCode = new Html5Qrcode(containerId);
        qrScannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: facingMode },
          { fps: 15, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (!isMounted) return;
            handleQrDecoded(decodedText);
          },
          () => {}
        );

        if (isMounted) setIsScanning(true);
      } catch (err: any) {
        console.warn('Scanner init failed:', err);
        if (isMounted) {
          setCameraError(
            'Kamera live tidak dapat dimulai (mungkin browser memblokir izin kamera). Anda tetap dapat mengunggah file foto QR atau memilih siswa langsung di bawah.'
          );
          setIsScanning(false);
        }
      }
    };

    initScanner();

    return () => {
      isMounted = false;
      if (qrScannerRef.current) {
        try {
          qrScannerRef.current.stop().then(() => qrScannerRef.current?.clear()).catch(() => {});
        } catch {}
      }
    };
  }, [facingMode]);

  const handleQrDecoded = (rawText: string) => {
    const parsed = parseStudentQR(rawText);
    if (!parsed || !parsed.nisn) {
      setCameraError('Format QR tidak valid untuk sistem Bank Sampah SMAN 2 Banjarmasin.');
      return;
    }

    const found = users.find(
      u => u.NISN.toLowerCase() === parsed.nisn.toLowerCase() ||
           u.UserID.toLowerCase() === parsed.nisn.toLowerCase()
    );

    if (found) {
      playScanSuccessSound();
      setScannedUser(found);
      setRecentScans(prev => {
        const withoutDuplicate = prev.filter(p => p.NISN !== found.NISN);
        return [found, ...withoutDuplicate].slice(0, 5);
      });
    } else {
      setCameraError(`Siswa dengan NISN/ID "${parsed.nisn}" belum terdaftar.`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFileScanning(true);
    setCameraError(null);

    try {
      const html5QrCode = qrScannerRef.current || new Html5Qrcode(containerId);
      const decodedText = await html5QrCode.scanFile(file, true);
      handleQrDecoded(decodedText);
    } catch {
      setCameraError('Gagal membaca QR Code dari file foto. Pastikan gambar jelas dan tidak buram.');
    } finally {
      setIsFileScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredQuickList = users.filter(u => 
    u.Nama_Siswa.toLowerCase().includes(manualQuery.toLowerCase()) ||
    u.NISN.includes(manualQuery) ||
    u.Kelas.toLowerCase().includes(manualQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 mb-3 border border-white/10">
            <QrCode className="w-3.5 h-3.5" />
            <span>Fitur Scanner QR Siswa Aktif • SMAN 2 Banjarmasin</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
            Scanner QR Card Siswa
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Arahkan kamera ke QR Code pada kartu fisik / kartu digital siswa untuk verifikasi identitas, cek saldo poin, dan langsung proses timbang setor sampah.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Camera Scanner */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Kamera Live Scanner
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Mode deteksi otomatis real-time
                  </p>
                </div>
              </div>

              {/* Facing mode toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="Ganti Kamera Depan/Belakang"
                >
                  <SwitchCamera className="w-4 h-4" />
                  <span className="hidden sm:inline">Putar Kamera</span>
                </button>
              </div>
            </div>

            {/* Camera Viewport */}
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center border-2 border-slate-800 shadow-inner">
              <div id={containerId} className="w-full h-full min-h-[300px]" />

              {/* Visual Scanning Animation Overlay */}
              {isScanning && !cameraError && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-56 h-56 border-2 border-emerald-400/90 rounded-2xl relative shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400" />
                    <div className="absolute bottom-2 inset-x-0 text-center">
                      <span className="text-[10px] bg-slate-900/80 text-emerald-300 font-mono px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Posisikan QR di dalam kotak
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/95 text-white p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                  <p className="text-xs text-slate-200 max-w-sm leading-relaxed">
                    {cameraError}
                  </p>
                  <button
                    type="button"
                    onClick={() => setFacingMode(prev => prev)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Coba Ulang Kamera</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload image alternative */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isFileScanning}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>{isFileScanning ? 'Sedang Membaca Gambar...' : 'Scan dari Foto / Galeri Gambar QR'}</span>
              </button>

              <span className="text-xs text-slate-400">
                Otomatis berbunyi bip saat QR terbaca
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Scanned Result Card & Instant Navigation */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Result Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <CheckCircle2 className={`w-5 h-5 ${scannedUser ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span>Hasil Pindai Siswa</span>
              </h3>
              {scannedUser && (
                <button
                  type="button"
                  onClick={() => setScannedUser(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            {scannedUser ? (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-scale-up">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-600/20 flex-shrink-0">
                    {scannedUser.Nama_Siswa.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                      Terverifikasi SMAN 2 Banjarmasin
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1 leading-tight">
                      {scannedUser.Nama_Siswa}
                    </h4>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">
                      NISN: {scannedUser.NISN} • Kelas: <strong className="text-slate-800">{scannedUser.Kelas}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-emerald-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Saldo Poin Dompet:</span>
                  <span className="text-base font-black text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    {scannedUser.Total_Poin.toLocaleString()} Poin
                  </span>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onSelectStudentForDeposit(scannedUser)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Scale className="w-4 h-4" />
                    <span>Lanjut Timbang & Setor Sampah</span>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectStudentForWallet(scannedUser)}
                    className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-slate-500" />
                    <span>Buka Kartu Siswa & Tukar Hadiah</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-10 px-4 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Belum ada QR terdeteksi</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-1">
                    Silakan scan QR Card siswa menggunakan kamera di sebelah kiri atau pilih siswa pada daftar cepat di bawah.
                  </p>
                </div>
              </div>
            )}

            {/* Quick 1-Click Simulation / Instant Search */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Simulasi 1-Klik Siswa:
                </span>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  + Tambah Siswa Baru
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, NISN, atau kelas..."
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                {filteredQuickList.map((u) => (
                  <button
                    key={u.NISN}
                    type="button"
                    onClick={() => {
                      playScanSuccessSound();
                      setScannedUser(u);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      scannedUser?.NISN === u.NISN 
                        ? 'bg-emerald-50 border-emerald-300' 
                        : 'bg-white hover:bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{u.Nama_Siswa}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        NISN: {u.NISN} • <span className="font-semibold text-slate-700">{u.Kelas}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700">{u.Total_Poin} Pts</span>
                      <span className="block text-[9px] text-slate-400">Pilih &gt;</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
