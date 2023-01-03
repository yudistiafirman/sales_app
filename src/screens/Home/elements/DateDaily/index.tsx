import { View, Text } from 'react-native';
import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import scaleSize from '@/utils/scale';
import respFS from '@/utils/respFS';
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
};

export default function DateDaily({
  numDaysInWeek = 5,
  isRender,
  markedDatesArray,
  onDateSelected,
}: DateDailyType) {
  if (!isRender) {
    return null;
  }

  return (
    <View
      style={{
        height: scaleSize.moderateScale(95),
        width: '100%',
      }}
    >
      <CalendarStrip
        onDateSelected={onDateSelected}
        calendarAnimation={{ type: 'parallel', duration: 250 }}
        style={{
          height: scaleSize.moderateScale(95),
          width: '100%',
          paddingTop: scaleSize.moderateScale(5),
          paddingBottom: scaleSize.moderateScale(20),
        }}
        calendarHeaderStyle={{
          color: 'black',
          fontSize: respFS(14),
          marginBottom: scaleSize.moderateScale(15),
          fontFamily: font.family.montserrat[500],
        }}
        calendarColor={'#FFFFFF'}
        dateNumberStyle={{
          fontFamily: font.family.montserrat[500],
          color: colors.textInput.input,
          fontSize: respFS(15),
        }}
        dateNameStyle={{
          fontFamily: font.family.montserrat[300],
          color: colors.textInput.input,
          fontSize: respFS(10),
        }}
        highlightDateNumberStyle={{
          color: 'white',
          backgroundColor: '#E52525',
          borderRadius: 100,
          paddingLeft: 15,
          paddingRight: 15,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,

          elevation: 5,
        }}
        highlightDateNameStyle={{ color: 'grey' }}
        disabledDateNameStyle={{ color: 'grey' }}
        disabledDateNumberStyle={{ color: 'grey' }}
        numDaysInWeek={numDaysInWeek}
        markedDates={markedDatesArray}
      />
    </View>
  );
}
