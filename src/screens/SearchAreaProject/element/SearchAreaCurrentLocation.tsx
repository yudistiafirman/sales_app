import { BText } from '@/components';
import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import SearchAreaStyles from '../styles';

const SearchAreaCurrentLocation = ({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[SearchAreaStyles.currentLocationContainer]}
    >
      <Icons
        name="my-location"
        style={{ marginRight: resScale(12) }}
        size={resScale(16)}
        color={disabled ? `${colors.text.darker}40` : colors.text.darker}
      />
      <BText
        style={[
          SearchAreaStyles.currentLocationText,
          { color: disabled ? `${colors.text.darker}40` : colors.text.darker },
        ]}
      >
        Gunakan Lokasi Saat Ini
      </BText>
    </TouchableOpacity>
  );
};

export default SearchAreaCurrentLocation;
