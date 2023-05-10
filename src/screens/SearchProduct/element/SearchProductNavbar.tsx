import React from 'react';
import {
  View, GestureResponderEvent, ViewStyle, Platform,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { layout } from '@/constants';
import { BSearchBar } from '@/components';
import SearchProductStyles from '../styles';

interface SearchProductNavbarProps {
  onChangeText?: (((text: string) => void) & Function) | undefined;
  value?: string;
  onClearValue?: (event: GestureResponderEvent) => void;
  customStyle?: ViewStyle;
  autoFocus?: boolean;
}

function SearchProductNavbar({
  onChangeText,
  value,
  onClearValue,
  customStyle,
  autoFocus,
}: SearchProductNavbarProps) {
  return (
    <View
      style={customStyle || SearchProductStyles.searchBarContainer}
    >
      <BSearchBar
        value={value}
        textInputStyle={
          Platform.OS !== 'android' && { paddingBottom: layout.pad.sm }
        }
        onChangeText={onChangeText}
        placeholder="Cari Produk"
        autoFocus={autoFocus}
        left={<TextInput.Icon icon="magnify" />}
        right={
          value
          && value?.length > 0 && (
            <TextInput.Icon onPress={onClearValue} icon="close" />
          )
        }
      />
    </View>
  );
}

export default SearchProductNavbar;
