import React from 'react';
import { GestureResponderEvent, TextStyle, TouchableOpacity } from 'react-native';
import BText from './BText';
import { layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';

interface BTouchableTextProps {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  textStyle?: TextStyle | undefined;
  title?: string | undefined;
  disabled?: boolean;
}

const BTouchableTextDefaultStyle: TextStyle = {
  fontFamily: font.family.montserrat[400],
  color: colors.primary,
  fontSize: font.size.sm,
  marginRight: layout.pad.ml + layout.pad.xs,
};

const BTouchableTextDefaultProps = {
  textStyle: BTouchableTextDefaultStyle,
};

function BTouchableText({
  onPress,
  textStyle,
  title,
  disabled = false,
}: BTouchableTextProps & typeof BTouchableTextDefaultProps) {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <BText style={[textStyle, disabled && { color: colors.text.inactive }]}>{title}</BText>
    </TouchableOpacity>
  );
}

BTouchableText.defaultProps = BTouchableTextDefaultProps;

export default BTouchableText;
