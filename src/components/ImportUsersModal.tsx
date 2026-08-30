import React, { useState, useRef } from 'react';
import { User } from '../types';
import { parseUsersCSV } from '../utils/csvImport';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Download, 
  HelpCircle, 
  ClipboardPaste, 
  Search,
  Users
} from 'lucide-react';

interface ImportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingUsers: User[];
  onImportUsers: (newUsers: User[], mode: 'append' | 'replace') => void;
}

export const ImportUsersModal: React.FC<ImportUsersModalProps> = ({
  isOpen,
  onClose,
  existingUsers,
  onImportUsers,
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [previewUsers, setPreviewUsers] = useState<User[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [searchPreview, setSearchPreview] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processRawText = (rawText: string) => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const res = parseUsersCSV(rawText, existingUsers);
      if (!res.success || res.importedUsers.length === 0) {
        setErrorMsg(res.errors.join(', ') || 'Gagal membaca data CSV. Pastikan terdapat kolom NISN & Nama.');
        setPreviewUsers([]);
      } else {
        setPreviewUsers(res.importedUsers);
      }
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan saat memproses data: ' + err.message);
      setPreviewUsers([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileProcess = (selectedFile: File) => {
    setErrorMsg(null);
    setFile(selectedFile);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      processRawText(text);
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca berkas file.');
      setIsProcessing(false);
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handlePasteChange = (text: string) => {
    setPastedText(text);
    if (text.trim().length > 0) {
      processRawText(text);
    } else {
      setPreviewUsers([]);
      setErrorMsg(null);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = 'UserID,NISN,Nama_Siswa,Kelas,Total_Poin\n';
    const sampleRows = [
      'USR-001,12345,Ahmad Fauzi,XII MIPA 3,350',
      'USR-002,12346,Siti Rahmawati,XI IPS 1,520',
      'USR-003,12347,Budi Santoso,X-E1,150',
      'USR-004,12348,Dian Kartika,XI MIPA 2,280',
    ].join('\n');
    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Template_Import_Sheet1_Users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExecuteImport = () => {
    if (previewUsers.length === 0) return;
    onImportUsers(previewUsers, importMode);
    onClose();
    // Reset state
    setFile(null);
    setPastedText('');
    setPreviewUsers([]);
    setErrorMsg(null);
    setSearchPreview('');
  };

  const filteredPreview = searchPreview.trim()
    ? previewUsers.filter(u => 
        u.Nama_Siswa.toLowerCase().includes(searchPreview.toLowerCase()) ||
        u.NISN.includes(searchPreview) ||
        u.Kelas.toLowerCase().includes(searchPreview.toLowerCase()) ||
        u.UserID.toLowerCase().includes(searchPreview.toLowerCase())
      )
    : previewUsers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-emerald-950 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800/90 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Import Data Siswa ke Sheet 1: Users</h3>
              <p className="text-xs text-emerald-300">Unggah berkas CSV atau Salin & Tempel langsung dari Excel / Google Sheets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1.5 rounded-xl hover:bg-emerald-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Instructions and Template Download */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Format Kolom yang Didukung:</p>
                <p className="font-mono text-[11px] text-emerald-800 mt-0.5">
                  UserID, NISN, Nama_Siswa, Kelas, Total_Poin
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mendukung pemisah koma (,), titik-koma (;), atau tab dari Excel.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shrink-0 cursor-pointer shadow-2xs text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template CSV</span>
            </button>
          </div>

          {/* Input Method Switcher */}
          <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveInputTab('upload')}
              className={`pb-2.5 flex items-center gap-1.5 cursor-pointer transition-colors border-b-2 ${
                activeInputTab === 'upload'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Unggah File (.csv)</span>
            </button>

            <button
              onClick={() => setActiveInputTab('paste')}
              className={`pb-2.5 flex items-center gap-1.5 cursor-pointer transition-colors border-b-2 ${
                activeInputTab === 'paste'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <ClipboardPaste className="w-4 h-4" />
              <span>Tempel Teks (Copy-Paste dari Excel/Sheets)</span>
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeInputTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-emerald-500 bg-emerald-50/60'
                  : file
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,text/csv,text/plain"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                {file ? (
                  <div>
                    <p className="text-xs font-bold text-slate-900">{file.name}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB • Klik untuk ganti file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Tarik file CSV ke sini atau <span className="text-emerald-700 underline">Pilih Berkas</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mendukung berkas CSV dengan berapa pun jumlah data siswa (misal 73, 100+ siswa)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Direct Copy Paste */}
          {activeInputTab === 'paste' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 block">
                Salin baris siswa dari Microsoft Excel atau Google Sheets lalu tempel di bawah:
              </label>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => handlePasteChange(e.target.value)}
                placeholder={`Contoh tempel (bisa dengan header atau langsung data):\nUSR-001\t12345\tAhmad Fauzi\tXII MIPA 3\t350\nUSR-002\t12346\tSiti Rahmawati\tXI IPS 1\t520`}
                className="w-full font-mono text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
              />
            </div>
          )}

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* Import Mode Radio Options */}
          {previewUsers.length > 0 && (
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Metode Penggabungan Data:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                    importMode === 'append'
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="importMode"
                    value="append"
                    checked={importMode === 'append'}
                    onChange={() => setImportMode('append')}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold">Tambahkan / Perbarui Data</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Memperbarui data jika NISN sama, menambah jika siswa baru.
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                    importMode === 'replace'
                      ? 'border-amber-500 bg-amber-50/50 text-amber-950 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="mt-0.5 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-amber-900">Ganti Seluruh Data Users ({previewUsers.length} Siswa)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Menimpa seluruh data siswa yang ada saat ini dengan data CSV ini.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Table Preview of Detected Users */}
          {previewUsers.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Total {previewUsers.length} Siswa Terbaca
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Format Valid
                  </span>
                </div>

                {/* Quick search preview filter */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchPreview}
                    onChange={(e) => setSearchPreview(e.target.value)}
                    placeholder="Cari dalam pratinjau..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Scrollable Data Table Preview */}
              <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-2xl shadow-2xs">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200 z-10">
                    <tr>
                      <th className="p-2 border-r border-slate-200 text-center w-12 text-slate-400">No</th>
                      <th className="p-2 border-r border-slate-200 w-24">UserID</th>
                      <th className="p-2 border-r border-slate-200 w-28">NISN</th>
                      <th className="p-2 border-r border-slate-200">Nama Siswa</th>
                      <th className="p-2 border-r border-slate-200 w-28">Kelas</th>
                      <th className="p-2 text-right w-24">Saldo Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPreview.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400">
                          Tidak ada siswa yang cocok dengan pencarian "{searchPreview}".
                        </td>
                      </tr>
                    ) : (
                      filteredPreview.map((u, i) => (
                        <tr key={u.NISN + i} className="hover:bg-slate-50">
                          <td className="p-2 border-r border-slate-100 text-center text-slate-400 font-mono text-[11px]">
                            {i + 1}
                          </td>
                          <td className="p-2 border-r border-slate-100 font-mono text-[11px] text-slate-600">
                            {u.UserID}
                          </td>
                          <td className="p-2 border-r border-slate-100 font-mono text-[11px] text-slate-700">
                            {u.NISN}
                          </td>
                          <td className="p-2 border-r border-slate-100 font-semibold text-slate-900">
                            {u.Nama_Siswa}
                          </td>
                          <td className="p-2 border-r border-slate-100 text-slate-600">
                            {u.Kelas}
                          </td>
                          <td className="p-2 text-right font-bold text-emerald-700">
                            {u.Total_Poin.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Menampilkan {filteredPreview.length} dari {previewUsers.length} siswa</span>
                <span>Seluruh data akan disimpan ke memori database aktif</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            disabled={previewUsers.length === 0 || isProcessing}
            onClick={handleExecuteImport}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Masukkan ({previewUsers.length}) Siswa ke Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
