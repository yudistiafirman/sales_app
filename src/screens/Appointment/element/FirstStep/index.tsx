import { TextInput } from 'react-native-paper';
import React from 'react';
import { BSearchBar, BSpacer } from '@/components';
import { AppointmentActionType } from '@/context/AppointmentContext';
import Inputs from './Input';
import SearchingCustomer from './SearchingCustomer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppointmentData } from '@/hooks';
import { StyleSheet } from 'react-native';

const FirstStep = () => {
  const [values, dispatchValue] = useAppointmentData();
  const { searchQuery } = values;

  return (
    <KeyboardAwareScrollView style={styles.firstStepContainer}>
      <BSearchBar
        value={searchQuery}
        placeholder="Search"
        activeOutlineColor="gray"
        onChangeText={(e) =>
          dispatchValue({ type: AppointmentActionType.SEARCH_QUERY, value: e })
        }
        left={
          <TextInput.Icon
            // onPress={onSearch}
            forceTextInputFocus={false}
            icon="magnify"
          />
        }
        right={
          <TextInput.Icon
            onPress={() =>
              dispatchValue({
                type: AppointmentActionType.SEARCH_QUERY,
                value: '',
              })
            }
            forceTextInputFocus={false}
            icon="close"
          />
        }
      />
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
