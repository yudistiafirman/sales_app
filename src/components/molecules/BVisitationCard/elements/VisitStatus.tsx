import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import { colors, fonts, layout } from '@/constants';
import BSvg from '@/components/atoms/BSvg';
import SvgNames from '@/components/atoms/BSvg/svgName';

type visitStatusType = {
  status?: string;
};
export default function VisitStatus({ status }: visitStatusType) {
  if (!status) {
    return null;
  }
  return (
    <View style={style.container}>
      <BSvg
        widthHeight={resScale(13)}
        color={colors.text.darker}
        svgName={SvgNames.IC_LIST}
        type="fill"
      />
      <Text style={style.textStyle}>{status}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: resScale(7),
  },
  textStyle: {
    fontFamily: fonts.family.montserrat[300],
    color: colors.text.darker,
    fontSize: fonts.size.xs,
    marginLeft: layout.pad.sm,
  },
});
