import React from 'react';
import { BSearchBar, BSpacer } from '@/components';
import Inputs from './Input';
import SearchingCustomer from './SearchingCustomer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppointmentData } from '@/hooks';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { APPOINTMENT } from '@/navigation/ScreenNames';
// // import crashlytics from '@react-native-firebase/crashlytics';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { resScale } from '@/utils';
import { TextInput } from 'react-native-paper';
import { layout } from '@/constants';

const FirstStep = () => {
  const [values, dispatchValue] = useAppointmentData();
  const { searchQuery, isSearching } = values;

  React.useEffect(() => {
    // // crashlytics().log(APPOINTMENT + '-Step1');
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
};

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

export default FirstStep;
