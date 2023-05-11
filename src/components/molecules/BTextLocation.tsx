import React, { Children } from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { fonts, layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import BText from '../atoms/BText';

type BTextLocationProps = {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  location: string;
  disabled?: boolean | undefined;
  numberOfLines?: number;
};

function BTextLocation({ onPress, location, disabled, numberOfLines }: BTextLocationProps) {
  return (
    <TouchableOpacity disabled={disabled} style={{ flexDirection: 'row' }} onPress={onPress}>
      <Icon name="map-pin" style={{ marginRight: layout.pad.md }} color={colors.text.blue} />
      <BText
        numberOfLines={numberOfLines}
        style={{
          fontFamily: font.family.montserrat[300],
          fontSize: fonts.size.xs,
          color: colors.text.blue,
        }}>
        {location}
      </BText>
    </TouchableOpacity>
  );
}

export default BTextLocation;
