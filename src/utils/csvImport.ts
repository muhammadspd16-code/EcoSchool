import { User } from '../types';

export interface CSVParseResult {
  success: boolean;
  importedUsers: User[];
  errors: string[];
  skippedCount: number;
  detectedDelimiter: string;
}

/**
 * Robust CSV and TSV parser for Sheet 1: Users.
 * Handles:
 * - UTF-8 BOM (\uFEFF)
 * - Comma (,), Semicolon (;), Tab (\t), Pipe (|)
 * - Quoted fields with embedded commas/semicolons
 * - Flexible Indonesian & English column headers
 * - Auto-generation of UserID if missing or blank
 * - Direct copy-paste from Excel / Google Sheets
 */
export function parseUsersCSV(
  rawInput: string,
  existingUsers: User[] = []
): CSVParseResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      success: false,
      importedUsers: [],
      errors: ['File atau teks input kosong.'],
      skippedCount: 0,
      detectedDelimiter: ',',
    };
  }

  // 1. Strip UTF-8 BOM if present
  let cleanInput = rawInput.replace(/^\uFEFF/, '').trim();
  if (cleanInput.length === 0) {
    return {
      success: false,
      importedUsers: [],
      errors: ['File CSV kosong atau tidak memiliki baris data.'],
      skippedCount: 0,
      detectedDelimiter: ',',
    };
  }

  // 2. Split into non-empty lines regardless of \r\n, \n, or \r
  const allLines = cleanInput
    .split(/\r\n|\n|\r/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (allLines.length === 0) {
    return {
      success: false,
      importedUsers: [],
      errors: ['Tidak ada baris data yang ditemukan.'],
      skippedCount: 0,
      detectedDelimiter: ',',
    };
  }

  // 3. Detect Delimiter using first few non-empty lines
  const sampleLines = allLines.slice(0, Math.min(5, allLines.length)).join('\n');
  const countTabs = (sampleLines.match(/\t/g) || []).length;
  const countSemicolons = (sampleLines.match(/;/g) || []).length;
  const countCommas = (sampleLines.match(/,/g) || []).length;
  const countPipes = (sampleLines.match(/\|/g) || []).length;

  let delimiter = ',';
  if (countTabs > countCommas && countTabs > countSemicolons) {
    delimiter = '\t';
  } else if (countSemicolons > countCommas) {
    delimiter = ';';
  } else if (countPipes > countCommas && countPipes > countSemicolons) {
    delimiter = '|';
  }

  // Helper: parse a single CSV line with quote support
  const parseLine = (line: string, delim: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delim && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  // 4. Header Detection
  const firstRowCols = parseLine(allLines[0], delimiter).map(h => 
    h.toLowerCase().replace(/[^a-z0-9]/g, '')
  );

  let idxUserId = -1;
  let idxNisn = -1;
  let idxNama = -1;
  let idxKelas = -1;
  let idxPoin = -1;

  firstRowCols.forEach((col, idx) => {
    if (col === 'userid' || col === 'id' || col === 'idsiswa' || col === 'kodesiswa') {
      idxUserId = idx;
    } else if (col === 'nisn' || col === 'nis' || col === 'nomorinduk' || col === 'noinduk' || col === 'nim') {
      idxNisn = idx;
    } else if (col.includes('namasiswa') || col.includes('namalengkap') || col === 'nama' || col === 'name' || col === 'student') {
      idxNama = idx;
    } else if (col === 'kelas' || col === 'class' || col === 'rombel' || col === 'tingkat' || col === 'jurusan') {
      idxKelas = idx;
    } else if (col.includes('poin') || col.includes('point') || col.includes('saldo') || col.includes('totalpoin') || col === 'score') {
      idxPoin = idx;
    }
  });

  const hasRecognizedHeader = idxNama !== -1 || idxNisn !== -1;
  const startRowIndex = hasRecognizedHeader ? 1 : 0;

  // If no header found, map by standard column position: [UserID, NISN, Nama, Kelas, Poin]
  if (!hasRecognizedHeader) {
    idxUserId = 0;
    idxNisn = 1;
    idxNama = 2;
    idxKelas = 3;
    idxPoin = 4;
  }

  const importedUsers: User[] = [];
  const errors: string[] = [];
  let skippedCount = 0;

  // Determine starting UserID increment
  let maxIdNum = 0;
  existingUsers.forEach(u => {
    const num = parseInt(u.UserID.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > maxIdNum) maxIdNum = num;
  });

  const usedNisns = new Set<string>();

  for (let i = startRowIndex; i < allLines.length; i++) {
    const line = allLines[i];
    if (!line.trim()) continue;

    const cols = parseLine(line, delimiter);
    if (cols.length < 2) {
      skippedCount++;
      continue;
    }

    // Extract values with fallbacks
    let rawUserId = idxUserId !== -1 && cols[idxUserId] ? cols[idxUserId].trim() : '';
    let rawNisn = idxNisn !== -1 && cols[idxNisn] ? cols[idxNisn].trim() : '';
    let rawNama = idxNama !== -1 && cols[idxNama] ? cols[idxNama].trim() : '';
    let rawKelas = idxKelas !== -1 && cols[idxKelas] ? cols[idxKelas].trim() : '';
    let rawPoinStr = idxPoin !== -1 && cols[idxPoin] ? cols[idxPoin].trim() : '0';

    // If UserID looks like a NISN and NISN is empty
    if (!rawNisn && rawUserId && /^\d{4,12}$/.test(rawUserId)) {
      rawNisn = rawUserId;
      rawUserId = '';
    }

    // If Nama is empty but we have at least 2 columns, try positional fallback
    if (!rawNama && cols.length >= 2) {
      // Find the first column with alphabet letters
      const textCol = cols.find(c => /[a-zA-Z]{2,}/.test(c));
      if (textCol) rawNama = textCol;
    }

    // If still no name and no NISN, skip
    if (!rawNama && !rawNisn) {
      skippedCount++;
      continue;
    }

    // Default Fallbacks
    if (!rawNisn) {
      rawNisn = `${10000 + importedUsers.length + maxIdNum}`;
    }
    if (!rawNama) {
      rawNama = `Siswa ${rawNisn}`;
    }
    if (!rawKelas) {
      rawKelas = 'Umum';
    }

    // Clean Poin
    const cleanedPoin = parseInt(rawPoinStr.replace(/[^0-9-]/g, '') || '0', 10);
    const totalPoin = isNaN(cleanedPoin) ? 0 : Math.max(0, cleanedPoin);

    // Auto-generate UserID if missing or empty
    if (!rawUserId) {
      maxIdNum++;
      rawUserId = `USR-${String(maxIdNum).padStart(3, '0')}`;
    }

    // Prevent in-file duplicate NISN collisions
    let finalNisn = rawNisn;
    if (usedNisns.has(finalNisn)) {
      finalNisn = `${rawNisn}-${importedUsers.length + 1}`;
    }
    usedNisns.add(finalNisn);

    importedUsers.push({
      UserID: rawUserId,
      NISN: finalNisn,
      Nama_Siswa: rawNama,
      Kelas: rawKelas,
      Total_Poin: totalPoin,
    });
  }

  if (importedUsers.length === 0) {
    return {
      success: false,
      importedUsers: [],
      errors: ['Tidak ada baris siswa yang berhasil dibaca. Pastikan format teks/CSV valid.'],
      skippedCount,
      detectedDelimiter: delimiter,
    };
  }

  return {
    success: true,
    importedUsers,
    errors,
    skippedCount,
    detectedDelimiter: delimiter,
  };
}
