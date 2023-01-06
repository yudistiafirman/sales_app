import React from 'react';
import { scaleSize } from '@/utils';
import { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { Colors, Layout } from '@/constants';

interface IProps {
  children: React.ReactNode;
  bgc?: 'grey';
  radius?: 'sm' | 'md' | 'lg';
  border?: boolean;
}

const containerStyle: StyleProp<ViewStyle> = {
  flex: 1,
  padding: scaleSize.moderateScale(20),
};

const makeStyle = ({ bgc, radius, border }: IProps): StyleProp<ViewStyle> => {
  let styles = containerStyle;
  if (bgc === 'grey') {
    styles = {
      ...styles,
      backgroundColor: Colors.offWhite,
    };
  }

  if (radius) {
    styles = {
      ...styles,
      borderRadius:
        radius === 'sm'
          ? Layout.radius.sm
          : radius === 'md'
          ? Layout.radius.md
          : Layout.radius.lg,
    };
  }

  if (border) {
    styles = {
      ...styles,
      borderWidth: 1,
      borderColor: Colors.border.default,
    };
  }

  return styles;
};

const BContainer = (props: IProps) => {
  const { children } = props;
  return <View style={makeStyle(props)}>{children}</View>;
};

export default BContainer;
