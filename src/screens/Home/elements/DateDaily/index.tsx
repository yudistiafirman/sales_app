import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import resScale from '@/utils/resScale';
import moment from 'moment';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import { fonts, layout } from '@/constants';

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
  onDateSelected: (date: moment.Moment) => void;
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

  const locale = {
    name: 'en',
    config: {
      months: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    },
  };

  const renderTodayBtn = () => {
    return (
      <TouchableOpacity
        onPress={() => onDateSelected(moment())}
        style={[
          style.today,
          {
            borderColor:
              moment().date() === moment(selectedDate).date()
                ? colors.primary
                : colors.text.secondary,
          },
        ]}
      >
        <Text
          style={[
            style.todayText,
            {
              color:
                moment().date() === moment(selectedDate).date()
                  ? colors.primary
                  : colors.text.secondary,
            },
          ]}
        >
          Hari ini
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {renderTodayBtn()}
      <CalendarStrip
        selectedDate={selectedDate}
        onDateSelected={onDateSelected}
        calendarAnimation={{ type: 'parallel', duration: 250 }}
        style={style.calendarStyle}
        calendarHeaderStyle={style.calendarHeaderStyle}
        calendarColor={calendarColor}
        dateNumberStyle={style.dateNumberStyle}
        dateNameStyle={style.dateNameStyle}
        numDaysInWeek={5}
        highlightDateNumberStyle={style.highlightDateNumberStyle}
        disabledDateNameStyle={style.disabledDateNameStyle}
        disabledDateNumberStyle={style.disabledDateNumberStyle}
        // numDaysInWeek={numDaysInWeek}
        iconLeftStyle={style.icon}
        iconRightStyle={style.icon}
        markedDates={markedDatesArray}
        scrollable={true}
        locale={locale}
      />
    </View>
  );
}

const style = StyleSheet.create({
  calendarStyle: {
    height: resScale(64),
    width: '100%',
  },
  calendarHeaderStyle: {
    color: colors.text.secondary,
    fontSize: font.size.sm,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    alignSelf: 'flex-end',
    marginRight: layout.pad.lg,
  },
  dateNumberStyle: {
    fontFamily: 'Montserrat-Regular',
    color: colors.textInput.input,
    fontSize: fonts.size.lg,
    fontWeight: '500',
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
    paddingHorizontal: layout.pad.md,
    fontSize: font.size.lg,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
  },
  icon: {
    width: resScale(12),
    marginBottom: layout.pad.lg + layout.pad.md,
  },
  today: {
    width: resScale(52),
    height: resScale(20),
    borderWidth: 1,
    borderRadius: layout.radius.sm,
    borderColor: colors.primary,
    position: 'absolute',
    left: layout.pad.lg,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayText: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.sm,
    color: colors.primary,
  },
  disabledDateNameStyle: { color: colors.border.grey },
  disabledDateNumberStyle: { color: colors.border.grey },
});
