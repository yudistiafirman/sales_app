import BSearchBar from '@/components/molecules/BSearchBar';
import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import SearchProductStyles from '../styles';
import Icon from 'react-native-vector-icons/Feather';
import scaleSize from '@/utils/scale';
import colors from '@/constants/colors';

interface SearchProductNavbarProps {
  onChangeText?: (((text: string) => void) & Function) | undefined;
  value?: string;
  onClearValue?: (event: GestureResponderEvent) => void;
  onBack?: (event: GestureResponderEvent) => void;
}

const SearchProductNavbar = ({
  onChangeText,
  value,
  onClearValue,
  onBack,
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
