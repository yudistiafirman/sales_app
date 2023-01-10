import React from 'react';
<<<<<<< HEAD
=======
import { resScale } from '@/utils';
>>>>>>> c377bcae0c363430396fd57ae3c255916b274206
import { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { colors, layout } from '@/constants';

interface IProps {
  children: React.ReactNode;
  bgc?: 'grey';
  radius?: 'sm' | 'md' | 'lg';
  border?: boolean;
}

const containerStyle: StyleProp<ViewStyle> = {
  flex: 1,
<<<<<<< HEAD
  padding: layout.pad.lg,
=======
  padding: resScale(20),
>>>>>>> c377bcae0c363430396fd57ae3c255916b274206
};

const makeStyle = ({ bgc, radius, border }: IProps): StyleProp<ViewStyle> => {
  let styles = containerStyle;
  if (bgc === 'grey') {
    styles = {
      ...styles,
      backgroundColor: colors.offWhite,
    };
  }

  if (radius) {
    styles = {
      ...styles,
      borderRadius:
        radius === 'sm'
          ? layout.radius.sm
          : radius === 'md'
          ? layout.radius.md
          : layout.radius.lg,
    };
  }

  if (border) {
    styles = {
      ...styles,
      borderWidth: 1,
      borderColor: colors.border.default,
    };
  }

  return styles;
};

const BContainer = (props: IProps) => {
  const { children } = props;
  return <View style={makeStyle(props)}>{children}</View>;
};

export default BContainer;
