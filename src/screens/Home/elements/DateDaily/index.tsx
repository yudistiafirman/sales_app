import { StyleSheet } from 'react-native';
import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import resScale from '@/utils/resScale';
import respFS from '@/utils/resFontSize';
import moment from 'moment';
import font from '@/constants/fonts';
import colors from '@/constants/colors';

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
  onDateSelected?: () => void;
  calendarColor?: string;
};

export default function DateDaily({
  numDaysInWeek = 5,
  isRender,
  markedDatesArray,
  onDateSelected,
  calendarColor = '#FFFFFF',
}: DateDailyType) {
  if (!isRender) {
    return null;
  }

  return (
    <CalendarStrip
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
      numDaysInWeek={numDaysInWeek}
      markedDates={markedDatesArray}
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
    fontSize: respFS(15),
  },
  dateNameStyle: {
    fontFamily: font.family.montserrat[300],
    color: colors.textInput.input,
    fontSize: respFS(10),
  },
  highlightDateNumberStyle: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: resScale(100),
    paddingLeft: resScale(15),
    paddingRight: resScale(15),
    shadowColor: colors.black,
    shadowOffset: {
      width: resScale(0),
      height: resScale(2),
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  highlightDateNameStyle: { color: colors.border.grey },
  disabledDateNameStyle: { color: colors.border.grey },
  disabledDateNumberStyle: { color: colors.border.grey },
});
