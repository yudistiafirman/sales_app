import BText from '@/components/atoms/BText';
import colors from '@/constants/colors';
import scaleSize from '@/utils/scale';
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
        style={{ marginRight: scaleSize.moderateScale(12) }}
        size={scaleSize.moderateScale(16)}
        color={colors.text.darker}
      />
      <BText style={SearchAreaStyles.currentLocationText}>
        Gunakan Lokasi Saat Ini
      </BText>
    </TouchableOpacity>
  );
};

export default SearchAreaCurrentLocation;
