import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import PriceStyle from '../PriceStyle';
import { TextInput } from 'react-native-paper';
import { BSearchBar } from '@/components';

const PriceSearchBar = ({
  onPress,
}: {
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity style={PriceStyle.searchBarWrapper} onPress={onPress}>
      <BSearchBar
        left={<TextInput.Icon forceTextInputFocus={false} icon="magnify" />}
        placeholder="Cari Produk"
        disabled
      />
    </TouchableOpacity>
  );
};

export default PriceSearchBar;
