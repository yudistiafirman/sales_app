import React, { useEffect } from 'react';
import { BSearchBar } from '@/components';
import { colors, layout } from '@/constants';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import { resScale } from '@/utils';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CALENDAR } from '@/navigation/ScreenNames';
import { useAppointmentData } from '@/hooks';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { selectedDateType } from '@/screens/Visitation/elements/fourth';

const SecondStep = () => {
  const [values, dispatchValue] = useAppointmentData();
  const placeHolder =
    values.selectedDate !== null
      ? `${values.selectedDate.day} , ${values.selectedDate.prettyDate}`
      : 'Pilih Tanggal';

  useEffect(() => {
    DeviceEventEmitter.addListener(
      'CalendarScreen.selectedDate',
      (date: selectedDateType) => {
        console.log(date);
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
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate(CALENDAR)}
        style={styles.searchBarWrapper}
      >
        <BSearchBar
          disabled
          placeHolderTextColor={colors.text.dark}
          placeholder={placeHolder}
          right={
            <TextInput.Icon forceTextInputFocus={false} icon="chevron-right" />
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarWrapper: {
    marginHorizontal: layout.pad.lg,
    width: resScale(328),
    height: resScale(50),
  },
});

export default SecondStep;
