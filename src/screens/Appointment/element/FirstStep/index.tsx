import React from 'react';
import { BSpacer } from '@/components';
import Inputs from './Input';
import SearchingCustomer from './SearchingCustomer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppointmentData } from '@/hooks';
import { StyleSheet } from 'react-native';
import SearchBar from './SearchBar';

const FirstStep = () => {
  const [values] = useAppointmentData();
  const { searchQuery } = values;

  return (
    <KeyboardAwareScrollView style={styles.firstStepContainer}>
      <SearchBar />
      <BSpacer size="extraSmall" />
      {searchQuery.length > 0 ? <SearchingCustomer /> : <Inputs />}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  firstStepContainer: {
    width: '100%',
  },
});

export default FirstStep;
