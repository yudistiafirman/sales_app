import { colors } from '@/constants';

export const getColorStatusTrx = (id: string) => {
  switch (id.toUpperCase()) {
    case 'DIAJUKAN' || 'DRAFT' || 'DALAM PRODUKSI' || 'SELESAI':
      return { color: colors.status.grey, textColor: colors.black };
    case 'CEK BARANG' || 'PEMERIKSAAN' || 'DALAM PERJALANAN':
      return { color: colors.status.yellow, textColor: colors.black };
    case 'PERSIAPAN' || 'BERLANGSUNG' || 'BONGKAR':
      return { color: colors.status.orange, textColor: colors.black };
    case 'KADALUARSA':
      return { color: colors.status.black, textColor: colors.white };
    case 'DITOLAK':
      return { color: colors.status.red, textColor: colors.black };
    case 'DISETUJUI' || 'DITERIMA':
      return { color: colors.status.green, textColor: colors.black };
    default:
      return { color: colors.status.grey, textColor: colors.black };
  }
};

export const getStatusTrx = (id: string) => {
  switch (id) {
    case 'DRAFT':
      return 'Diajukan';
    case 'CEK BARANG':
      return 'Cek Barang';
    case 'PERSIAPAN':
      return 'Persiapan';
    case 'KADALUARSA':
      return 'Kadaluarsa';
    case 'DITOLAK':
      return 'Ditolak';
    case 'DISETUJUI':
      return 'Disetujui';
    default:
      return 'N/A';
  }
};
