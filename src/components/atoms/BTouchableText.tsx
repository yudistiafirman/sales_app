import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import React from 'react';
import {
  GestureResponderEvent,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import BText from './BText';

interface BTouchableTextProps {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  textStyle?: TextStyle | undefined;
  title?: string | undefined;
}

const BTouchableTextDefaultStyle: TextStyle = {
  fontFamily: font.family.montserrat['400'],
  color: colors.primary,
  fontSize: font.size.sm,
  marginRight: scaleSize.moderateScale(14),
};

const BTouchableTextDefaultProps = {
  textStyle: BTouchableTextDefaultStyle,
};

const BTouchableText = ({
  onPress,
  textStyle,
  title,
}: BTouchableTextProps & typeof BTouchableTextDefaultProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <BText style={textStyle}>{title}</BText>
    </TouchableOpacity>
  );
};

BTouchableText.defaultProps = BTouchableTextDefaultProps;

export default BTouchableText;
