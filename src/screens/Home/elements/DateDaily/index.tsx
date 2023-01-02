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
        height: scaleSize.moderateScale(95),
        width: '100%',
      }}
    >
      <CalendarStrip
        calendarAnimation={{ type: 'parallel', duration: 250 }}
        style={{
          height: scaleSize.moderateScale(95),
          width: '100%',
          paddingTop: scaleSize.moderateScale(5),
          paddingBottom: scaleSize.moderateScale(20),
        }}
        calendarHeaderStyle={{
          color: 'black',
          fontSize: respFS(15),
          marginBottom: scaleSize.moderateScale(15),
        }}
        calendarColor={'#FFFFFF'}
        dateNumberStyle={{ color: 'black' }}
        dateNameStyle={{ color: 'gray' }}
        highlightDateNumberStyle={{
          color: 'white',
          backgroundColor: '#E52525',
          borderRadius: 100,
          paddingLeft: 12,
          paddingRight: 12,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,

          elevation: 5,
          //   #00000029
        }}
        highlightDateNameStyle={{ color: 'red' }}
        disabledDateNameStyle={{ color: 'grey' }}
        disabledDateNumberStyle={{ color: 'grey' }}
        numDaysInWeek={numDaysInWeek}
      />
    </View>
  );
}
