import { colors } from '@/constants';
import { resScale } from '@/utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { MarkedDates } from 'react-native-calendars/src/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BCalendarProps {
  onDayPress?: ((date: DateData) => void) | undefined;
  markedDates?: MarkedDates | undefined;
  onMonthChange?: ((date: DateData) => void) | undefined;
  isLoading?: boolean;
}

const RenderArrow = ({ direction }: { direction: 'left' | 'right' }) => {
  if (direction === 'right') {
    return (
      <View style={styles.arrowStyleRight}>
        <Icon name="chevron-right" size={25} color={colors.black} />
      </View>
    );
  }

  return (
    <View style={styles.arrowStyleLeft}>
      <Icon name="chevron-left" size={25} color={colors.black} />
    </View>
  );
};

const BCalendar = ({
  onDayPress,
  markedDates,
  onMonthChange,
  isLoading,
}: BCalendarProps) => {
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

  return (
    <Calendar
      theme={{
        arrowColor: colors.black,
        todayTextColor: colors.primary,
        selectedDayTextColor: colors.white,
        selectedDayBackgroundColor: colors.primary,
        dotColor: colors.primary,
        dayTextColor: colors.text.darker,
        textDayFontFamily: 'Montserrat-Regular',
        textMonthFontFamily: 'Montserrat-SemiBold',
        textDayHeaderFontFamily: 'Montserrat-Medium',
      }}
      onDayPress={onDayPress}
      markedDates={markedDates}
      renderArrow={(direction) => <RenderArrow direction={direction} />}
      onMonthChange={onMonthChange}
      displayLoadingIndicator={isLoading}
    />
  );
};

const styles = StyleSheet.create({
  arrowStyleRight: {
    position: 'relative',
    right: resScale(-20),
  },
  arrowStyleLeft: {
    position: 'relative',
    left: resScale(-20),
  },
});

export default BCalendar;
