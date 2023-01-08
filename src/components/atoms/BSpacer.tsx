import { layout } from '@/constants';
import { scaleSize } from '@/utils';
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

interface IProps {
  size: 'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge' | number;
}

const styles: StyleProp<ViewStyle> = {
  marginHorizontal: scaleSize.moderateScale(10),
};

const makeStyle = ({ size }: IProps): ViewStyle => {
  if (size === 'extraSmall') {
    return {
      ...styles,
      margin: layout.pad.xs,
    };
  }

  if (size === 'small') {
    return {
      ...styles,
      margin: layout.pad.sm,
    };
  }

  if (size === 'medium') {
    return {
      ...styles,
      margin: layout.pad.md,
    };
  }

  if (size === 'large') {
    return {
      ...styles,
      margin: layout.pad.lg,
    };
  }

  if (size === 'extraLarge') {
    return {
      ...styles,
      margin: layout.pad.xl,
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
