import { scaleSize } from '@/utils';
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

interface IProps {
  size: 'extraSmall' | 'small' | 'medium' | 'large' | number;
}

const styles: StyleProp<ViewStyle> = {
  marginHorizontal: scaleSize.moderateScale(10),
};

const makeStyle = ({ size }: IProps): ViewStyle => {
  if (size === 'extraSmall') {
    return {
      ...styles,
      margin: scaleSize.moderateScale(5),
    };
  }

  if (size === 'small') {
    return {
      ...styles,
      margin: scaleSize.moderateScale(10),
    };
  }

  if (size === 'medium') {
    return {
      ...styles,
      margin: scaleSize.moderateScale(15),
    };
  }

  if (size === 'large') {
    return {
      ...styles,
      margin: scaleSize.moderateScale(20),
    };
  }

  if (typeof size === 'number') {
    return {
      ...styles,
      margin: scaleSize.moderateScale(size),
    };
  }

  return styles;
};

const BSpacer = ({ size = 'small' }: IProps) => (
  <View style={makeStyle({ size })} />
);

export default BSpacer;
