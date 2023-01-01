import { Colors } from '@/constants';
import React from 'react';
import { View } from 'react-native';

const baseStyle = {
  flex: 1,
  borderBottomWidth: 1,
  borderColor: Colors.textInput.inActive,
};

const BDivider = () => <View style={baseStyle} />;

export default BDivider;
