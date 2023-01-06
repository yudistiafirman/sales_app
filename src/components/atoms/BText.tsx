import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { colors, fonts } from '@/constants';
import { resFontSize } from '@/utils';

interface IProps {
  children: React.ReactNode;
  type?: 'default' | 'header';
  color?: 'primary' | 'divider';
  bold?:
    | 'bold'
    | '400'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
  size?: 'small' | 'normal' | 'large';
}

const BText = ({
  children,
  style,
  type,
  color,
  bold,
  size,
  ...props
}: IProps & TextProps) => {
  const _defaultStyle: TextStyle = {
    color: colors.text.dark,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
  };
  let _style: TextStyle = {
    ..._defaultStyle,
  };
  if (type === 'header') {
    _style = {
      ..._style,
      fontFamily: fonts.family.montserrat[600],
      fontSize: fonts.size.xl,
    };
  }

  if (color === 'primary') {
    _style = {
      ..._style,
      color: colors.primary,
    };
  }

  if (color === 'divider') {
    _style = {
      ..._style,
      color: colors.text.divider,
    };
  }

  if (bold) {
    _style = {
      ..._style,
      fontWeight: bold,
    };
  }

  if (size) {
    _style = {
      ..._style,
      fontSize: resFontSize(10),
    };
  }

  return (
    <Text style={[_style, style]} {...props}>
      {children}
    </Text>
  );
};

export default BText;
