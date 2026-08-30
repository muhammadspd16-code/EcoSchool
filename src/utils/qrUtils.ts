import QRCode from 'qrcode';

export async function generateQRDataUrl(text: string): Promise<string> {
  try {
    const url = await QRCode.toDataURL(text, {
      width: 256,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
    return url;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function parseStudentQR(data: string): { nisn: string; name?: string } | null {
  if (!data) return null;
  const clean = data.trim();
  
  // Format 1: Direct JSON e.g. {"nisn":"12345","name":"Budi Santoso"}
  if (clean.startsWith('{') && clean.endsWith('}')) {
    try {
      const parsed = JSON.parse(clean);
      if (parsed.nisn || parsed.NISN) {
        return {
          nisn: String(parsed.nisn || parsed.NISN),
          name: parsed.name || parsed.Nama_Siswa,
        };
      }
    } catch {
      // ignore
    }
  }

  // Format 2: Prefix e.g. ECO:12345 or NISN:12345
  if (clean.toUpperCase().startsWith('ECO:') || clean.toUpperCase().startsWith('NISN:')) {
    const parts = clean.split(':');
    return { nisn: parts[1].trim() };
  }

  // Format 3: Raw numeric NISN string (e.g. 12345 or 0071234567)
  return { nisn: clean };
}
