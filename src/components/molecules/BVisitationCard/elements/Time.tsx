import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import resScale from '@/utils/resScale';
import { colors, fonts, layout } from '@/constants';

type TimeType = {
  time?: string;
};
export default function Time({ time }: TimeType) {
  if (!time) {
    return null;
  }
  return (
    <View style={[style.container]}>
      <MaterialIcon
        name="clock-time-four-outline"
        style={style.iconStyle}
        size={resScale(13)}
        color={colors.black}
      />
      <Text style={style.textStyle}>{time}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    marginRight: layout.pad.md,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    marginRight: layout.pad.md,
  },
  textStyle: {
    fontFamily: fonts.family.montserrat[300],
    color: colors.text.darker,
    fontSize: fonts.size.xs,
  },
});
