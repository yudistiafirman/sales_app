/* eslint-disable react/react-in-jsx-scope */
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import layout from '@/constants/layout';
import scaleSize from '@/utils/scale';
import { TextStyle, View, ViewStyle } from 'react-native';
import BText from './BText';

interface BChipProps {
  children: any;
  type?: 'default' | 'header';
  backgroundColor?: string | undefined;
}

const BChip = ({ children, type, backgroundColor }: BChipProps) => {
  let BChipHeaderStyle: ViewStyle = {
    paddingHorizontal: scaleSize.moderateScale(layout.pad.md),
    paddingVertical: scaleSize.moderateScale(layout.pad.xs),
    borderRadius: scaleSize.moderateScale(layout.radius.sm),
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
    color: colors.text.dark,
    fontFamily: font.family.montserrat[400],
    fontSize: font.size.xs,
  };
  return (
    <View style={[_style, { backgroundColor: backgroundColor }]}>
      <BText style={[_textStyle]}>{children}</BText>
    </View>
  );
};

export default BChip;
