import React from 'react';
import { scaleSize } from '@/utils';
import { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

const containerStyle: StyleProp<ViewStyle> = {
  flex: 1,
  padding: scaleSize.moderateScale(20),
};

interface IProps {
  children: React.ReactNode;
}

const BContainer = (props: IProps) => {
  const { children } = props;
  return <View style={containerStyle}>{children}</View>;
};

export default BContainer;
