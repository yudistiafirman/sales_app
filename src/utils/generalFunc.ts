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
  switch (id.toUpperCase()) {
    case 'DRAFT':
      return 'Diterbitkan';
    case 'SUBMITTED':
      return 'Diajukan';
    case 'PARTIALLY_PROCESSED':
      return 'Persiapan';
    case 'PARTIALLY_PAID':
      return 'Disetujui';
    case 'CONFIRMED':
      return 'Disetujui';
    case 'PAID':
      return 'Diterima';
    case 'CANCELLED':
      return 'Ditolak';
    case 'DECLINED':
      return 'Ditolak';
    default:
      return id;
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

export const isForceUpdate = (text: any): boolean => {
  return text?.is_forced;
};

export const getMinVersionUpdate = (text: any): string => {
  return text?.min_version?.split('.').join('');
};

export const isJsonString = (str: any) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const getSuccessMsgFromAPI = (
  httpMethod: string,
  domainType: string,
  fullUrl: string,
  endPoint: string
) => {
  // excluding: /refresh , /suggestion , /places , /verify-auth , /project_sph

  let finalText = 'Berhasil ';
  switch (httpMethod.toLowerCase()) {
    case 'post':
      finalText += 'menambahkan ';
      break;
    case 'get':
      finalText += 'mengambil ';
      break;
    case 'delete':
      finalText += 'menghapus ';
      break;
    case 'put':
      finalText += 'mengubah ';
      break;
    default:
      finalText += httpMethod.toLowerCase() + ' ';
      break;
  }

  if (
    domainType === 'common-dev.aggre.id' ||
    domainType === 'common.aggre.id'
  ) {
    switch (endPoint.toLowerCase()) {
      case 'projectdoc':
        finalText += 'dokumen';
        break;
      case 'coordinates':
        finalText += 'kordinat lokasi';
        break;
      case 'upload':
        finalText = 'Berhasil upload file';
        break;
      case 'project':
        finalText += 'data proyek';
        break;
      case 'companies-by-user':
        finalText += 'data proyek berdasarkan user';
        break;
      case 'sph':
        finalText += 'dokumen SPH';
        break;
      case 'individual':
        finalText += 'detail proyek';
        break;
      case 'billing-address':
        finalText += 'alamat penagihan';
        break;
      case 'login':
        finalText = 'Berhasil login';
        break;
      case 'logout':
        finalText = 'Berhasil logout';
        break;
      default:
        if (fullUrl.toLowerCase().includes('places/'))
          finalText = 'Berhasil mendapatkan detail alamat';
        else if (fullUrl.toLowerCase().includes('project/'))
          finalText += 'detail proyek';
        else finalText += 'data';
        break;
    }
  } else if (
    domainType === 'inventory-dev.aggre.id' ||
    domainType === 'inventory.aggre.id'
  ) {
    switch (endPoint.toLowerCase()) {
      case 'category':
        finalText += 'data semua produk berdasarkan kategori';
        break;
      case 'product':
        finalText += 'data semua produk';
        break;
      default:
        finalText += 'data';
        break;
    }
  } else if (
    domainType === 'productivity-dev.aggre.id' ||
    domainType === 'productivity.aggre.id'
  ) {
    switch (endPoint.toLowerCase()) {
      case 'all-visitation':
        finalText += 'data semua kunjungan';
        break;
      case 'completed-visitation':
        finalText += 'data target kunjungan';
        break;
      case 'visitation':
        finalText += 'data kunjungan';
        break;
      case 'visitation-book':
        finalText = 'Berhasil buat janji';
        break;
      default:
        if (fullUrl.toLowerCase().includes('visitation/'))
          finalText += 'data kunjungan';
        else finalText += 'data';
        break;
    }
  } else if (
    domainType === 'order-dev.aggre.id' ||
    domainType === 'order.aggre.id'
  ) {
    switch (endPoint.toLowerCase()) {
      case 'project-sph':
        finalText += 'data semua SPH berdasarkan proyek';
        break;
      case 'quotation':
        finalText += 'data SPH';
        break;
      case 'purchase-order':
        finalText += 'data PO';
        break;
      case 'quotation-letter':
        finalText += 'data SPH';
        break;
      case 'deposit':
        finalText = '';
        break;
      case 'schedule':
        finalText = '';
        break;
      default:
        if (fullUrl.toLowerCase().includes('sph/')) finalText += 'dokumen SPH';
        else if (fullUrl.toLowerCase().includes('purchase-order/'))
          finalText += 'data detail PO';
        else if (fullUrl.toLowerCase().includes('quotation-letter/'))
          finalText += 'data detail SPH';
        else finalText += 'data';
        break;
    }
  } else {
    finalText += 'data';
  }
  return finalText;
};

export const uniqueStringGenerator = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
