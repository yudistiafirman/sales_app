import colors from '@/constants/colors';
import font from '@/constants/fonts';
import layout from '@/constants/layout';
import {TextStyle, View, ViewStyle} from 'react-native';
import BText from './BText';

const BChip = ({
  children,
  type,
}: {
  children: any;
  type?: 'default' | 'header';
}) => {
  let _style: ViewStyle = {
    backgroundColor: colors.border,
    paddingHorizontal: layout.pad.md,
    paddingVertical: layout.pad.xs,
    borderRadius: layout.radius.sm,
  };
  let _textStyle: TextStyle = {
    color: colors.text.dark,
    fontFamily: font.family.montserrat[400],
  };
  return (
    <View style={[_style]}>
      <BText style={[_textStyle]}>{children}</BText>
    </View>
  );
};

export default BChip;
