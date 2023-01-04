import React from 'react';
// import colors from '@/constants/colors';
// import font from '@/constants/fonts';
// import layout from '@/constants/layout';
import { TextStyle, View, ViewStyle } from 'react-native';
import BText from './BText';
import { scaleSize } from '@/utils';
import { Colors, Font, Layout } from '@/constants';

interface BChipProps {
  children: any;
  type?: 'default' | 'header';
  backgroundColor?: string | undefined;
}

const BChip = ({ children, type, backgroundColor }: BChipProps) => {
  let BChipHeaderStyle: ViewStyle = {
    paddingHorizontal: scaleSize.moderateScale(Layout.pad.md),
    paddingVertical: scaleSize.moderateScale(Layout.pad.xs),
    borderRadius: scaleSize.moderateScale(Layout.radius.sm),
  };

  let BChipDefaultStyle: ViewStyle = {
    paddingVertical: scaleSize.moderateScale(2),
    paddingHorizontal: scaleSize.moderateScale(10),
    borderRadius: scaleSize.moderateScale(32),
    marginRight: scaleSize.moderateScale(8),
  };

  let _style: ViewStyle =
    type === 'header' ? BChipHeaderStyle : BChipDefaultStyle;

  let _textStyle: TextStyle = {
    color: Colors.text.dark,
    fontFamily: Font.family.montserrat[400],
    fontSize: Font.size.xs,
  };

  return (
    <View style={[_style, { backgroundColor: backgroundColor }]}>
      <BText style={[_textStyle]}>{children}</BText>
    </View>
  );
};

export default BChip;
