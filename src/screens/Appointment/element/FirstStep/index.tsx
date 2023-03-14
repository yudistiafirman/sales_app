import React, { useState } from 'react';
import { BSpacer } from '@/components';
import Inputs from './Input';
import SearchingCustomer from './SearchingCustomer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppointmentData } from '@/hooks';
import { StyleSheet, View } from 'react-native';
import SearchBar from './SearchBar';
import { APPOINTMENT } from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';
import { AppointmentActionType } from '@/context/AppointmentContext';

const FirstStep = () => {
  const [values,dispatchValue] = useAppointmentData();
  const { searchQuery,isSearching } = values;

  React.useEffect(() => {
    crashlytics().log(APPOINTMENT + '-Step1');
  }, []);

  return (
    <View style={styles.firstStepContainer}>
      {isSearching ? (
        <SearchingCustomer />
      ) : (
        <>
        <SearchBar onPress={()=>dispatchValue({
          type:AppointmentActionType.ENABLE_SEARCHING,
          value:true
        })}/>
        <BSpacer size="extraSmall" />
        <KeyboardAwareScrollView>
          <Inputs />
        </KeyboardAwareScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  firstStepContainer: {
    width: '100%',
  },
});

export default FirstStep;
