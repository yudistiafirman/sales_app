import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import scaleSize from '@/utils/scale';
import font from '@/constants/fonts';
import respFS from '@/utils/respFS';
import colors from '@/constants/colors';
import HighlightText from './HighlightText';

type PillNamesType = {
  pilNames?: string[];
  searchQuery?: string;
};
export default function PillNames({
  pilNames = [],
  searchQuery,
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
      <View style={[style.bluePill, style.margin]}>
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
    marginTop: scaleSize.moderateScale(10),
  },
  bluePill: {
    padding: scaleSize.moderateScale(2),
    backgroundColor: '#B0D8FF',
    paddingVertical: scaleSize.moderateScale(1),
    paddingHorizontal: scaleSize.moderateScale(10),
    borderRadius: scaleSize.moderateScale(32),
  },
  bluePillText: {
    fontFamily: font.family.montserrat[400],
    fontSize: respFS(10),
    color: colors.textInput.input,
  },
  margin: {
    marginRight: scaleSize.moderateScale(10),
  },
});
