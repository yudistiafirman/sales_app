import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Colors, Font } from '@/constants';

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
}

const BText = ({
  children,
  style,
  type,
  color,
  bold,
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

  return (
    <Text style={[_style, style]} {...props}>
      {children}
    </Text>
  );
};

export default BText;
