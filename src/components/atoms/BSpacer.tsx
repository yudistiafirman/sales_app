import * as React from 'react';
import { resScale } from '@/utils';
import { View, StyleProp, ViewStyle } from 'react-native';

interface IProps {
  size:
    | 'verySmall'
    | 'extraSmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'extraLarge'
    | number;
}

const styles: StyleProp<ViewStyle> = {
  marginHorizontal: resScale(10),
};

const makeStyle = ({ size }: IProps): ViewStyle => {
  if (size === 'verySmall') {
    return {
      ...styles,
      margin: resScale(3),
    };
  }

  if (size === 'extraSmall') {
    return {
      ...styles,
      margin: resScale(5),
    };
  }

  if (size === 'small') {
    return {
      ...styles,
      margin: resScale(10),
    };
  }

  if (size === 'medium') {
    return {
      ...styles,
      margin: resScale(15),
    };
  }

  if (size === 'large') {
    return {
      ...styles,
      margin: resScale(20),
    };
  }

  if (typeof size === 'number') {
    return {
      ...styles,
      margin: resScale(size),
    };
  }

  return styles;
};

const BSpacer = ({ size = 'small' }: IProps) => (
  <View style={makeStyle({ size })} />
);

export default BSpacer;
