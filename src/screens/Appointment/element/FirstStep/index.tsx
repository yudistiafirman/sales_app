import React from 'react';
import { BSpacer } from '@/components';
import Inputs from './Input';
import SearchingCustomer from './SearchingCustomer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppointmentData } from '@/hooks';
import { StyleSheet, View } from 'react-native';
import SearchBar from './SearchBar';
import { APPOINTMENT } from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';

const FirstStep = () => {
  const [values] = useAppointmentData();
  const { searchQuery } = values;

  React.useEffect(() => {
    crashlytics().log(APPOINTMENT + '-Step1');
  }, []);

  return (
    <View style={styles.firstStepContainer}>
      <SearchBar />
      <BSpacer size="extraSmall" />
      {searchQuery.length > 0 ? (
        <SearchingCustomer />
      ) : (
        <KeyboardAwareScrollView>
          <Inputs />
        </KeyboardAwareScrollView>
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
