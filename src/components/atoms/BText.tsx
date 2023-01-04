import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Colors, Font } from '@/constants';
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
    color: Colors.text.dark,
    fontFamily: Font.family.montserrat[400],
    fontSize: Font.size.sm,
  };
  let _style: TextStyle = {
    ..._defaultStyle,
  };
  if (type === 'header') {
    _style = {
      ..._style,
      fontFamily: Font.family.montserrat[600],
      fontSize: Font.size.xl,
    };
  }

  if (color === 'primary') {
    _style = {
      ..._style,
      color: Colors.primary,
    };
  }

  if (color === 'divider') {
    _style = {
      ..._style,
      color: Colors.text.divider,
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
