import { colors } from '@/constants';

export const getColorStatusTrx = (id: string) => {
  switch (id) {
    case 'Diajukan' || 'Draft' || 'Dalam Produksi' || 'Selesai':
      return { color: colors.status.grey, textColor: colors.black };
    case 'Cek Barang' || 'Pemeriksaan' || 'Dalam Perjalanan':
      return { color: colors.status.yellow, textColor: colors.black };
    case 'Persiapan' || 'Berlangsung' || 'Bongkar':
      return { color: colors.status.orange, textColor: colors.black };
    case 'Kadaluarsa':
      return { color: colors.status.black, textColor: colors.white };
    case 'Ditolak':
      return { color: colors.status.red, textColor: colors.black };
    case 'Disetujui' || 'Diterima':
      return { color: colors.status.green, textColor: colors.black };
    default:
      return { color: colors.status.grey, textColor: colors.black };
  }
};
