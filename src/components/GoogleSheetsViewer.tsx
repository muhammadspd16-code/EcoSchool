import React, { useState } from 'react';
import { User, LogTransaksi, RewardItem, LogPenukaran } from '../types';
import { 
  downloadCSV, 
  generateUsersCSV, 
  generateTransactionsCSV, 
  generateRewardsCSV, 
  generateRedemptionsCSV,
  copyTableToClipboard 
} from '../utils/exportUtils';
import { 
  FileSpreadsheet, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Sparkles,
  Table as TableIcon,
  FileDown,
  Trash2,
  AlertTriangle,
  X,
  QrCode
} from 'lucide-react';
import { downloadStudentQRBadge } from '../utils/downloadCard';

interface GoogleSheetsViewerProps {
  users: User[];
  transactions: LogTransaksi[];
  rewards: RewardItem[];
  redemptions: LogPenukaran[];
  onOpenInstallModal?: () => void;
  onDeleteUser?: (userId: string) => void;
  onDeleteTransaction?: (trxId: string) => void;
  onDeleteReward?: (rewardId: string) => void;
  onDeleteRedemption?: (redemptionId: string) => void;
  onClearSheet?: (sheetName: 'Users' | 'Log_Transaksi' | 'Katalog_Reward' | 'Log_Penukaran') => void;
}

export const GoogleSheetsViewer: React.FC<GoogleSheetsViewerProps> = ({
  users,
  transactions,
  rewards,
  redemptions,
  onOpenInstallModal,
  onDeleteUser,
  onDeleteTransaction,
  onDeleteReward,
  onDeleteRedemption,
  onClearSheet,
}) => {
  const [activeSheet, setActiveSheet] = useState<'Users' | 'Log_Transaksi' | 'Katalog_Reward' | 'Log_Penukaran'>('Users');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modal confirmation state for deletion
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'single' | 'all';
    sheet: 'Users' | 'Log_Transaksi' | 'Katalog_Reward' | 'Log_Penukaran';
    id?: string;
    label?: string;
  }>({
    isOpen: false,
    type: 'single',
    sheet: 'Users',
  });

  const handleCopyClipboard = async () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];

    if (activeSheet === 'Users') {
      headers = ['UserID', 'NISN', 'Nama_Siswa', 'Kelas', 'Total_Poin'];
      rows = users.map(u => [u.UserID, u.NISN, u.Nama_Siswa, u.Kelas, u.Total_Poin]);
    } else if (activeSheet === 'Log_Transaksi') {
      headers = ['ID_Transaksi', 'Timestamp', 'NISN_Siswa', 'Jenis_Sampah', 'Berat_Gram', 'Poin_Didapat'];
      rows = transactions.map(t => [t.ID_Transaksi, t.Timestamp, t.NISN_Siswa, t.Jenis_Sampah, t.Berat_Gram, t.Poin_Didapat]);
    } else if (activeSheet === 'Katalog_Reward') {
      headers = ['RewardID', 'Nama_Item', 'Poin_Dibutuhkan'];
      rows = rewards.map(r => [r.RewardID, r.Nama_Item, r.Poin_Dibutuhkan]);
    } else {
      headers = ['ID_Penukaran', 'Timestamp', 'NISN_Siswa', 'Nama_Siswa', 'RewardID', 'Nama_Item', 'Poin_Dipakai', 'Status', 'KodeKlaim'];
      rows = redemptions.map(r => [r.ID_Penukaran, r.Timestamp, r.NISN_Siswa, r.Nama_Siswa, r.RewardID, r.Nama_Item, r.Poin_Dipakai, r.Status, r.KodeKlaim]);
    }

    await copyTableToClipboard(headers, rows);
    setCopiedTab(activeSheet);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const handleDownloadActiveCSV = () => {
    if (activeSheet === 'Users') {
      downloadCSV('EcoSchool_Database_Users.csv', generateUsersCSV(users));
    } else if (activeSheet === 'Log_Transaksi') {
      downloadCSV('EcoSchool_Database_Log_Transaksi.csv', generateTransactionsCSV(transactions));
    } else if (activeSheet === 'Katalog_Reward') {
      downloadCSV('EcoSchool_Database_Katalog_Reward.csv', generateRewardsCSV(rewards));
    } else {
      downloadCSV('EcoSchool_Database_Log_Penukaran.csv', generateRedemptionsCSV(redemptions));
    }
  };

  const handleDownloadAllCSVs = () => {
    downloadCSV('EcoSchool_Database_Users.csv', generateUsersCSV(users));
    setTimeout(() => downloadCSV('EcoSchool_Database_Log_Transaksi.csv', generateTransactionsCSV(transactions)), 200);
    setTimeout(() => downloadCSV('EcoSchool_Database_Katalog_Reward.csv', generateRewardsCSV(rewards)), 400);
  };

  const confirmExecutionDelete = () => {
    if (deleteModal.type === 'all') {
      if (onClearSheet) {
        onClearSheet(deleteModal.sheet);
      }
    } else if (deleteModal.id) {
      if (deleteModal.sheet === 'Users' && onDeleteUser) {
        onDeleteUser(deleteModal.id);
      } else if (deleteModal.sheet === 'Log_Transaksi' && onDeleteTransaction) {
        onDeleteTransaction(deleteModal.id);
      } else if (deleteModal.sheet === 'Katalog_Reward' && onDeleteReward) {
        onDeleteReward(deleteModal.id);
      } else if (deleteModal.sheet === 'Log_Penukaran' && onDeleteRedemption) {
        onDeleteRedemption(deleteModal.id);
      }
    }
    setDeleteModal({ isOpen: false, type: 'single', sheet: 'Users' });
  };

  // Filtered rows
  const filteredUsers = users.filter(u => 
    u.Nama_Siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.NISN.includes(searchTerm) ||
    u.Kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.UserID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(t =>
    t.ID_Transaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.NISN_Siswa.includes(searchTerm) ||
    t.Jenis_Sampah.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRewards = rewards.filter(r =>
    r.RewardID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.Nama_Item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRedemptions = redemptions.filter(r =>
    r.ID_Penukaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.Nama_Siswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.Nama_Item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.KodeKlaim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formulas calculation preview
  const totalWeightLogged = transactions.reduce((sum, t) => sum + t.Berat_Gram, 0);
  const totalPointsDistributed = transactions.reduce((sum, t) => sum + t.Poin_Didapat, 0);
  const totalActivePoints = users.reduce((sum, u) => sum + u.Total_Poin, 0);

  const currentCount = 
    activeSheet === 'Users' ? users.length :
    activeSheet === 'Log_Transaksi' ? transactions.length :
    activeSheet === 'Katalog_Reward' ? rewards.length : redemptions.length;

  return (
    <div className="space-y-6">
      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Data Siswa (Sheet 1)</div>
          <div className="text-2xl font-bold text-slate-900">{users.length} Siswa</div>
          <div className="mt-2 text-emerald-600 text-xs font-medium">Terdaftar di UserID & NISN</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Log Transaksi (Sheet 2)</div>
          <div className="text-2xl font-bold text-slate-900">{transactions.length} Entri</div>
          <div className="mt-2 text-blue-600 text-xs font-medium">
            {totalWeightLogged >= 1000 ? `${(totalWeightLogged/1000).toFixed(1)} Kg` : `${totalWeightLogged} g`} Sampah Terdistribusi
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Reward (Sheet 3)</div>
          <div className="text-2xl font-bold text-slate-900">{rewards.length} Item</div>
          <div className="mt-2 text-amber-600 text-xs font-medium">
            {redemptions.length} Voucher Diklaim
          </div>
        </div>
      </div>

      {/* Top Banner: Google Sheets Database Structure & Competition Note */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                EcoSchool_Database (Google Sheets)
              </h2>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-100">
                Struktur 4 Tab Lengkap
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Data tersimpan & dapat dikelola: <span className="font-semibold text-slate-700">Sheet 1: Users</span>, <span className="font-semibold text-slate-700">Sheet 2: Log_Transaksi</span>, <span className="font-semibold text-slate-700">Sheet 3: Katalog_Reward</span>, dan <span className="font-semibold text-slate-700">Sheet 4: Log_Penukaran</span>.
            </p>
          </div>
        </div>

        {/* Global Sheet Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Instal App di Android</span>
            </button>
          )}

          <button
            onClick={handleCopyClipboard}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
            title="Salin tabel tab aktif untuk langsung di-paste ke Google Sheets"
          >
            {copiedTab === activeSheet ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Tab Ini (Paste ke Sheets)</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadAllCSVs}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
            title="Download seluruh sheet dalam format CSV"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh Semua CSV (4 Tab)</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Workspace Simulation */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Google Sheets Style Green Toolbar & Formula Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Formula bar */}
          <div className="flex items-center gap-2 flex-1">
            <span className="font-serif italic font-bold text-slate-500 px-2 py-0.5 bg-white border border-slate-300 rounded-md">
              fx
            </span>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-mono text-[11px] flex-1 overflow-x-auto truncate shadow-2xs">
              {activeSheet === 'Users' && `=QUERY(Users!A:E, "SELECT A, B, C, D, E ORDER BY E DESC")`}
              {activeSheet === 'Log_Transaksi' && `=SUM(Log_Transaksi!F2:F) → Total Poin: ${totalPointsDistributed} | Total Berat: ${totalWeightLogged}g`}
              {activeSheet === 'Katalog_Reward' && `=FILTER(Katalog_Reward!A2:C, Katalog_Reward!C2:C > 0)`}
              {activeSheet === 'Log_Penukaran' && `=COUNTIF(Log_Penukaran!H2:H, "Selesai") → ${redemptions.length} Klaim`}
            </div>
          </div>

          {/* Search box, Delete All Tab button & Single CSV export */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari dalam tabel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 w-44"
              />
            </div>

            <button
              onClick={handleDownloadActiveCSV}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer"
              title={`Unduh file ${activeSheet}.csv`}
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {currentCount > 0 && (
              <button
                onClick={() => setDeleteModal({
                  isOpen: true,
                  type: 'all',
                  sheet: activeSheet,
                  label: `Seluruh Data ${activeSheet} (${currentCount} baris)`
                })}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                title={`Kosongkan semua baris data di tab ${activeSheet}`}
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden md:inline">Hapus Semua Data Tab Ini</span>
                <span className="md:hidden">Kosongkan Tab</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-3 pt-2.5 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSheet('Users')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSheet === 'Users'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sheet 1: Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSheet('Log_Transaksi')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSheet === 'Log_Transaksi'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sheet 2: Log_Transaksi ({transactions.length})</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              Bukti Lomba
            </span>
          </button>

          <button
            onClick={() => setActiveSheet('Katalog_Reward')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSheet === 'Katalog_Reward'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sheet 3: Katalog_Reward ({rewards.length})</span>
          </button>

          <button
            onClick={() => setActiveSheet('Log_Penukaran')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSheet === 'Log_Penukaran'
                ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sheet 4: Log_Penukaran ({redemptions.length})</span>
          </button>
        </div>

        {/* Spreadsheet Data Grid */}
        <div className="overflow-x-auto min-h-[340px]">
          
          {/* TAB 1: USERS */}
          {activeSheet === 'Users' && (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="p-3 border-r border-slate-200 text-center w-12 bg-slate-100/70">#</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column A (UserID)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column B (NISN)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column C (Nama_Siswa)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column D (Kelas)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700 text-right">Column E (Total_Poin)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700 text-center w-28">Unduh QR</th>
                  <th className="p-3 font-bold text-slate-700 text-center w-24">Aksi Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-sans">
                      Tidak ada data siswa ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => (
                    <tr key={u.UserID} className="hover:bg-emerald-50/40 transition-colors group">
                      <td className="p-3 border-r border-slate-100 text-center bg-slate-50 text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-slate-900">
                        {u.UserID}
                      </td>
                      <td className="p-3 border-r border-slate-100 text-emerald-700 font-bold">
                        {u.NISN}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-sans font-semibold text-slate-900">
                        {u.Nama_Siswa}
                      </td>
                      <td className="p-3 border-r border-slate-100 text-slate-700">
                        {u.Kelas}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-emerald-700 text-right">
                        {u.Total_Poin}
                      </td>
                      <td className="p-2 border-r border-slate-100 text-center">
                        <button
                          onClick={() => downloadStudentQRBadge(u)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                          title={`Unduh gambar QR code untuk ${u.Nama_Siswa}`}
                        >
                          <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Unduh QR</span>
                        </button>
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            type: 'single',
                            sheet: 'Users',
                            id: u.UserID,
                            label: `${u.Nama_Siswa} (${u.NISN} - ${u.Kelas})`
                          })}
                          className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={`Hapus siswa ${u.Nama_Siswa}`}
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 2: LOG_TRANSAKSI */}
          {activeSheet === 'Log_Transaksi' && (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="p-3 border-r border-slate-200 text-center w-12 bg-slate-100/70">#</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column A (ID_Transaksi)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column B (Timestamp)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column C (NISN_Siswa)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column D (Jenis_Sampah)</th>
                  <th className="p-3 border-r border-slate-200 text-right font-bold text-slate-700">Column E (Berat_Gram)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700 text-right">Column F (Poin_Didapat)</th>
                  <th className="p-3 font-bold text-slate-700 text-center w-24">Aksi Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400 font-sans">
                      Tidak ada transaksi setoran sampah.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx, idx) => (
                    <tr key={trx.ID_Transaksi} className="hover:bg-emerald-50/40 transition-colors group">
                      <td className="p-3 border-r border-slate-100 text-center bg-slate-50 text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-slate-900">
                        {trx.ID_Transaksi}
                      </td>
                      <td className="p-3 border-r border-slate-100 text-slate-500">
                        {trx.Timestamp}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-emerald-700">
                        {trx.NISN_Siswa}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-sans font-medium text-slate-800">
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                          {trx.Jenis_Sampah}
                        </span>
                      </td>
                      <td className="p-3 border-r border-slate-100 text-right font-bold text-slate-700">
                        {trx.Berat_Gram}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-emerald-700 text-right">
                        +{trx.Poin_Didapat}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            type: 'single',
                            sheet: 'Log_Transaksi',
                            id: trx.ID_Transaksi,
                            label: `Transaksi ${trx.ID_Transaksi} (${trx.Jenis_Sampah} - ${trx.Berat_Gram}g)`
                          })}
                          className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={`Hapus transaksi ${trx.ID_Transaksi}`}
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: KATALOG_REWARD */}
          {activeSheet === 'Katalog_Reward' && (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="p-3 border-r border-slate-200 text-center w-12 bg-slate-100/70">#</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column A (RewardID)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Column B (Nama_Item)</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700 text-right">Column C (Poin_Dibutuhkan)</th>
                  <th className="p-3 font-bold text-slate-700 text-center w-24">Aksi Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRewards.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-sans">
                      Tidak ada reward dalam katalog.
                    </td>
                  </tr>
                ) : (
                  filteredRewards.map((r, idx) => (
                    <tr key={r.RewardID} className="hover:bg-emerald-50/40 transition-colors group">
                      <td className="p-3 border-r border-slate-100 text-center bg-slate-50 text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-slate-900">
                        {r.RewardID}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-sans font-semibold text-slate-900">
                        {r.Nama_Item}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-emerald-700 text-right">
                        {r.Poin_Dibutuhkan} Poin
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            type: 'single',
                            sheet: 'Katalog_Reward',
                            id: r.RewardID,
                            label: `${r.Nama_Item} (${r.RewardID})`
                          })}
                          className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={`Hapus reward ${r.Nama_Item}`}
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 4: LOG_PENUKARAN */}
          {activeSheet === 'Log_Penukaran' && (
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                  <th className="p-3 border-r border-slate-200 text-center w-12 bg-slate-100/70">#</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">ID_Penukaran</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Timestamp</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">NISN</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Nama Siswa</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Nama Item</th>
                  <th className="p-3 border-r border-slate-200 text-right font-bold text-slate-700">Poin Dipakai</th>
                  <th className="p-3 border-r border-slate-200 font-bold text-slate-700">Kode Klaim</th>
                  <th className="p-3 font-bold text-slate-700 text-center w-24">Aksi Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRedemptions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400 font-sans">
                      Tidak ada riwayat penukaran hadiah.
                    </td>
                  </tr>
                ) : (
                  filteredRedemptions.map((red, idx) => (
                    <tr key={red.ID_Penukaran} className="hover:bg-emerald-50/40 transition-colors group">
                      <td className="p-3 border-r border-slate-100 text-center bg-slate-50 text-slate-400 font-bold">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-slate-900">
                        {red.ID_Penukaran}
                      </td>
                      <td className="p-3 border-r border-slate-100 text-slate-500">
                        {red.Timestamp}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-emerald-700">
                        {red.NISN_Siswa}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-sans font-medium text-slate-900">
                        {red.Nama_Siswa}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-sans text-slate-800">
                        {red.Nama_Item}
                      </td>
                      <td className="p-3 border-r border-slate-100 text-right font-bold text-rose-600">
                        -{red.Poin_Dipakai}
                      </td>
                      <td className="p-3 border-r border-slate-100 font-bold text-amber-700">
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md text-[11px]">
                          {red.KodeKlaim}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setDeleteModal({
                            isOpen: true,
                            type: 'single',
                            sheet: 'Log_Penukaran',
                            id: red.ID_Penukaran,
                            label: `Klaim ${red.ID_Penukaran} (${red.Nama_Siswa} - ${red.Nama_Item})`
                          })}
                          className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title={`Hapus riwayat klaim ${red.ID_Penukaran}`}
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

        </div>

        {/* Footer Summary / Quick Stats */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4 font-medium">
            <span>
              Total Baris:{' '}
              <strong className="text-slate-900">
                {activeSheet === 'Users' ? users.length :
                 activeSheet === 'Log_Transaksi' ? transactions.length :
                 activeSheet === 'Katalog_Reward' ? rewards.length : redemptions.length}
              </strong>
            </span>
            <span>
              Total Poin Beredar:{' '}
              <strong className="text-emerald-700">{totalActivePoints.toLocaleString()} Pts</strong>
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Salin tab ini lalu buka Google Sheets dan tekan <strong>Ctrl + V</strong>.
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Deleting Data */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 transform transition-all">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                onClick={() => setDeleteModal({ isOpen: false, type: 'single', sheet: 'Users' })}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-slate-900">
                {deleteModal.type === 'all' ? 'Hapus Seluruh Data Tab?' : 'Hapus Data Baris Ini?'}
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                {deleteModal.type === 'all' ? (
                  <>
                    Tindakan ini akan mengosongkan semua baris data pada <strong className="text-slate-800">{deleteModal.sheet}</strong> di database lokal EcoSchool.
                  </>
                ) : (
                  <>
                    Apakah Anda yakin ingin menghapus <strong className="text-slate-800">{deleteModal.label || deleteModal.id}</strong> dari tabel <strong>{deleteModal.sheet}</strong>?
                  </>
                )}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, type: 'single', sheet: 'Users' })}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmExecutionDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleteModal.type === 'all' ? 'Ya, Kosongkan Tab' : 'Ya, Hapus Data'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
