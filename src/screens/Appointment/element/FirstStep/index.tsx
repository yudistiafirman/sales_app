import crashlytics from '@react-native-firebase/crashlytics';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-paper';
import { BSearchBar, BSpacer } from '@/components';
import { layout } from '@/constants';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { useAppointmentData } from '@/hooks';
import { APPOINTMENT } from '@/navigation/ScreenNames';
import { resScale } from '@/utils';
import SearchingCustomer from './SearchingCustomer';
import Inputs from './Input';

const styles = StyleSheet.create({
  flexFull: {
    flex: 1,
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: layout.radius.sm,
    height: resScale(45),
    zIndex: 2,
  },
});

function FirstStep() {
  const [values, dispatchValue] = useAppointmentData();
  const { searchQuery, isSearching } = values;

  React.useEffect(() => {
    crashlytics().log(`${APPOINTMENT}-Step1`);
  }, []);

  return (
    <SafeAreaView style={styles.flexFull}>
      {isSearching ? (
        <SearchingCustomer />
      ) : (
        <>
          <TouchableOpacity
            style={styles.touchable}
            onPress={() =>
              dispatchValue({
                type: AppointmentActionType.ENABLE_SEARCHING,
                value: true,
              })
            }
          />
          <BSearchBar
            placeholder="Cari PT / Proyek"
            activeOutlineColor="gray"
            disabled
            left={<TextInput.Icon forceTextInputFocus={false} icon="magnify" />}
          />
          <View style={{ flex: 1 }}>
            <BSpacer size="extraSmall" />
            <KeyboardAwareScrollView>
              <Inputs />
            </KeyboardAwareScrollView>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

export default FirstStep;
