import { User, LogTransaksi, RewardItem, LogPenukaran } from '../types';

export function convertToCSV(headers: string[], rows: (string | number)[][]): string {
  const headerLine = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
  const rowLines = rows.map(row => 
    row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
  );
  return [headerLine, ...rowLines].join('\n');
}

export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateUsersCSV(users: User[]): string {
  const headers = ['UserID', 'NISN', 'Nama_Siswa', 'Kelas', 'Total_Poin'];
  const rows = users.map(u => [u.UserID, u.NISN, u.Nama_Siswa, u.Kelas, u.Total_Poin]);
  return convertToCSV(headers, rows);
}

export function generateTransactionsCSV(transactions: LogTransaksi[]): string {
  const headers = ['ID_Transaksi', 'Timestamp', 'NISN_Siswa', 'Jenis_Sampah', 'Berat_Gram', 'Poin_Didapat'];
  const rows = transactions.map(t => [t.ID_Transaksi, t.Timestamp, t.NISN_Siswa, t.Jenis_Sampah, t.Berat_Gram, t.Poin_Didapat]);
  return convertToCSV(headers, rows);
}

export function generateRewardsCSV(rewards: RewardItem[]): string {
  const headers = ['RewardID', 'Nama_Item', 'Poin_Dibutuhkan'];
  const rows = rewards.map(r => [r.RewardID, r.Nama_Item, r.Poin_Dibutuhkan]);
  return convertToCSV(headers, rows);
}

export function generateRedemptionsCSV(redemptions: LogPenukaran[]): string {
  const headers = ['ID_Penukaran', 'Timestamp', 'NISN_Siswa', 'Nama_Siswa', 'RewardID', 'Nama_Item', 'Poin_Dipakai', 'Status', 'KodeKlaim'];
  const rows = redemptions.map(r => [r.ID_Penukaran, r.Timestamp, r.NISN_Siswa, r.Nama_Siswa, r.RewardID, r.Nama_Item, r.Poin_Dipakai, r.Status, r.KodeKlaim]);
  return convertToCSV(headers, rows);
}

export function copyTableToClipboard(headers: string[], rows: (string | number)[][]): Promise<void> {
  const tsvHeader = headers.join('\t');
  const tsvRows = rows.map(r => r.join('\t')).join('\n');
  const tsvFull = `${tsvHeader}\n${tsvRows}`;
  return navigator.clipboard.writeText(tsvFull);
}
