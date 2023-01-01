import React from 'react';
import {
  View,
  Image,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

import BText from '../atoms/BText';
import { Colors, Layout } from '@/constants';
import { scaleSize } from '@/utils';

const containerStyle: StyleProp<ViewStyle> = {
  backgroundColor: Colors.offWhite,
  borderRadius: Layout.radius.md,
  height: scaleSize.verticalScale(80),
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
};

const makeStyle = (props: IProps): StyleProp<ViewStyle> => {
  const { fullWidth = false } = props;

  if (fullWidth) {
    return {
      ...containerStyle,
      flex: 1,
    };
  }
  return containerStyle;
};

interface IProps {
  children?: React.ReactNode;
  icon: ImageSourcePropType | undefined;
  title: string;
  fullWidth: boolean;
}

const BCardOption = (props: IProps) => {
  const { icon, title } = props;

  return (
    <View style={makeStyle(props)}>
      <Image source={icon} />
      <BText>{title}</BText>
    </View>
  );
};

export default BCardOption;
