import { View, Text } from 'react-native';
import React from 'react';
import CalendarStrip from 'react-native-calendar-strip';
import scaleSize from '@/utils/scale';
import respFS from '@/utils/respFS';
type DateDailyType = {
  numDaysInWeek?: number;
  isRender?: boolean;
};
export default function DateDaily({
  numDaysInWeek = 5,
  isRender,
}: DateDailyType) {
  if (!isRender) {
    return null;
  }

  return (
    <View
      style={{
        height: scaleSize.moderateScale(100),
        width: '100%',
      }}
    >
      <CalendarStrip
        calendarAnimation={{ type: 'parallel', duration: 250 }}
        style={{
          height: scaleSize.moderateScale(100),
          width: '100%',
          paddingTop: scaleSize.moderateScale(20),
          paddingBottom: scaleSize.moderateScale(20),
        }}
        calendarHeaderStyle={{
          color: 'black',
          fontSize: respFS(15),
          marginBottom: scaleSize.moderateScale(15),
        }}
        calendarColor={'#FFFFFF'}
        dateNumberStyle={{ color: 'black' }}
        dateNameStyle={{ color: 'black' }}
        highlightDateNumberStyle={{ color: 'red' }}
        highlightDateNameStyle={{ color: 'red' }}
        disabledDateNameStyle={{ color: 'grey' }}
        disabledDateNumberStyle={{ color: 'grey' }}
        numDaysInWeek={numDaysInWeek}
      />
    </View>
  );
}
