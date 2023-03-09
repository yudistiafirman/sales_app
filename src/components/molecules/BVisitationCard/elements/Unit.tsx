import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import Icons from 'react-native-vector-icons/Entypo';
import { colors, fonts } from '@/constants';

type UnitType = {
  unit?: string;
};
export default function Unit({ unit }: UnitType) {
  if (!unit) {
    return null;
  }
  return (
    <View style={[style.container]}>
      <Icons
        name="text-document"
        style={style.iconStyle}
        size={resScale(13)}
        color={colors.black}
      />
      <Text style={style.textStyle}>{unit}</Text>
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
