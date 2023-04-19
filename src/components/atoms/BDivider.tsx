import { colors } from '@/constants';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

const baseStyle = {
  flex: 1,
  borderBottomWidth: 1,
  borderColor: colors.textInput.inActive,
};

const BDivider = (styles: StyleProp<ViewStyle>) => (
  <View style={[baseStyle, styles]} />
);

export default BDivider;
