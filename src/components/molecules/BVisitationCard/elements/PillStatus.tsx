import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import respFS from '@/utils/respFS';
import scaleSize from '@/utils/scale';

type pillStatusType = {
  pilStatus?: string;
};
export default function PillStatus({ pilStatus }: pillStatusType) {
  if (!pilStatus) {
    return null;
  }
  return (
    <View style={[pilStatus ? style.greenPill : null]}>
      <Text style={style.greenPillText}>{pilStatus}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  greenPill: {
    padding: scaleSize.moderateScale(2),
    backgroundColor: '#C2FCC8',
    paddingVertical: scaleSize.moderateScale(1),
    paddingHorizontal: scaleSize.moderateScale(10),
    borderRadius: scaleSize.moderateScale(32),
  },
  greenPillText: {
    fontFamily: font.family.montserrat[300],
    fontSize: respFS(10),
    color: colors.textInput.input,
  },
});
