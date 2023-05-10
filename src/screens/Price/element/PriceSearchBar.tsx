import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import PriceStyle from '../PriceStyle';
import { BSearchBar } from '@/components';

function PriceSearchBar({
  onPress,
}: {
  onPress?: (event: GestureResponderEvent) => void;
}) {
  return (
    <TouchableOpacity style={PriceStyle.searchBarWrapper} onPress={onPress}>
      <BSearchBar
        left={<TextInput.Icon forceTextInputFocus={false} icon="magnify" />}
        placeholder="Cari Produk"
        disabled
      />
    </TouchableOpacity>
  );
}

export default PriceSearchBar;
