import React from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { BContainer, BPic, BSpacer, BText } from '@/components';
import { colors, layout } from '@/constants';
import { Dimensions, View } from 'react-native';
import { resScale } from '@/utils';
import { MarkedDates } from 'react-native-calendars/src/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import font from '@/constants/fonts';

const { height } = Dimensions.get('window');

const RenderArrow = ({ direction }: { direction: 'left' | 'right' }) => {
  if (direction === 'right') {
    return (
      <View style={{ position: 'relative', right: resScale(-20) }}>
        <Icon name="chevron-right" size={25} color={colors.black} />
      </View>
    );
  }

  return (
    <View style={{ position: 'relative', left: resScale(-20) }}>
      <Icon name="chevron-left" size={25} color={colors.black} />
    </View>
  );
};

const AppointmentCalendar = () => {
  const [markedDate, setMarkedDate] = React.useState<MarkedDates>({
    '2023-01-01': { marked: true },
  });

  const onDayPress = (day: DateData) => {
    const newMarkedDate = { ...markedDate };
    for (const date of Object.keys(newMarkedDate)) {
      if (newMarkedDate[date].selected && newMarkedDate[date].marked) {
        newMarkedDate[date].selected = false;
      }

      if (newMarkedDate[date].selected) {
        delete newMarkedDate[date];
      }
      newMarkedDate[day.dateString] = {
        ...newMarkedDate[day.dateString],
        selected: true,
        customContainerStyle:{
          backgroundColor:'red'
        }
      };
      console.log(newMarkedDate);
      setMarkedDate(newMarkedDate);
    }
  };

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
    <Modal
      style={{ margin: 0, backgroundColor: colors.white }}
      isVisible={true}
      deviceHeight={height}
    >
      <View style={{ marginHorizontal: layout.pad.lg, flex: 1 }}>
        <Calendar
          theme={{
            arrowColor: colors.black,
            todayTextColor: colors.primary,
            selectedDayTextColor: colors.white,
            selectedDayBackgroundColor: colors.primary,
            dotColor: colors.primary,
            dayTextColor: colors.text.darker,
            textDayFontFamily: 'Montserrat-Regular',
            textMonthFontFamily: 'Montserrat-Medium',
            textDayHeaderFontFamily: 'Montserrat-Medium',
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
      </View>
    </Modal>
  );
};

export default AppointmentCalendar;
