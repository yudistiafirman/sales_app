import React from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import layout from '@/constants/layout';
import { TextStyle, View, ViewStyle } from 'react-native';
import BText from './BText';
import { scaleSize } from '@/utils';

const BChip = ({
  children,
  type,
}: {
  children: any;
  type?: 'default' | 'header' | 'products';
}) => {
  let _style: ViewStyle = {
    backgroundColor: colors.border.default,
    paddingHorizontal: layout.pad.md,
    paddingVertical: layout.pad.xs,
    borderRadius: layout.radius.sm,
    position: 'relative',
  };
  let _textStyle: TextStyle = {
    color: colors.text.dark,
    fontFamily: font.family.montserrat[400],
  };

  if (type === 'products') {
    const red: ViewStyle = {
      borderTopLeftRadius: layout.radius.sm,
      borderBottomLeftRadius: layout.radius.sm,
      backgroundColor: colors.primary,
      width: scaleSize.moderateScale(5),
      height: scaleSize.verticalScale(20),
      position: 'absolute',
      left: 0,
      top: 0,
    };

    return (
      <View style={_style}>
        <View style={red} />
        <BText style={[_textStyle]}>{children}</BText>
      </View>
    );
  }

  return (
    <View style={[_style]}>
      <BText style={[_textStyle]}>{children}</BText>
    </View>
  );
};

export default BChip;
