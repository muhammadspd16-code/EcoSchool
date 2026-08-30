import { User, LogTransaksi, RewardItem, LogPenukaran, WasteType } from '../types';

// Kelas X: X-1 s/d X-13
export const KELAS_X = Array.from({ length: 13 }, (_, i) => `X-${i + 1}`);

// Kelas XI: XI A1 s/d XI F12
export const KELAS_XI = [
  ...Array.from({ length: 12 }, (_, i) => `XI A${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XI B${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XI C${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XI D${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XI E${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XI F${i + 1}`),
];

// Kelas XII: XII A1 s/d XII F12
export const KELAS_XII = [
  ...Array.from({ length: 12 }, (_, i) => `XII A${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XII B${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XII C${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XII D${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XII E${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `XII F${i + 1}`),
];

export const ALL_SCHOOL_CLASSES = [...KELAS_X, ...KELAS_XI, ...KELAS_XII];

export const INITIAL_USERS: User[] = [
  {
    UserID: 'USR-001',
    NISN: '12345',
    Nama_Siswa: 'Budi Santoso',
    Kelas: 'X-1',
    Total_Poin: 150,
    AvatarColor: 'bg-emerald-500',
    No_Telepon: '081234567890'
  },
  {
    UserID: 'USR-002',
    NISN: '12346',
    Nama_Siswa: 'Siti Aminah',
    Kelas: 'XI A1',
    Total_Poin: 300,
    AvatarColor: 'bg-teal-500',
    No_Telepon: '082198765432'
  },
  {
    UserID: 'USR-003',
    NISN: '12347',
    Nama_Siswa: 'Ahmad Fauzi',
    Kelas: 'XII A1',
    Total_Poin: 420,
    AvatarColor: 'bg-blue-500',
    No_Telepon: '085712345678'
  },
  {
    UserID: 'USR-004',
    NISN: '12348',
    Nama_Siswa: 'Dewi Lestari',
    Kelas: 'X-2',
    Total_Poin: 210,
    AvatarColor: 'bg-rose-500',
    No_Telepon: '087812345678'
  },
  {
    UserID: 'USR-005',
    NISN: '12349',
    Nama_Siswa: 'Rizky Pratama',
    Kelas: 'XI F12',
    Total_Poin: 95,
    AvatarColor: 'bg-amber-500',
    No_Telepon: '081398761234'
  }
];

export const INITIAL_TRANSACTIONS: LogTransaksi[] = [
  {
    ID_Transaksi: 'TRX-001',
    Timestamp: '2026-06-01 08:30:00',
    NISN_Siswa: '12345',
    Jenis_Sampah: 'Botol Plastik',
    Berat_Gram: 500,
    Poin_Didapat: 50,
    Petugas: 'OSIS Div. Lingkungan',
    Catatan: 'Kondisi bersih & kering'
  },
  {
    ID_Transaksi: 'TRX-002',
    Timestamp: '2026-06-01 09:15:00',
    NISN_Siswa: '12346',
    Jenis_Sampah: 'Kardus Bekas',
    Berat_Gram: 1000,
    Poin_Didapat: 100,
    Petugas: 'PMR Unit Sekolah',
    Catatan: 'Sudah dipipihkan rapi'
  },
  {
    ID_Transaksi: 'TRX-003',
    Timestamp: '2026-06-02 08:00:00',
    NISN_Siswa: '12347',
    Jenis_Sampah: 'Buku Tulis Bekas',
    Berat_Gram: 1500,
    Poin_Didapat: 150,
    Petugas: 'OSIS Div. Lingkungan',
    Catatan: 'Buku catatan bekas semester lalu'
  },
  {
    ID_Transaksi: 'TRX-004',
    Timestamp: '2026-06-02 09:40:00',
    NISN_Siswa: '12348',
    Jenis_Sampah: 'Kaleng Minuman / Logam',
    Berat_Gram: 600,
    Poin_Didapat: 90,
    Petugas: 'PMR Unit Sekolah',
    Catatan: 'Kaleng aluminium bersih'
  },
  {
    ID_Transaksi: 'TRX-005',
    Timestamp: '2026-06-03 10:15:00',
    NISN_Siswa: '12345',
    Jenis_Sampah: 'Botol Plastik',
    Berat_Gram: 1000,
    Poin_Didapat: 100,
    Petugas: 'OSIS Div. Lingkungan',
    Catatan: 'Koleksi sampah kelas X-1'
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    RewardID: 'RWD-001',
    Nama_Item: 'Buku Tulis 1 Pak (10 Buku)',
    Poin_Dibutuhkan: 100,
    Kategori: 'Alat Tulis',
    Stok: 25,
    Deskripsi: 'Buku tulis bergaris 38 lembar kualitas premium ramah lingkungan.',
    IconName: 'BookOpen'
  },
  {
    RewardID: 'RWD-002',
    Nama_Item: 'Kupon Kantin Rp5.000',
    Poin_Dibutuhkan: 150,
    Kategori: 'Kantin Sehat',
    Stok: 40,
    Deskripsi: 'Voucher belanja makanan dan minuman sehat di seluruh kantin sekolah.',
    IconName: 'Utensils'
  },
  {
    RewardID: 'RWD-003',
    Nama_Item: 'Bebas Denda Perpustakaan (1 Periode)',
    Poin_Dibutuhkan: 80,
    Kategori: 'Fasilitas',
    Stok: 99,
    Deskripsi: 'Pemutihan denda keterlambatan pengembalian buku di perpustakaan sekolah.',
    IconName: 'Library'
  },
  {
    RewardID: 'RWD-004',
    Nama_Item: 'Tumbler Stainless EcoSchool 500ml',
    Poin_Dibutuhkan: 500,
    Kategori: 'Merchandise',
    Stok: 12,
    Deskripsi: 'Tumbler tahan dingin & panas edisi eksklusif EcoSchool untuk kurangi botol plastik sekali pakai.',
    IconName: 'Coffee'
  },
  {
    RewardID: 'RWD-005',
    Nama_Item: 'Set Alat Tulis (2B Pencil, Pulpen, Penghapus)',
    Poin_Dibutuhkan: 60,
    Kategori: 'Alat Tulis',
    Stok: 35,
    Deskripsi: 'Perlengkapan ujian lengkap dengan pensil 2B standar komputer.',
    IconName: 'PenTool'
  },
  {
    RewardID: 'RWD-006',
    Nama_Item: 'Voucher Fotokopi Sekolah (20 Lembar)',
    Poin_Dibutuhkan: 75,
    Kategori: 'Fasilitas',
    Stok: 50,
    Deskripsi: 'Kupon gratis fotokopi dan cetak tugas di koperasi sekolah.',
    IconName: 'Printer'
  },
  {
    RewardID: 'RWD-007',
    Nama_Item: 'Bibit Tanaman Hias / Sayur Organik',
    Poin_Dibutuhkan: 120,
    Kategori: 'Lingkungan',
    Stok: 20,
    Deskripsi: 'Bibit tanaman pot untuk proyek Adiwiyata kelas atau taman rumah.',
    IconName: 'Sprout'
  }
];

export const INITIAL_REDEMPTIONS: LogPenukaran[] = [
  {
    ID_Penukaran: 'RDM-001',
    Timestamp: '2026-06-02 11:30:00',
    NISN_Siswa: '12346',
    Nama_Siswa: 'Siti Aminah',
    RewardID: 'RWD-002',
    Nama_Item: 'Kupon Kantin Rp5.000',
    Poin_Dipakai: 150,
    Status: 'Selesai',
    KodeKlaim: 'ECO-KANTIN-9941'
  },
  {
    ID_Penukaran: 'RDM-002',
    Timestamp: '2026-06-03 09:10:00',
    NISN_Siswa: '12347',
    Nama_Siswa: 'Ahmad Fauzi',
    RewardID: 'RWD-001',
    Nama_Item: 'Buku Tulis 1 Pak (10 Buku)',
    Poin_Dipakai: 100,
    Status: 'Menunggu Ambil',
    KodeKlaim: 'ECO-BUKU-8823'
  }
];

export const WASTE_TYPES: WasteType[] = [
  {
    id: 'botol-plastik',
    name: 'Botol Plastik (PET / Minuman)',
    category: 'Plastik',
    pointsPerGram: 0.1, // 100 poin per 1.000g (1kg)
    unit: 'gram',
    co2Factor: 1.5, // 1.5kg CO2e saved per kg
    icon: 'Bottle',
    description: 'Botol air mineral, botol jus, teh botol plastik bening. Remas sebelum ditimbang.',
    color: 'border-cyan-500/20 bg-cyan-50 text-cyan-800'
  },
  {
    id: 'kardus-bekas',
    name: 'Kardus Bekas / Box Karton',
    category: 'Kertas & Karton',
    pointsPerGram: 0.1, // 100 poin per 1.000g (1kg)
    unit: 'gram',
    co2Factor: 0.9, // 0.9kg CO2e saved per kg
    icon: 'Package',
    description: 'Kardus paket belanja online, box makanan tebal, karton kering dipipihkan.',
    color: 'border-amber-500/20 bg-amber-50 text-amber-800'
  },
  {
    id: 'buku-tulis',
    name: 'Buku Tulis Bekas / Kertas HVS',
    category: 'Kertas',
    pointsPerGram: 0.1, // 100 poin per 1.000g (1kg)
    unit: 'gram',
    co2Factor: 1.2,
    icon: 'FileText',
    description: 'Buku catatan bekas yang sudah penuh, arsip tugas, lembar kertas HVS bekas.',
    color: 'border-indigo-500/20 bg-indigo-50 text-indigo-800'
  },
  {
    id: 'gelas-plastik',
    name: 'Gelas Plastik (PP / Cup Minuman)',
    category: 'Plastik',
    pointsPerGram: 0.12, // 120 poin per 1.000g
    unit: 'gram',
    co2Factor: 1.4,
    icon: 'CupSoda',
    description: 'Gelas es boba/kopi/teh, bersihkan sedotan dan tutup plastik sebelum setor.',
    color: 'border-teal-500/20 bg-teal-50 text-teal-800'
  },
  {
    id: 'kaleng-logam',
    name: 'Kaleng Minuman / Aluminium',
    category: 'Logam',
    pointsPerGram: 0.15, // 150 poin per 1.000g
    unit: 'gram',
    co2Factor: 2.1,
    icon: 'Disc',
    description: 'Kaleng soda, kaleng susu kental manis, kaleng biskuit bersih tanpa sisa makanan.',
    color: 'border-purple-500/20 bg-purple-50 text-purple-800'
  },
  {
    id: 'minyak-jelantah',
    name: 'Minyak Jelantah (Minyak Goreng Bekas)',
    category: 'Minyak & Khusus',
    pointsPerGram: 0.2, // 200 poin per 1.000g
    unit: 'ml/gram',
    co2Factor: 2.8,
    icon: 'Droplets',
    description: 'Minyak sisa penggorengan dapur disaring dan disimpan dalam botol tertutup rapat.',
    color: 'border-orange-500/20 bg-orange-50 text-orange-800'
  }
];
