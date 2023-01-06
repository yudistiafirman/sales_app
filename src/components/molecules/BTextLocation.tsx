/* eslint-disable react-native/no-inline-styles */
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import React, { Children } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import BText from '../atoms/BText';

type BTextLocationProps = {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  location: string;
  disabled?: boolean | undefined;
};

const BTextLocation = ({ onPress, location, disabled }: BTextLocationProps) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{ flexDirection: 'row' }}
      onPress={onPress}
    >
      <Icon
        name="map-pin"
        style={{ marginRight: scaleSize.moderateScale(8) }}
        color={colors.text.blue}
      />
      <BText
        style={{
          fontFamily: font.family.montserrat['300'],
          fontSize: scaleSize.moderateScale(10),
          color: colors.text.blue,
        }}
      >
        {location}
      </BText>
    </TouchableOpacity>
  );
};

export default BTextLocation;
