import React from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { BContainer, BPic, BSpacer, BText } from '@/components';
import { colors } from '@/constants';
import { View } from 'react-native';
import { resScale } from '@/utils';
import { MarkedDates } from 'react-native-calendars/src/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

const RenderArrow = ({ direction }: { direction: 'left' | 'right' }) => {
  if (direction === 'right') {
    return (
      <View style={{ position: 'relative', right: resScale(-20) }}>
        <Icon name="chevron-right" size={25} color={colors.icon.primary} />
      </View>
    );
  }

  return (
    <View style={{ position: 'relative', left: resScale(-20) }}>
      <Icon name="chevron-left" size={25} color={colors.icon.primary} />
    </View>
  );
};

const Fourth = () => {
  const [markedDate, setMarkedDate] = React.useState<MarkedDates>({
    '2023-01-01': { marked: true },
  });

  const onDayPress = (day: DateData) => {
    const newMarkedDate = { ...markedDate };
    for (const date of Object.keys(newMarkedDate)) {
      // if ()
      console.log(date, 'ini apa??');
      if (newMarkedDate[date].selected && newMarkedDate[date].marked) {
        newMarkedDate[date].selected = false;
      }

      if (newMarkedDate[date].selected) {
        console.log('masuk sini');
        console.log(newMarkedDate[date]);
        delete newMarkedDate[date];
      }
      newMarkedDate[day.dateString] = {
        ...newMarkedDate[day.dateString],
        selected: true,
      };
      setMarkedDate(newMarkedDate);
    }
  };

  return (
    <ScrollView>
      <BText>4</BText>
      <Calendar
        theme={{
          arrowColor: colors.black,
          todayTextColor: colors.primary,
          selectedDayTextColor: colors.white,
          selectedDayBackgroundColor: colors.primary,
          dotColor: colors.primary,
        }}
        onDayPress={onDayPress}
        markedDates={markedDate}
        renderArrow={(direction) => <RenderArrow direction={direction} />}
      />
      <BSpacer size="medium" />
      <BContainer bgc="grey" radius="md" border>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <BText type="title">PT. Guna Karya</BText>
          <Icon name="chevron-down" size={25} color={colors.icon.darkGrey} />
        </View>
        <BText>Asu Asu</BText>
        <BSpacer size="medium" />
        <BPic
          name="Joko"
          email="EMAIL"
          phone="896308263262"
          position="position"
          border={false}
        />
      </BContainer>
    </ScrollView>
  );
};

export default Fourth;
