import React from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Smartphone, 
  Video, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Layers,
  Sparkles,
  Award,
  PlayCircle
} from 'lucide-react';

interface AppSheetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSheetGuideModal: React.FC<AppSheetGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 via-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Panduan Integrasi Google AppSheet & Dokumentasi Lomba
              </h3>
              <p className="text-xs text-emerald-200">
                Langkah membuat aplikasi mobile instan dari 3 Sheet database untuk video dokumentasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          
          {/* Step by Step Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              4 Langkah Mudah Membuat AppSheet dari EcoSchool_Database:
            </h4>

            {/* Step 1 */}
            <div className="flex gap-3.5 items-start p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-900">
                  Buat File Google Sheets Baru
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buka <strong>sheets.google.com</strong>, beri judul spreadsheet <code className="bg-white px-1.5 py-0.5 rounded-md border border-slate-300 font-mono text-emerald-800">EcoSchool_Database</code>, lalu buat 3 Tab: <strong>Users</strong>, <strong>Log_Transaksi</strong>, dan <strong>Katalog_Reward</strong>. Anda bisa menggunakan tombol <em>"Salin Tab Ini"</em> di aplikasi untuk langsung paste header & data awal.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3.5 items-start p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-900">
                  Klik Ekstensi &gt; AppSheet &gt; Create an App
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Di menu bar Google Sheets bagian atas, klik menu <strong>Extensions (Ekstensi)</strong> &gt; <strong>AppSheet</strong> &gt; <strong>Create an app</strong>. AppSheet akan otomatis membaca struktur kolom dan membuat aplikasi mobile fungsional secara instan.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3.5 items-start p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-900">
                  Konfigurasi Fitur Scanner QR & Timbangan
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Di editor AppSheet, atur kolom <code className="bg-white px-1.5 py-0.5 rounded-md border border-slate-300 font-mono text-emerald-800">NISN_Siswa</code> sebagai tipe <strong>Ref (Reference ke tabel Users)</strong> dan aktifkan toggle <strong>Scannable (NFC/QR Barcode)</strong> agar petugas bisa scan kamera langsung.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3.5 items-start p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-900">
                  Input Data Real-Time di Lapangan
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Petugas OSIS/PMR membuka aplikasi AppSheet lewat HP atau tablet saat jadwal bank sampah sekolah. Setiap setoran yang diinput akan langsung masuk otomatis ke sheet <strong>Log_Transaksi</strong> Google Sheets Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Video Checklist Box for Competition */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Video className="w-4 h-4 text-amber-600" />
              <span>Checklist Alur Video Dokumentasi Lomba:</span>
            </div>
            <ul className="text-xs text-amber-800/90 space-y-1.5 list-disc pl-4">
              <li><strong>Alur 1:</strong> Siswa menunjukkan Kartu Digital EcoSchool dengan kode QR unik & saldo dompet poin.</li>
              <li><strong>Alur 2:</strong> Petugas OSIS/PMR memindai QR kartu siswa dan menimbang sampah terpilah (botol/kardus/kertas).</li>
              <li><strong>Alur 3:</strong> Input data berat & jenis sampah -&gt; poin otomatis bertambah di akun siswa.</li>
              <li><strong>Alur 4:</strong> Buka Google Sheets untuk menunjukkan data log masuk secara real-time ke Sheet 2 (Log_Transaksi).</li>
              <li><strong>Alur 5:</strong> Siswa menukarkan akumulasi poin dengan reward (kupon kantin sehat / buku tulis).</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-xs transition-colors"
          >
            Mengerti & Siap Praktikkan
          </button>
        </div>

      </div>
    </div>
  );
};
