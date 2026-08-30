import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  CheckCircle2, 
  X, 
  QrCode, 
  Sparkles, 
  ShieldCheck,
  Zap,
  MoreVertical
} from 'lucide-react';
import { EcoSchoolLogo } from './EcoSchoolLogo';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onInstallSuccess: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallSuccess,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onInstallSuccess();
      }
    } else {
      alert('Untuk memasang di Android: Buka Google Chrome > Ketuk titik tiga (⋮) di kanan atas > Pilih "Tambahkan ke Layar Utama" / "Instal Aplikasi".');
    }
  };

  const handleCopyAppUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const currentAppUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentAppUrl)}&color=064e3b`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with Logo */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EcoSchoolLogo size={42} variant="icon" />
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display leading-tight flex items-center gap-2">
                Instal Aplikasi di Android
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  PWA Ready
                </span>
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                Bank Sampah EcoSchool • SMAN 2 Banjarmasin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Main Direct 1-Click Install Button */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 border-2 border-emerald-300/80 rounded-2xl p-5 text-center space-y-3">
            <div className="flex justify-center">
              <EcoSchoolLogo size={72} variant="icon" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Pasang ke Layar Utama HP Android
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                Aplikasi langsung terpasang seperti aplikasi Android native tanpa perlu unduh dari Play Store.
              </p>
            </div>

            <button
              onClick={handleNativeInstall}
              className="w-full py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{deferredPrompt ? 'Instal Sekarang (1-Klik)' : 'Tambahkan ke Layar Utama Android'}</span>
            </button>
          </div>

          {/* Android Step-by-Step Instructions */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              3 Langkah Pasang di Google Chrome Android:
            </h5>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  Buka website ini di browser <strong>Google Chrome</strong> pada smartphone Android Anda.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-slate-700 leading-relaxed flex-1">
                  Ketuk ikon <strong>titik tiga (⋮)</strong> di pojok kanan atas browser Chrome.
                </div>
                <MoreVertical className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  Pilih menu <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong> (<em>Add to Home screen</em>).
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 leading-relaxed">
                  Selesai! Ikon <strong>EcoSchool</strong> akan tampil di HP Anda dengan akses kamera QR & dompet poin.
                </div>
              </div>
            </div>
          </div>

          {/* Scan QR Code to Open on Phone */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
              <img 
                src={qrCodeUrl} 
                alt="QR Code Link Aplikasi" 
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                <QrCode className="w-3 h-3" />
                Buka di HP Anda
              </div>
              <h5 className="text-xs font-bold text-slate-900">
                Scan QR ini untuk Buka di HP
              </h5>
              <p className="text-[11px] text-slate-500 leading-snug">
                Arahkan kamera smartphone ke QR ini untuk langsung membuka dan menginstal di HP siswa / petugas.
              </p>
              <button
                type="button"
                onClick={handleCopyAppUrl}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? '✓ Tautan Disalin!' : 'Salin Tautan Website'}</span>
              </button>
            </div>
          </div>

          {/* Advantages of PWA on Android */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <strong className="block text-slate-800 text-xs">Ringan & Cepat</strong>
              <span className="text-[10px] text-slate-500">Buka instan tanpa lag</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <strong className="block text-slate-800 text-xs">Akses Kamera QR</strong>
              <span className="text-[10px] text-slate-500">Scan kartu langsung di HP</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Mendukung Android (Chrome, Samsung Internet) & iOS
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
