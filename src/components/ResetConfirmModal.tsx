import React from 'react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs border border-amber-200">
              <RotateCcw className="w-6 h-6 animate-spin-reverse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Reset / Muat Ulang Data
              </h3>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                Kembalikan Database ke Data Default
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Apakah Anda yakin ingin mereset data?</p>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Tindakan ini akan menyetel ulang semua data siswa, riwayat setoran sampah, poin, dan penukaran hadiah ke kondisi awal bawaan sekolah.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 space-y-1 pl-1">
            <p>✓ Menghapus modifikasi lokal di browser</p>
            <p>✓ Mengembalikan 12 akun siswa default & katalog hadiah</p>
            <p>✓ Menyinkronkan ulang seluruh 4 tabel Google Sheets</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ya, Reset Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
