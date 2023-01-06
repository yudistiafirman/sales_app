import BsearchBar from '@/components/molecules/BsearchBar';
import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import PriceStyle from '../PriceStyle';
import { TextInput } from 'react-native-paper';

const PriceSearchBar = ({
  onPress,
}: {
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  return (
    <TouchableOpacity style={PriceStyle.searchBarWrapper} onPress={onPress}>
      <BsearchBar
        left={<TextInput.Icon icon="magnify" />}
        placeholder="Cari Produk"
        disabled
      />
    </TouchableOpacity>
  );
};

export default PriceSearchBar;
