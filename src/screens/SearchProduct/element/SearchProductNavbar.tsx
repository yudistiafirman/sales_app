import { BSearchBar } from '@/components';
import React from 'react';
import { View, GestureResponderEvent, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import SearchProductStyles from '../styles';

interface SearchProductNavbarProps {
  onChangeText?: (((text: string) => void) & Function) | undefined;
  value?: string;
  onClearValue?: (event: GestureResponderEvent) => void;
  customStyle?: ViewStyle;
}

const SearchProductNavbar = ({
  onChangeText,
  value,
  onClearValue,
  customStyle,
}: SearchProductNavbarProps) => {
  return (
    <View
      style={customStyle ? customStyle : SearchProductStyles.searchBarContainer}
    >
      <BSearchBar
        value={value}
        onChangeText={onChangeText}
        placeholder="Cari Produk"
        left={<TextInput.Icon icon="magnify" />}
        right={
          value &&
          value?.length > 0 && (
            <TextInput.Icon onPress={onClearValue} icon="close" />
          )
        }
      />
    </View>
  );
};

export default SearchProductNavbar;
