import { StyleSheet } from 'react-native';
import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import resScale from '@/utils/resScale';
import moment from 'moment';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import { fonts } from '@/constants';

type markOption = {
  color: string;
  selectedColor?: string;
};

type lineDates = {
  date: string | moment.Moment;
  lines: markOption[];
};
type dotsDates = {
  date: string | moment.Moment;
  dots: markOption[];
};
type markedDates = lineDates | dotsDates;
type DateDailyType = {
  numDaysInWeek?: number;
  isRender?: boolean;
  markedDatesArray?: markedDates[];
  onDateSelected?: (date: moment.Moment) => void;
  calendarColor?: string;
  selectedDate?: moment.Moment | Date | undefined;
};

export default function DateDaily({
  // numDaysInWeek = 5,
  isRender,
  markedDatesArray,
  onDateSelected,
  calendarColor = '#FFFFFF',
  selectedDate,
}: DateDailyType) {
  if (!isRender) {
    return null;
  }

  return (
    <CalendarStrip
      selectedDate={selectedDate}
      onDateSelected={onDateSelected}
      calendarAnimation={{ type: 'parallel', duration: 250 }}
      style={style.calendarStyle}
      calendarHeaderStyle={style.calendarHeaderStyle}
      calendarColor={calendarColor}
      dateNumberStyle={style.dateNumberStyle}
      dateNameStyle={style.dateNameStyle}
      highlightDateNumberStyle={style.highlightDateNumberStyle}
      highlightDateNameStyle={style.highlightDateNameStyle}
      disabledDateNameStyle={style.disabledDateNameStyle}
      disabledDateNumberStyle={style.disabledDateNumberStyle}
      // numDaysInWeek={numDaysInWeek}
      markedDates={markedDatesArray}
      scrollable={true}
    />
  );
}

const style = StyleSheet.create({
  calendarStyle: {
    height: resScale(95),
    width: '100%',
  },
  calendarHeaderStyle: {
    color: 'black',
    fontSize: font.size.sm,
    fontFamily: font.family.montserrat[500],
  },
  dateNumberStyle: {
    fontFamily: font.family.montserrat[500],
    color: colors.textInput.input,
    fontSize: fonts.size.md,
  },
  dateNameStyle: {
    fontFamily: font.family.montserrat[300],
    color: colors.textInput.input,
    fontSize: fonts.size.xs,
  },
  highlightDateNumberStyle: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: resScale(100),
    paddingHorizontal: resScale(10),
    shadowColor: colors.black,
    shadowOffset: {
      width: resScale(0),
      height: resScale(2),
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  highlightDateNameStyle: {
    fontSize: fonts.size.xs,
    color: colors.border.grey,
    // margin: 0,
    // backgroundColor: 'blue',
  },
  disabledDateNameStyle: { color: colors.border.grey },
  disabledDateNumberStyle: { color: colors.border.grey },
});
