import React from 'react';
import { LogTransaksi, User } from '../types';
import { 
  CheckCircle2, 
  Printer, 
  X, 
  Recycle, 
  Calendar, 
  User as UserIcon, 
  Scale, 
  Coins, 
  FileText,
  Share2,
  Leaf
} from 'lucide-react';

interface ReceiptModalProps {
  transaction: LogTransaksi | null;
  student: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  student,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="w-5 h-5 text-emerald-300" />
            <span className="font-bold text-sm">Struk Setor Sampah EcoSchool</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Ticket Receipt */}
        <div className="p-5 space-y-4 bg-slate-50/60 font-sans text-xs">
          
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h4 className="font-black text-base text-slate-900 tracking-tight">
              BANK SAMPAH ECOSCHOOL
            </h4>
            <p className="text-[11px] text-slate-500">SMAN 2 Banjarmasin • Unit Adiwiyata</p>
            <div className="font-mono text-[10px] text-slate-400 mt-1 font-bold">
              BUKTI TRANSAKSI: {transaction.ID_Transaksi}
            </div>
          </div>

          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Waktu:</span>
              <span className="font-medium font-mono">{transaction.Timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Siswa:</span>
              <span className="font-bold text-slate-900">{student?.Nama_Siswa || 'Siswa'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">NISN / Kelas:</span>
              <span className="font-mono">{transaction.NISN_Siswa} ({student?.Kelas || '-'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jenis Sampah:</span>
              <span className="font-bold text-slate-800">{transaction.Jenis_Sampah}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Berat Timbangan:</span>
              <span className="font-bold font-mono text-slate-900">{transaction.Berat_Gram} Gram</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Petugas Validasi:</span>
              <span className="font-medium">{transaction.Petugas || 'OSIS/PMR'}</span>
            </div>
          </div>

          <div className="pt-3 border-t-2 border-dashed border-slate-300 flex items-center justify-between bg-emerald-100/70 p-3 rounded-2xl">
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-800">Poin Bertambah</div>
              <div className="text-xs text-slate-600">Saldo Baru: {student?.Total_Poin} Poin</div>
            </div>
            <div className="text-xl font-black text-emerald-700">
              +{transaction.Poin_Didapat} Poin
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400">
            Terima kasih telah menjaga kebersihan & kelestarian lingkungan sekolah! 🌿
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Struk</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
