export interface User {
  UserID: string;
  NISN: string;
  Nama_Siswa: string;
  Kelas: string;
  Total_Poin: number;
  AvatarColor?: string;
  No_Telepon?: string;
}

export interface LogTransaksi {
  ID_Transaksi: string;
  Timestamp: string;
  NISN_Siswa: string;
  Jenis_Sampah: string;
  Berat_Gram: number;
  Poin_Didapat: number;
  Petugas?: string;
  Catatan?: string;
}

export interface RewardItem {
  RewardID: string;
  Nama_Item: string;
  Poin_Dibutuhkan: number;
  Kategori: 'Alat Tulis' | 'Kantin Sehat' | 'Fasilitas' | 'Merchandise' | 'Lingkungan';
  Stok: number;
  Deskripsi: string;
  IconName: string;
}

export interface LogPenukaran {
  ID_Penukaran: string;
  Timestamp: string;
  NISN_Siswa: string;
  Nama_Siswa: string;
  RewardID: string;
  Nama_Item: string;
  Poin_Dipakai: number;
  Status: 'Selesai' | 'Menunggu Ambil';
  KodeKlaim: string;
}

export interface WasteType {
  id: string;
  name: string;
  category: string;
  pointsPerGram: number; // e.g. 0.1 means 100 pts per 1000g (1kg)
  unit: string;
  co2Factor: number; // kg CO2 saved per kg waste
  icon: string;
  description: string;
  color: string;
}
