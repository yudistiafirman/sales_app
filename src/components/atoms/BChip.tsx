import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import BText from './BText';
import { resScale } from '@/utils';
import { colors, fonts, layout } from '@/constants';

interface BChipProps {
  children: any;
  type?: 'default' | 'header';
  backgroundColor?: string | undefined;
  textColor?: string | undefined;
}

const BChip = ({ children, type, backgroundColor, textColor }: BChipProps) => {
  let BChipHeaderStyle: ViewStyle = {
    paddingHorizontal: layout.pad.md,
    paddingVertical: layout.pad.xs,
    borderRadius: layout.radius.sm,
  };

  let BChipDefaultStyle: ViewStyle = {
    paddingVertical: layout.pad.xs,
    paddingHorizontal: layout.pad.md + layout.pad.xs,
    borderRadius: layout.radius.xl,
    marginRight: layout.pad.md,
  };

  let _style: ViewStyle =
    type === 'header' ? BChipHeaderStyle : BChipDefaultStyle;

  let _textStyle: TextStyle = {
    color: textColor ? textColor : colors.text.dark,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.xs,
  };

  return (
    <View style={[_style, { backgroundColor: backgroundColor }]}>
      <BText style={[_textStyle]}>{children}</BText>
    </View>
  );
};

export default BChip;
