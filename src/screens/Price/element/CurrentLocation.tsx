/* eslint-disable react-native/no-inline-styles */
import BText from '@/components/atoms/BText';
import BViewMoreText from '@/components/molecules/BViewMoreText';
import colors from '@/constants/colors';
import scaleSize from '@/utils/scale';
import React from 'react';
import { GestureResponderEvent, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import font from '@/constants/fonts';
interface CurrentLocationProps {
  location?: string | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

const CurrentLocation = ({ location, onPress }: CurrentLocationProps) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        marginHorizontal: scaleSize.moderateScale(16),
        marginBottom: scaleSize.moderateScale(9.5),
      }}
      onPress={onPress}
    >
      <Icon
        name="map-pin"
        style={{ marginRight: scaleSize.moderateScale(8) }}
        color={colors.text.blue}
      />
      <BViewMoreText
        textStyle={{ width: scaleSize.moderateScale(316) }}
        numberOfLines={1}
      >
        <BText
          style={{
            fontFamily: font.family.montserrat['300'],
            fontSize: scaleSize.moderateScale(10),
            color: colors.text.blue,
          }}
        >
          {location}
        </BText>
      </BViewMoreText>
    </TouchableOpacity>
  );
};

export default CurrentLocation;
