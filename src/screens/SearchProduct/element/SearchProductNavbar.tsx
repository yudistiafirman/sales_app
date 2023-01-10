import { BSearchBar } from '@/components';
import React from 'react';
import { View, GestureResponderEvent } from 'react-native';
import { TextInput } from 'react-native-paper';
import SearchProductStyles from '../styles';

interface SearchProductNavbarProps {
  onChangeText?: (((text: string) => void) & Function) | undefined;
  value?: string;
  onClearValue?: (event: GestureResponderEvent) => void;
}

const SearchProductNavbar = ({
  onChangeText,
  value,
  onClearValue,
}: SearchProductNavbarProps) => {
  return (
    <View style={SearchProductStyles.searchBarContainer}>
      <BSearchBar
        value={value}
        onChangeText={onChangeText}
        placeholder="Cari Produk"
        left={<TextInput.Icon icon="magnify" />}
        right={
          value?.length > 0 && (
            <TextInput.Icon onPress={onClearValue} icon="close" />
          )
        }
      />
    </View>
  );
};

export default SearchProductNavbar;
