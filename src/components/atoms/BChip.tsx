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
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  titleWeight?: string;
}

const BChip = ({
  children,
  type,
  backgroundColor,
  textColor,
  endIcon,
  startIcon,
  titleWeight,
}: BChipProps) => {
  let BChipHeaderStyle: ViewStyle = {
    paddingHorizontal: layout.pad.md,
    paddingVertical: layout.pad.xs,
    borderRadius: layout.radius.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  };

  let BChipDefaultStyle: ViewStyle = {
    paddingVertical: layout.pad.xs,
    paddingHorizontal: layout.pad.md + layout.pad.xs,
    borderRadius: layout.radius.xl,
    marginRight: layout.pad.md,
    flexDirection: 'row',
    alignItems: 'center',
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
      {startIcon}
      <BText style={[_textStyle, { fontWeight: titleWeight }]}>
        {children}
      </BText>
      {endIcon}
    </View>
  );
};

export default BChip;
