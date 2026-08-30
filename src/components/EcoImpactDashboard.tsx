import React from 'react';
import { User, LogTransaksi, LogPenukaran } from '../types';
import { 
  Trophy, 
  Leaf, 
  Scale, 
  Coins, 
  TrendingUp, 
  Award, 
  Users, 
  Recycle,
  Crown
} from 'lucide-react';

interface EcoImpactDashboardProps {
  users: User[];
  transactions: LogTransaksi[];
  redemptions: LogPenukaran[];
  onSelectUser: (user: User) => void;
}

export const EcoImpactDashboard: React.FC<EcoImpactDashboardProps> = ({
  users,
  transactions,
  redemptions,
  onSelectUser,
}) => {
  // Aggregate Metrics
  const totalWeightGram = transactions.reduce((sum, t) => sum + t.Berat_Gram, 0);
  const totalPointsDistributed = transactions.reduce((sum, t) => sum + t.Poin_Didapat, 0);
  const totalPointsRedeemed = redemptions.reduce((sum, r) => sum + r.Poin_Dipakai, 0);

  // Carbon offset estimation (approx. 1.8 kg CO2e saved per 1 kg mixed recyclables)
  const totalCo2SavedKg = ((totalWeightGram / 1000) * 1.8).toFixed(1);
  const treesEquivalent = ((totalWeightGram / 1000) * 0.08).toFixed(1);

  // Waste breakdown by category
  const wasteBreakdown = transactions.reduce((acc, t) => {
    if (!acc[t.Jenis_Sampah]) {
      acc[t.Jenis_Sampah] = { weight: 0, count: 0 };
    }
    acc[t.Jenis_Sampah].weight += t.Berat_Gram;
    acc[t.Jenis_Sampah].count += 1;
    return acc;
  }, {} as Record<string, { weight: number; count: number }>);

  // Top Students by Total_Poin (Sheet 1)
  const topStudents = [...users].sort((a, b) => b.Total_Poin - a.Total_Poin);

  // Top Classes by aggregated points
  const classAggregation = users.reduce((acc, u) => {
    if (!acc[u.Kelas]) {
      acc[u.Kelas] = { points: 0, studentsCount: 0, weight: 0 };
    }
    acc[u.Kelas].points += u.Total_Poin;
    acc[u.Kelas].studentsCount += 1;
    return acc;
  }, {} as Record<string, { points: number; studentsCount: number; weight: number }>);

  // Calculate weight per class from transactions
  transactions.forEach(t => {
    const student = users.find(u => u.NISN === t.NISN_Siswa);
    if (student && classAggregation[student.Kelas]) {
      classAggregation[student.Kelas].weight += t.Berat_Gram;
    }
  });

  const topClasses = Object.entries(classAggregation)
    .map(([kelas, data]: [string, { points: number; studentsCount: number; weight: number }]) => ({
      kelas,
      points: data.points,
      studentsCount: data.studentsCount,
      weight: data.weight
    }))
    .sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      {/* 3 Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Sampah Terkumpul</div>
          <div className="text-2xl font-bold text-slate-900">
            {(totalWeightGram / 1000).toFixed(1)} <span className="text-sm font-semibold text-slate-500">Kg</span>
          </div>
          <div className="mt-2 text-emerald-600 text-xs font-medium">Dari {transactions.length} kali penimbangan</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Reduksi Emisi Karbon</div>
          <div className="text-2xl font-bold text-emerald-600">
            {totalCo2SavedKg} <span className="text-sm font-semibold text-emerald-700">Kg CO₂e</span>
          </div>
          <div className="mt-2 text-teal-600 text-xs font-medium">≈ Setara {treesEquivalent} bibit pohon ditanam</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Poin Terdistribusi</div>
          <div className="text-2xl font-bold text-slate-900">
            {totalPointsDistributed.toLocaleString()} <span className="text-sm font-semibold text-amber-500">Pts</span>
          </div>
          <div className="mt-2 text-amber-600 text-xs font-medium">{totalPointsRedeemed} poin telah ditukarkan</div>
        </div>
      </div>

      {/* Hero Environmental Impact Banner */}
      <div className="bg-emerald-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-950/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold mb-3 border border-emerald-700">
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span>Dashboard Dampak Lingkungan & Adiwiyata</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gerakan Sampah Jadi Berkah Sekolah
          </h2>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
            Data real-time penyetoran botol plastik, kardus, dan kertas bekas oleh siswa, diverifikasi oleh kader OSIS & PMR untuk mewujudkan lingkungan sekolah bersih dan berkelanjutan.
          </p>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Content Grid: Waste Category Breakdown & Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Waste Breakdown Categories */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Recycle className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Komposisi Sampah Terpilah
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {Object.keys(wasteBreakdown).length} Jenis
              </span>
            </div>

            <div className="space-y-4">
              {(Object.entries(wasteBreakdown) as [string, { weight: number; count: number }][]).map(([jenis, data]) => {
                const percentage = totalWeightGram > 0 
                  ? Math.round((data.weight / totalWeightGram) * 100) 
                  : 0;

                return (
                  <div key={jenis} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{jenis}</span>
                      <span className="text-slate-500 font-medium font-mono">
                        {(data.weight / 1000).toFixed(1)} kg ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between">
                      <span>{data.count} kali transaksi</span>
                      <span>{Math.round(data.weight * 0.1)} poin diterbitkan</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard per Kelas */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Peringkat Kelas Adiwiyata
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {topClasses.slice(0, 4).map((c, idx) => (
                <div
                  key={c.kelas}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                      idx === 0 ? 'bg-amber-100 text-amber-800' :
                      idx === 1 ? 'bg-slate-200 text-slate-700' :
                      idx === 2 ? 'bg-amber-800/10 text-amber-900' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{c.kelas}</div>
                      <div className="text-[10px] text-slate-400">{c.studentsCount} siswa aktif</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-emerald-700 font-mono">
                      {c.points} Pts
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {(c.weight / 1000).toFixed(1)} kg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Individual Student Hall of Fame */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Peringkat Siswa Teraktif (Top Eco-Hero)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Klik siswa untuk pilih</span>
            </div>

            <div className="space-y-2.5">
              {topStudents.map((student, idx) => (
                <div
                  key={student.NISN}
                  onClick={() => onSelectUser(student)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      idx === 0 ? 'bg-amber-400 text-white shadow-xs' :
                      idx === 1 ? 'bg-slate-300 text-slate-800' :
                      idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {idx === 0 ? <Crown className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                        {student.Nama_Siswa}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        NISN: {student.NISN} • <span className="text-slate-700 font-semibold">{student.Kelas}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-700 font-mono">
                        {student.Total_Poin} <span className="text-[10px] text-slate-500 font-normal">Pts</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {student.UserID}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
