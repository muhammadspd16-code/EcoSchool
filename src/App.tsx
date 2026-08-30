/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, LogTransaksi, RewardItem, LogPenukaran } from './types';
import { 
  INITIAL_USERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REWARDS, 
  INITIAL_REDEMPTIONS 
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StudentCard } from './components/StudentCard';
import { QRScannerModal } from './components/QRScannerModal';
import { WasteDepositForm } from './components/WasteDepositForm';
import { RewardCatalog } from './components/RewardCatalog';
import { GoogleSheetsViewer } from './components/GoogleSheetsViewer';
import { InstallAppModal } from './components/InstallAppModal';
import { StudentRegisterModal } from './components/StudentRegisterModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { EcoImpactDashboard } from './components/EcoImpactDashboard';
import { QRScannerView } from './components/QRScannerView';

export default function App() {
  // Persistence with localStorage
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('ecoschool_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [transactions, setTransactions] = useState<LogTransaksi[]>(() => {
    const saved = localStorage.getItem('ecoschool_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem('ecoschool_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [redemptions, setRedemptions] = useState<LogPenukaran[]>(() => {
    const saved = localStorage.getItem('ecoschool_redemptions');
    return saved ? JSON.parse(saved) : INITIAL_REDEMPTIONS;
  });

  // Selected Student
  const [selectedUser, setSelectedUser] = useState<User>(() => users[0] || INITIAL_USERS[0]);

  // Main UI Tab
  const [activeTab, setActiveTab] = useState<'siswa' | 'petugas' | 'scanner' | 'sheets' | 'analytics'>('siswa');

  // Mobile sidebar state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [receiptTrx, setReceiptTrx] = useState<LogTransaksi | null>(null);
  const [receiptUser, setReceiptUser] = useState<User | null>(null);

  // Capture PWA beforeinstallprompt event for Android
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ecoschool_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ecoschool_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ecoschool_rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('ecoschool_redemptions', JSON.stringify(redemptions));
  }, [redemptions]);

  // Keep selectedUser in sync with users list
  useEffect(() => {
    const fresh = users.find(u => u.NISN === selectedUser?.NISN);
    if (fresh) {
      setSelectedUser(fresh);
    }
  }, [users]);

  // Calculated total weight in Kg
  const totalWeightGram = transactions.reduce((sum, t) => sum + t.Berat_Gram, 0);
  const totalWeightKg = (totalWeightGram / 1000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // Handler: Add waste deposit transaction
  const handleAddTransaction = (newTrxData: Omit<LogTransaksi, 'ID_Transaksi' | 'Timestamp'>) => {
    const nextTrxNum = transactions.length + 1;
    const trxId = `TRX-${String(nextTrxNum).padStart(3, '0')}`;
    
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newTransaction: LogTransaksi = {
      ID_Transaksi: trxId,
      Timestamp: formattedDate,
      ...newTrxData,
    };

    // 1. Append transaction
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    // 2. Update user's total points
    const updatedUsers = users.map(u => {
      if (u.NISN === newTrxData.NISN_Siswa) {
        return {
          ...u,
          Total_Poin: u.Total_Poin + newTrxData.Poin_Didapat,
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    // 3. Show digital receipt
    const userForReceipt = updatedUsers.find(u => u.NISN === newTrxData.NISN_Siswa) || selectedUser;
    setReceiptTrx(newTransaction);
    setReceiptUser(userForReceipt);
  };

  // Handler: Redeem reward item
  const handleRedeemReward = (reward: RewardItem, student: User) => {
    if (student.Total_Poin < reward.Poin_Dibutuhkan) return;

    const nextRdmNum = redemptions.length + 1;
    const rdmId = `RDM-${String(nextRdmNum).padStart(3, '0')}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Unique random claim code e.g. ECO-KANTIN-8421
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const claimCode = `ECO-${reward.Kategori.toUpperCase().replace(/\s+/g, '')}-${randomCode}`;

    const newRedemption: LogPenukaran = {
      ID_Penukaran: rdmId,
      Timestamp: formattedDate,
      NISN_Siswa: student.NISN,
      Nama_Siswa: student.Nama_Siswa,
      RewardID: reward.RewardID,
      Nama_Item: reward.Nama_Item,
      Poin_Dipakai: reward.Poin_Dibutuhkan,
      Status: 'Selesai',
      KodeKlaim: claimCode,
    };

    // 1. Deduct user points
    const updatedUsers = users.map(u => {
      if (u.NISN === student.NISN) {
        return {
          ...u,
          Total_Poin: Math.max(0, u.Total_Poin - reward.Poin_Dibutuhkan),
        };
      }
      return u;
    });
    setUsers(updatedUsers);

    // 2. Decrement reward stock
    const updatedRewards = rewards.map(r => {
      if (r.RewardID === reward.RewardID) {
        return {
          ...r,
          Stok: Math.max(0, r.Stok - 1),
        };
      }
      return r;
    });
    setRewards(updatedRewards);

    // 3. Append to redemptions log
    setRedemptions([newRedemption, ...redemptions]);
  };

  // Handler: Register new student
  const handleRegisterUser = (newUser: User) => {
    const updated = [...users, newUser];
    setUsers(updated);
    setSelectedUser(newUser);
    setActiveTab('siswa');
  };

  // Handler: Delete single user from database
  const handleDeleteUser = (userId: string) => {
    const updated = users.filter(u => u.UserID !== userId);
    setUsers(updated);
    if (selectedUser?.UserID === userId) {
      if (updated.length > 0) {
        setSelectedUser(updated[0]);
      }
    }
  };

  // Handler: Delete single transaction
  const handleDeleteTransaction = (trxId: string) => {
    const trxToDelete = transactions.find(t => t.ID_Transaksi === trxId);
    if (trxToDelete) {
      // Deduct points that were given in this transaction
      const updatedUsers = users.map(u => {
        if (u.NISN === trxToDelete.NISN_Siswa) {
          return {
            ...u,
            Total_Poin: Math.max(0, u.Total_Poin - trxToDelete.Poin_Didapat)
          };
        }
        return u;
      });
      setUsers(updatedUsers);
    }
    setTransactions(transactions.filter(t => t.ID_Transaksi !== trxId));
  };

  // Handler: Delete single reward
  const handleDeleteReward = (rewardId: string) => {
    setRewards(rewards.filter(r => r.RewardID !== rewardId));
  };

  // Handler: Delete single redemption log
  const handleDeleteRedemption = (redemptionId: string) => {
    setRedemptions(redemptions.filter(r => r.ID_Penukaran !== redemptionId));
  };

  // Handler: Clear entire sheet
  const handleClearSheet = (sheetName: 'Users' | 'Log_Transaksi' | 'Katalog_Reward' | 'Log_Penukaran') => {
    if (sheetName === 'Users') {
      setUsers([]);
    } else if (sheetName === 'Log_Transaksi') {
      setTransactions([]);
    } else if (sheetName === 'Katalog_Reward') {
      setRewards([]);
    } else if (sheetName === 'Log_Penukaran') {
      setRedemptions([]);
    }
  };

  // Handler: Reset to factory default mock data
  const handleExecuteReset = () => {
    localStorage.removeItem('ecoschool_users');
    localStorage.removeItem('ecoschool_transactions');
    localStorage.removeItem('ecoschool_rewards');
    localStorage.removeItem('ecoschool_redemptions');
    setUsers(INITIAL_USERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setRewards(INITIAL_REWARDS);
    setRedemptions(INITIAL_REDEMPTIONS);
    setSelectedUser(INITIAL_USERS[0]);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Sleek Dark Emerald Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalUsersCount={users.length}
        totalTransactionsCount={transactions.length}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Sleek Top Header */}
        <Header
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onResetData={() => setIsResetModalOpen(true)}
          totalWeightKg={totalWeightKg}
          selectedUser={selectedUser}
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Tab 1: Portal Siswa (Digital Card, QR Code, Points Wallet, & Reward Catalog) */}
          {activeTab === 'siswa' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <StudentCard
                currentUser={selectedUser}
                users={users}
                onSelectUser={setSelectedUser}
                transactions={transactions}
                redemptions={redemptions}
                onGoToDeposit={(user) => {
                  setSelectedUser(user);
                  setActiveTab('petugas');
                }}
                onGoToRewards={() => {
                  const el = document.getElementById('reward-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Reward Catalog Section */}
              <div id="reward-section" className="pt-2">
                <RewardCatalog
                  currentUser={selectedUser}
                  rewards={rewards}
                  redemptions={redemptions}
                  onRedeemReward={handleRedeemReward}
                />
              </div>
            </div>
          )}

          {/* Tab: Scanner QR Siswa (Dedicated Workstation View) */}
          {activeTab === 'scanner' && (
            <div className="max-w-7xl mx-auto">
              <QRScannerView
                users={users}
                onSelectStudentForDeposit={(user) => {
                  setSelectedUser(user);
                  setActiveTab('petugas');
                }}
                onSelectStudentForWallet={(user) => {
                  setSelectedUser(user);
                  setActiveTab('siswa');
                }}
                onOpenRegister={() => setIsRegisterOpen(true)}
              />
            </div>
          )}

          {/* Tab 2: Pos Petugas Bank Sampah (OSIS / PMR Workstation) */}
          {activeTab === 'petugas' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <WasteDepositForm
                selectedUser={selectedUser}
                users={users}
                onOpenScanner={() => setIsScannerOpen(true)}
                onSelectUser={setSelectedUser}
                onAddTransaction={handleAddTransaction}
              />

              {/* Quick Link to Google Sheets Log */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Data setoran otomatis tersinkronisasi di <strong className="text-slate-800">Sheet 2 (Log_Transaksi)</strong> Google Sheets.
                </div>
                <button
                  onClick={() => setActiveTab('sheets')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline self-start sm:self-auto cursor-pointer"
                >
                  Buka Tab Database Google Sheets →
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Google Sheets Database (4 Tab) */}
          {activeTab === 'sheets' && (
            <div className="max-w-7xl mx-auto">
              <GoogleSheetsViewer
                users={users}
                transactions={transactions}
                rewards={rewards}
                redemptions={redemptions}
                onOpenInstallModal={() => setIsInstallModalOpen(true)}
                onDeleteUser={handleDeleteUser}
                onDeleteTransaction={handleDeleteTransaction}
                onDeleteReward={handleDeleteReward}
                onDeleteRedemption={handleDeleteRedemption}
                onClearSheet={handleClearSheet}
              />
            </div>
          )}

          {/* Tab 4: Analytics & Leaderboard */}
          {activeTab === 'analytics' && (
            <div className="max-w-7xl mx-auto">
              <EcoImpactDashboard
                users={users}
                transactions={transactions}
                rewards={rewards}
                redemptions={redemptions}
                onSelectUser={(u) => {
                  setSelectedUser(u);
                  setActiveTab('siswa');
                }}
              />
            </div>
          )}

          {/* Footer note */}
          <footer className="pt-8 pb-4 text-center text-xs text-slate-400 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/80 pt-4">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="font-bold text-emerald-800">EcoSchool Bank Sampah</span>
                <span>•</span>
                <span>SMAN 2 Banjarmasin</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Modals */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(user) => {
          setSelectedUser(user);
          setActiveTab('petugas');
        }}
        users={users}
      />

      <StudentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterUser={handleRegisterUser}
        existingUsers={users}
      />

      {/* Install App on Android Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstallSuccess={() => setIsInstallModalOpen(false)}
      />

      <ReceiptModal
        transaction={receiptTrx}
        student={receiptUser}
        isOpen={!!receiptTrx}
        onClose={() => setReceiptTrx(null)}
      />

      {/* Reset Database Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleExecuteReset}
      />
    </div>
  );
}
