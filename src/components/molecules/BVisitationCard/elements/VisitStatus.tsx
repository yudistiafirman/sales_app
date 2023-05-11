import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BSvg from '@/components/atoms/BSvg';
import SvgNames from '@/components/atoms/BSvg/svgName';
import { colors, fonts, layout } from '@/constants';
import resScale from '@/utils/resScale';

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

type VisitStatusType = {
  status?: string;
};
export default function VisitStatus({ status }: VisitStatusType) {
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
