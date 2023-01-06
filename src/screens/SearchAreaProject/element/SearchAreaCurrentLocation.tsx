import BText from '@/components/atoms/BText';
import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import SearchAreaStyles from '../styles';

const SearchAreaCurrentLocation = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={SearchAreaStyles.currentLocationContainer}
    >
      <Icons
        name="my-location"
        style={{ marginRight: resScale(12) }}
        size={resScale(16)}
        color={colors.text.darker}
      />
      <BText style={SearchAreaStyles.currentLocationText}>
        Gunakan Lokasi Saat Ini
      </BText>
    </TouchableOpacity>
  );
};

export default SearchAreaCurrentLocation;
