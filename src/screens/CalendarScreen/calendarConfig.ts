import { LocaleConfig } from 'react-native-calendars';

const defineLocalConfig = () => {
  LocaleConfig.locales.id = {
    monthNames: [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ],
    monthNamesShort: [
      'Jan',
      'Feb',
      'Mar',
      'April',
      'Mei',
      'Jun',
      'Jul',
      'Agus',
      'Sept',
      'Okt.',
      'Nov.',
      'Des.',
    ],
    dayNames: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    dayNamesShort: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    today: 'Hari ini',
  };

  LocaleConfig.defaultLocale = 'id';
};

export default defineLocalConfig
