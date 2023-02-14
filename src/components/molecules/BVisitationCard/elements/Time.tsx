import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, fonts } from '@/constants';

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
    marginRight: resScale(7),
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    marginRight: resScale(7),
  },
  textStyle: {
    fontFamily: fonts.family.montserrat[300],
    color: colors.text.darker,
    fontSize: fonts.size.xs,
  },
});
