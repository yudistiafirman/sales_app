import { TextInput } from 'react-native-paper';
import React from 'react';
import { BSearchBar } from '@/components';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { useAppointmentData } from '@/hooks';

const SearchBar = () => {
  const [values, dispatchValue] = useAppointmentData();
  const { searchQuery } = values;
  return (
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
  );
};

export default SearchBar;
