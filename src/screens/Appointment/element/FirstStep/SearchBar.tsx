import { TextInput } from 'react-native-paper';
import React, { useCallback } from 'react';
import { BSearchBar } from '@/components';
import { AppointmentActionType } from '@/context/AppointmentContext';
import { useAppointmentData } from '@/hooks';
import debounce from 'lodash.debounce';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { getAllProject } from '@/redux/async-thunks/commonThunks';
const SearchBar = () => {
  const [values, dispatchValue] = useAppointmentData();
  const { searchQuery } = values;
  const dispatch = useDispatch<AppDispatch>();
  const searchDispatch = useCallback(
    (text: string) => {
      dispatch(getAllProject({ search: text }));
    },
    [dispatch]
  );
  const onChangeWithDebounce = React.useMemo(() => {
    return debounce((text: string) => {
      searchDispatch(text);
    }, 500);
  }, [searchDispatch]);

  const onChangeSearch = (text: string) => {
    dispatchValue({ type: AppointmentActionType.SEARCH_QUERY, value: text });
    onChangeWithDebounce(text);
  };
  return (
    <BSearchBar
      value={searchQuery}
      placeholder="Search"
      activeOutlineColor="gray"
      onChangeText={onChangeSearch}
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
