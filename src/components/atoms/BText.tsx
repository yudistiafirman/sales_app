import React from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { Text, TextProps, TextStyle } from 'react-native';

const BText = ({
  children,
  style,
  type,
  ...props
}: { children: any; type?: 'default' | 'header' } & TextProps) => {
  const _defaultStyle: TextStyle = {
    color: colors.text.dark,
    fontFamily: font.family.montserrat[400],
    fontSize: font.size.sm,
  };
  let _style: TextStyle = {
    ..._defaultStyle,
  };
  if (type === 'header') {
    _style = {
      ..._defaultStyle,
      fontFamily: font.family.montserrat[600],
      fontSize: font.size.xl,
    };
  }
  return (
    <Text style={[_style, style]} {...props}>
      {children}
    </Text>
  );
};

export default BText;
