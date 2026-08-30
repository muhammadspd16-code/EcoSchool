import React, { useState } from 'react';
import { User, RewardItem, LogPenukaran } from '../types';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Coins, 
  Check, 
  ShoppingBag, 
  BookOpen, 
  Utensils, 
  Library, 
  Coffee, 
  PenTool, 
  Printer, 
  Sprout, 
  Ticket,
  CheckCircle2
} from 'lucide-react';

interface RewardCatalogProps {
  currentUser: User;
  rewards: RewardItem[];
  redemptions: LogPenukaran[];
  onRedeemReward: (reward: RewardItem, user: User) => void;
}

export const RewardCatalog: React.FC<RewardCatalogProps> = ({
  currentUser,
  rewards,
  redemptions,
  onRedeemReward,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [redeemingItem, setRedeemingItem] = useState<RewardItem | null>(null);
  const [activeTab, setActiveTab] = useState<'katalog' | 'voucher'>('katalog');

  const categories = ['Semua', 'Alat Tulis', 'Kantin Sehat', 'Fasilitas', 'Merchandise', 'Lingkungan'];

  const filteredRewards = selectedCategory === 'Semua'
    ? rewards
    : rewards.filter(r => r.Kategori === selectedCategory);

  const studentRedemptions = redemptions.filter(r => r.NISN_Siswa === currentUser.NISN);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'Library': return <Library className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'PenTool': return <PenTool className="w-5 h-5" />;
      case 'Printer': return <Printer className="w-5 h-5" />;
      case 'Sprout': return <Sprout className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const handleConfirmRedeem = () => {
    if (!redeemingItem) return;
    if (currentUser.Total_Poin < redeemingItem.Poin_Dibutuhkan) {
      alert('Poin Anda tidak mencukupi untuk menukarkan item ini.');
      return;
    }

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899']
    });

    onRedeemReward(redeemingItem, currentUser);
    setRedeemingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Current Points */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-600 shadow-2xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Katalog Penukaran Reward (Sheet 3)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Tukarkan poin hasil setor sampah dengan alat tulis, kupon kantin sehat, dan voucher sekolah.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3 self-start sm:self-auto shadow-2xs">
          <Coins className="w-5 h-5 text-amber-500" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Saldo Poin Anda:</div>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {currentUser.Total_Poin.toLocaleString()}{' '}
              <span className="text-xs font-bold text-emerald-600">Pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Switcher: Katalog vs E-Voucher Saya */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'katalog'
                ? 'bg-emerald-950 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Katalog Hadiah ({rewards.length})
          </button>
          <button
            onClick={() => setActiveTab('voucher')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'voucher'
                ? 'bg-emerald-950 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span>Kupon Saya ({studentRedemptions.length})</span>
          </button>
        </div>

        {activeTab === 'katalog' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'katalog' ? (
        /* Rewards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRewards.map(reward => {
            const canAfford = currentUser.Total_Poin >= reward.Poin_Dibutuhkan;
            const hasStock = reward.Stok > 0;

            return (
              <div
                key={reward.RewardID}
                className={`bg-white rounded-3xl border transition-all flex flex-col justify-between p-5 relative shadow-sm ${
                  canAfford
                    ? 'border-slate-200 hover:border-emerald-500 hover:shadow-md'
                    : 'border-slate-200 opacity-85'
                }`}
              >
                {/* Top tag & icon */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shadow-2xs">
                      {getCategoryIcon(reward.IconName)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                      {reward.Kategori}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {reward.Nama_Item}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {reward.Deskripsi}
                  </p>
                </div>

                {/* Bottom details & button */}
                <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 font-black text-emerald-700 text-base">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>{reward.Poin_Dibutuhkan}</span>
                      <span className="text-[11px] text-slate-500 font-normal">Poin</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Sisa: <strong className="text-slate-700">{reward.Stok}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={!canAfford || !hasStock}
                    onClick={() => setRedeemingItem(reward)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      canAfford && hasStock
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer active:scale-98'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>
                      {!hasStock 
                        ? 'Stok Habis' 
                        : canAfford 
                          ? 'Tukarkan Poin' 
                          : `Kurang ${reward.Poin_Dibutuhkan - currentUser.Total_Poin} Poin`}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Voucher Tab */
        <div className="space-y-4">
          {studentRedemptions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500 shadow-sm">
              <Ticket className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-800">Belum Ada Kupon Penukaran</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Kumpulkan poin dari setoran sampah terpilah dan tukarkan dengan kupon kantin atau alat tulis.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentRedemptions.map((red) => (
                <div
                  key={red.ID_Penukaran}
                  className="bg-white rounded-3xl border border-amber-300/80 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                        {red.ID_Penukaran}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-2">
                        {red.Nama_Item}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {red.Timestamp}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                      <Ticket className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dashed border-amber-200 flex items-center justify-between bg-amber-50/50 p-3 rounded-2xl">
                    <div>
                      <div className="text-[10px] text-amber-800 uppercase font-bold">Kode Klaim:</div>
                      <div className="font-mono text-sm font-black text-amber-950">
                        {red.KodeKlaim}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {red.Status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {redeemingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Penukaran Poin</h3>
                <p className="text-xs text-slate-500">Klaim reward EcoSchool</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Item:</span>
                <span className="font-bold text-slate-800">{redeemingItem.Nama_Item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Poin Dibutuhkan:</span>
                <span className="font-bold text-emerald-600">-{redeemingItem.Poin_Dibutuhkan} Pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Saldo Poin Anda:</span>
                <span className="font-semibold text-slate-700">{currentUser.Total_Poin} Pts</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-700">Sisa Saldo Setelah Klaim:</span>
                <span className="font-bold text-slate-900">
                  {currentUser.Total_Poin - redeemingItem.Poin_Dibutuhkan} Pts
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRedeemingItem(null)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Ya, Tukarkan Poin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
