import { TextInput } from 'react-native-paper';
import React, { useCallback } from 'react';
import { BSearchBar } from '@/components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { resScale } from '@/utils';

const SearchBar = ({onPress}:{onPress:()=> void}) => {

  return (
    <TouchableOpacity style={{ height: resScale(50) }} onPress={onPress}>
    <BSearchBar
      placeholder="Cari Pelanggan"
      activeOutlineColor="gray"
      disabled
      left={
        <TextInput.Icon
          // onPress={onSearch}
          forceTextInputFocus={false}
          icon="magnify"
        />
      }
    />
    </TouchableOpacity>

  );
};

export default SearchBar;
