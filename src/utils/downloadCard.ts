import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import { User } from '../types';

/**
 * Downloads the student ID Card container element as a high-resolution PNG image
 */
export async function downloadStudentCardImage(
  element: HTMLElement,
  student: User
): Promise<boolean> {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 3, // High-DPI / Retinal crystal clarity
      cacheBust: true,
      backgroundColor: '#022c22', // Emerald 950
    });

    const safeName = student.Nama_Siswa.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Kartu_ID_EcoSchool_${safeName}_${student.NISN}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export student card image:', error);
    return false;
  }
}

/**
 * Generates and downloads a clean standalone QR badge image for the student
 */
export async function downloadStudentQRBadge(student: User): Promise<boolean> {
  try {
    const payload = JSON.stringify({
      nisn: student.NISN,
      name: student.Nama_Siswa,
      id: student.UserID,
      app: 'EcoSchool',
    });

    // Create high-res QR Data URL
    const qrDataUrl = await QRCode.toDataURL(payload, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#022c22',
        light: '#ffffff',
      },
    });

    // Draw on an HTML5 canvas with branded header & student metadata
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const width = 700;
    const height = 900;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.roundRect ? ctx.roundRect(0, 0, width, height, 40) : ctx.rect(0, 0, width, height);
    ctx.fill();

    // Top Header Banner
    ctx.fillStyle = '#064e3b'; // emerald 900
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(0, 0, width, 160, [40, 40, 0, 0]);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, 160);
    }

    // Header Text
    ctx.fillStyle = '#10b981'; // emerald-500
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ECO SCHOOL', width / 2, 65);

    ctx.fillStyle = '#a7f3d0'; // emerald-200
    ctx.font = '600 20px sans-serif';
    ctx.fillText('SMAN 2 BANJARMASIN • BANK SAMPAH', width / 2, 105);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`ID: ${student.UserID}`, width / 2, 138);

    // QR Image Load
    const qrImage = new Image();
    await new Promise<void>((resolve, reject) => {
      qrImage.onload = () => resolve();
      qrImage.onerror = reject;
      qrImage.src = qrDataUrl;
    });

    // Draw QR in Center with frame
    const qrSize = 420;
    const qrX = (width - qrSize) / 2;
    const qrY = 200;

    // Subtle border for QR
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 24);
      ctx.stroke();
    }
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

    // Student Info Block
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(student.Nama_Siswa, width / 2, 680);

    ctx.fillStyle = '#059669'; // emerald-600
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`NISN: ${student.NISN}  •  KELAS: ${student.Kelas}`, width / 2, 725);

    // Footer instruction
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = '500 16px sans-serif';
    ctx.fillText('Tunjukkan QR ini kepada Petugas saat Menyetor Sampah', width / 2, 790);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`Saldo Poin: ${student.Total_Poin.toLocaleString()} Pts`, width / 2, 835);

    // Trigger Download
    const finalDataUrl = canvas.toDataURL('image/png');
    const safeName = student.Nama_Siswa.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `QR_Siswa_${safeName}_${student.NISN}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = finalDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to generate QR badge:', err);
    return false;
  }
}
