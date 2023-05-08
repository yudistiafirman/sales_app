import React, { useEffect } from 'react';
import { BSearchBar } from '@/components';
import {
  DeviceEventEmitter,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { resScale } from '@/utils';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { APPOINTMENT, CALENDAR } from '@/navigation/ScreenNames';
import { useAppointmentData } from '@/hooks';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { selectedDateType } from '@/screens/Visitation/elements/fifth';
// // import crashlytics from '@react-native-firebase/crashlytics';
import { colors, layout } from '@/constants';

const SecondStep = () => {
  const [values, dispatchValue] = useAppointmentData();
  const { selectedDate } = values;

  useEffect(() => {
    // // crashlytics().log(APPOINTMENT + '-Step2');
    DeviceEventEmitter.addListener(
      'CalendarScreen.selectedDate',
      (date: selectedDateType) => {
        dispatchValue({
          type: AppointmentActionType.SET_DATE,
          value: date,
        });
      }
    );
    return () => {
      DeviceEventEmitter.removeAllListeners('CalendarScreen.selectedDate');
    };
  }, [dispatchValue]);

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.flexFull}>
      <>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() =>
            navigation.navigate(CALENDAR, {
              useTodayMinDate: true,
            })
          }
        />
        <BSearchBar
          disabled
          activeOutlineColor="gray"
          value={
            selectedDate
              ? selectedDate.day + ' , ' + selectedDate.prettyDate
              : ''
          }
          textColor={colors.textInput.input}
          placeholder={'Pilih Tanggal'}
          right={
            <TextInput.Icon forceTextInputFocus={false} icon="chevron-right" />
          }
        />
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexFull: {
    flex: 1,
  },
  touchable: {
    position: 'absolute',
    display: 'flex',
    width: '100%',
    borderRadius: layout.pad.sm,
    height: resScale(45),
    zIndex: 2,
  },
});

export default SecondStep;
