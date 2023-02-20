import { colors } from '@/constants';
import { NativeModules } from 'react-native';
const { RNCustomConfig } = NativeModules;

const flavor = RNCustomConfig?.flavor;

export const getColorStatusTrx = (id: string) => {
  customLog(id.toUpperCase(), 'uppercase');

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
    case 'DISETUJUI' || 'DITERIMA' || 'DITERBITKAN':
      return { color: colors.chip.green, textColor: colors.black };
    default:
      return { color: colors.chip.green, textColor: colors.black };
  }
};

export const getStatusTrx = (id: string) => {
  switch (id) {
    case 'DRAFT':
      return 'Diterbitkan';
    case 'SUBMITTED':
      return 'Diajukan';
    case 'PARTIALLY_PROCESSED':
      return 'Persiapan';
    case 'PARTIALLY_PAID':
      return 'Disetujui';
    case 'PAID':
      return 'Diterima';
    case 'CANCELLED':
      return 'Ditolak';
    default:
      return 'N/A';
  }
};

export const beautifyPhoneNumber = (text: string) => {
  let firstChar: string[] = text.match(/.{1,3}/g) ?? [];
  let result = '';
  if (firstChar.length > 0) {
    result += firstChar[0];
    firstChar = firstChar.splice(1, 4);
    firstChar = firstChar.join('').match(/.{1,4}/g) ?? [];
    result += ' ' + firstChar.join(' ');
  } else {
    result += firstChar.join('');
  }
  return result;
};

export const customLog = (message?: any, ...optionalParams: any[]) => {
  if (isDevelopment()) console.log(message, optionalParams);
};

export const isDevelopment = () => {
  if (flavor === 'development') {
    return true;
  } else {
    return false;
  }
};

export const isProduction = () => {
  if (flavor === 'production') {
    return true;
  } else {
    return false;
  }
};
