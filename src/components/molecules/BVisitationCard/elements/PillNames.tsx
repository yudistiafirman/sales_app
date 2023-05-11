import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts, layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import respFS from '@/utils/resFontSize';
import resScale from '@/utils/resScale';
import HighlightText from '../../../atoms/BHighlightText';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: layout.pad.xs + layout.pad.md,
  },
  bluePill: {
    padding: layout.pad.xs,
    paddingVertical: layout.pad.xs,
    paddingHorizontal: layout.pad.xs + layout.pad.md,
    borderRadius: layout.radius.xl,
  },
  bluePillText: {
    fontFamily: font.family.montserrat[400],
    fontSize: fonts.size.xs,
    color: colors.textInput.input,
  },
  margin: {
    marginRight: layout.pad.md + layout.pad.xs,
  },
});

type PillNamesType = {
  pilNames?: string[];
  searchQuery?: string;
  pillColor?: string;
};
export default function PillNames({
  pilNames = [],
  searchQuery,
  pillColor = colors.blueSky,
}: PillNamesType) {
  if (!pilNames.length) {
    return null;
  }
  function nameCount() {
    if (pilNames?.length > 1) {
      return (
        <View style={[style.bluePill]}>
          <Text style={style.bluePillText}>{`+${pilNames.length - 1} lagi`}</Text>
        </View>
      );
    }
    return null;
  }
  return (
    <View style={style.container}>
      <View style={[style.bluePill, style.margin, { backgroundColor: pillColor }]}>
        <HighlightText fontSize={fonts.size.xs} name={pilNames[0]} searchQuery={searchQuery} />
      </View>
      {nameCount()}
    </View>
  );
}
