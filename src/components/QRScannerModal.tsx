import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { User } from '../types';
import { parseStudentQR } from '../utils/qrUtils';
import { playScanSuccessSound } from '../utils/soundUtils';
import { 
  Camera, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Sparkles,
  QrCode,
  Zap,
  Upload,
  SwitchCamera,
  Scale,
  CreditCard
} from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (user: User) => void;
  users: User[];
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  users,
}) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [isFileScanning, setIsFileScanning] = useState<boolean>(false);
  
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scannerContainerId = 'reader-modal-container';

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      setScannedUser(null);
      return;
    }

    let isMounted = true;
    setCameraError(null);
    setManualError(null);
    setScannedUser(null);

    const startCamera = async () => {
      try {
        await new Promise(res => setTimeout(res, 250));
        const el = document.getElementById(scannerContainerId);
        if (!el) return;

        if (qrScannerRef.current) {
          try {
            await qrScannerRef.current.stop();
          } catch {}
        }

        const html5QrCode = new Html5Qrcode(scannerContainerId);
        qrScannerRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: { width: 220, height: 220 },
        };

        await html5QrCode.start(
          { facingMode: facingMode },
          config,
          (decodedText) => {
            if (!isMounted) return;
            handleDecodedText(decodedText);
          },
          () => {}
        );
        if (isMounted) setIsScanning(true);
      } catch (err: any) {
        console.warn('Camera start error:', err);
        if (isMounted) {
          setCameraError(
            'Kamera tidak dapat diakses atau izin belum diberikan. Anda dapat mengunggah file foto QR, mencari manual, atau menggunakan simulasi 1-klik di bawah.'
          );
          setIsScanning(false);
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      stopScanner();
    };
  }, [isOpen, facingMode]);

  const stopScanner = () => {
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current
          .stop()
          .then(() => qrScannerRef.current?.clear())
          .catch(() => {});
      } catch {}
    }
  };

  const handleDecodedText = (text: string) => {
    const parsed = parseStudentQR(text);
    if (!parsed || !parsed.nisn) {
      setCameraError('Format QR Code tidak dikenali sebagai Kartu Siswa EcoSchool.');
      return;
    }

    const matchedUser = users.find(
      u => u.NISN.toLowerCase() === parsed.nisn.toLowerCase() ||
           u.UserID.toLowerCase() === parsed.nisn.toLowerCase()
    );

    if (matchedUser) {
      playScanSuccessSound();
      stopScanner();
      setScannedUser(matchedUser);
    } else {
      setCameraError(`Siswa dengan NISN "${parsed.nisn}" tidak ditemukan dalam database.`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFileScanning(true);
    setCameraError(null);

    try {
      const html5QrCode = qrScannerRef.current || new Html5Qrcode(scannerContainerId);
      const decodedText = await html5QrCode.scanFile(file, true);
      handleDecodedText(decodedText);
    } catch (err) {
      setCameraError('Tidak dapat membaca QR Code dari file gambar yang diunggah. Pastikan gambar jelas.');
    } finally {
      setIsFileScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const matched = users.find(
      u => u.NISN === manualInput.trim() || 
           u.Nama_Siswa.toLowerCase().includes(manualInput.trim().toLowerCase()) ||
           u.UserID.toLowerCase() === manualInput.trim().toLowerCase()
    );

    if (matched) {
      playScanSuccessSound();
      stopScanner();
      setScannedUser(matched);
    } else {
      setManualError(`Siswa dengan kata kunci "${manualInput}" tidak ditemukan.`);
    }
  };

  const handleQuickSelect = (user: User) => {
    playScanSuccessSound();
    stopScanner();
    setScannedUser(user);
  };

  const handleConfirmAction = () => {
    if (scannedUser) {
      onScanSuccess(scannedUser);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight flex items-center gap-2">
                Scanner QR Siswa
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SMAN 2 Banjarmasin
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Pindai QR kartu siswa digital secara otomatis & real-time
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Result view if scanned */}
          {scannedUser ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                {scannedUser.Nama_Siswa.charAt(0)}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  QR Siswa Terverifikasi
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-2">
                  {scannedUser.Nama_Siswa}
                </h4>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  NISN: {scannedUser.NISN} • Kelas: {scannedUser.Kelas}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-emerald-200 text-xs font-bold text-emerald-700 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Saldo: {scannedUser.Total_Poin.toLocaleString()} Poin
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Scale className="w-4 h-4" />
                  <span>Pilih Siswa Ini</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setScannedUser(null);
                    setFacingMode(prev => prev);
                  }}
                  className="px-4 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Scan Ulang
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Real Camera Viewfinder Container */}
              <div className="relative bg-slate-950 rounded-2xl overflow-hidden min-h-[220px] flex items-center justify-center border-2 border-slate-800">
                <div id={scannerContainerId} className="w-full h-full min-h-[220px]" />

                {/* Visual Scan Grid Overlay with Green Line Animation */}
                {isScanning && !cameraError && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-emerald-400/90 rounded-2xl relative shadow-2xl">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400" />
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div className="absolute inset-0 bg-slate-900/90 text-white p-5 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                    <p className="text-xs text-slate-200 max-w-xs">{cameraError}</p>
                  </div>
                )}
              </div>

              {/* Camera Controls & File Upload */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  title="Ganti Kamera Depan / Belakang"
                >
                  <SwitchCamera className="w-3.5 h-3.5 text-slate-600" />
                  <span>Putar Kamera</span>
                </button>

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
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isFileScanning ? 'Membaca...' : 'Unggah Foto QR'}</span>
                </button>
              </div>

              {/* Quick Simulation Shortcuts */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    Simulasi Scan Cepat Siswa (1-Klik):
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {users.length} Siswa
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {users.map(u => (
                    <button
                      key={u.NISN}
                      onClick={() => handleQuickSelect(u)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-emerald-100/80 border border-emerald-200/70 text-left transition-all group shadow-2xs cursor-pointer"
                    >
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-900">
                          {u.Nama_Siswa}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {u.NISN} • {u.Kelas}
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Input Form */}
              <form onSubmit={handleManualSubmit} className="space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  Atau Cari Siswa Manual (NISN / Nama):
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Ketik NISN (cth: 12345) atau Nama..."
                      value={manualInput}
                      onChange={(e) => {
                        setManualInput(e.target.value);
                        setManualError(null);
                      }}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer"
                  >
                    Pilih
                  </button>
                </div>
                {manualError && (
                  <p className="text-xs text-rose-600 font-medium">{manualError}</p>
                )}
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
