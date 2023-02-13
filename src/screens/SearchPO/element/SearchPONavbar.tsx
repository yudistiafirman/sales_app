import { BSearchBar } from '@/components';
import { resScale } from '@/utils';
import * as React from 'react';
import {
  View,
  GestureResponderEvent,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-paper';

interface SearchPONavbarProps {
  onChangeText?: (((text: string) => void) & Function) | undefined;
  value?: string;
  onClearValue?: (event: GestureResponderEvent) => void;
  customStyle?: ViewStyle;
}

const SearchPONavbar = ({
  onChangeText,
  value,
  onClearValue,
  customStyle,
}: SearchPONavbarProps) => {
  return (
    <View style={customStyle ? customStyle : styles.searchBarContainer}>
      <BSearchBar
        value={value}
        onChangeText={onChangeText}
        placeholder="Cari PO"
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

const styles = StyleSheet.create({
  searchBarContainer: {
    width: resScale(293),
  },
});

export default SearchPONavbar;
