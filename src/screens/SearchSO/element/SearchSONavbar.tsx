import React from 'react';
import {
  View,
  GestureResponderEvent,
  ViewStyle,
  Platform,
  StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { BSearchBar } from '@/components';
import { layout } from '@/constants';
import { resScale } from '@/utils';

interface SearchSONavbarProps {
  onChangeText?: (((text: string) => void) & Function) | undefined;
  value?: string;
  onClearValue?: (event: GestureResponderEvent) => void;
  customStyle?: ViewStyle;
  autoFocus?: boolean;
}

function SearchSONavbar({
  onChangeText,
  value,
  onClearValue,
  customStyle,
  autoFocus,
}: SearchSONavbarProps) {
  return (
    <View style={customStyle || styles.searchBarContainer}>
      <BSearchBar
        value={value}
        textInputStyle={
          Platform.OS !== 'android' && { paddingBottom: layout.pad.sm }
        }
        onChangeText={onChangeText}
        placeholder="Cari File SO"
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

const styles = StyleSheet.create({
  searchBarContainer: {
    width: resScale(293),
  },
});

export default SearchSONavbar;
