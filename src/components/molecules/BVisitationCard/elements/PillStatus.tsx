import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import font from '@/constants/fonts';
import colors from '@/constants/colors';
import respFS from '@/utils/resFontSize';
import resScale from '@/utils/resScale';

type pillStatusType = {
  pilStatus?: string;
  color?: string;
};
export default function PillStatus({ pilStatus, color }: pillStatusType) {
  if (!pilStatus) {
    return null;
  }
  return (
    <View
      style={[
        pilStatus ? style.greenPill : null,
        color && { backgroundColor: color },
      ]}
    >
      <Text style={style.greenPillText}>{pilStatus}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  greenPill: {
    padding: resScale(2),
    backgroundColor: '#C2FCC8',
    paddingVertical: resScale(1),
    paddingHorizontal: resScale(10),
    borderRadius: resScale(32),
  },
  grayColor: {
    backgroundColor: colors.status.grey,
  },
  greenPillText: {
    fontFamily: font.family.montserrat[300],
    fontSize: respFS(10),
    color: colors.textInput.input,
  },
});
