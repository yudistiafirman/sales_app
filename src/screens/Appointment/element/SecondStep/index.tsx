import React from 'react';
import { BSearchBar } from '@/components';
import { colors, layout } from '@/constants';
import { StyleSheet, View } from 'react-native';
import { resScale } from '@/utils';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { TextInput } from 'react-native-paper';
import AppointmentCalendar from './AppointmentCalendar';

const SecondStep = () => {
  return (
    <View>
      <TouchableOpacity style={styles.searchBarWrapper}>
        <BSearchBar
          disabled
          placeHolderTextColor={colors.text.dark}
          placeholder="Pilih tanggal"
          right={
            <TextInput.Icon forceTextInputFocus={false} icon="chevron-right" />
          }
        />
      </TouchableOpacity>
      <AppointmentCalendar />
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
