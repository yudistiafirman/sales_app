import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import font from '@/constants/fonts';
import respFS from '@/utils/resFontSize';
import colors from '@/constants/colors';
import HighlightText from '../../../atoms/BHighlightText';

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
          <Text style={style.bluePillText}>{`+${
            pilNames.length - 1
          } lagi`}</Text>
        </View>
      );
    }
    return null;
  }
  return (
    <View style={style.container}>
      <View
        style={[style.bluePill, style.margin, { backgroundColor: pillColor }]}
      >
        <HighlightText
          fontSize={10}
          name={pilNames[0]}
          searchQuery={searchQuery}
        />
      </View>
      {nameCount()}
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: resScale(10),
  },
  bluePill: {
    padding: resScale(2),
    paddingVertical: resScale(1),
    paddingHorizontal: resScale(10),
    borderRadius: resScale(32),
  },
  bluePillText: {
    fontFamily: font.family.montserrat[400],
    fontSize: respFS(10),
    color: colors.textInput.input,
  },
  margin: {
    marginRight: resScale(10),
  },
});
