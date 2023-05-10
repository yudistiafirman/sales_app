import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import font from '@/constants/fonts';
import colors from '@/constants/colors';

type VisitationCountPropsType = {
  maxVisitation: number;
  currentVisitaion: number;
};

export default function VisitationCount({
  maxVisitation,
  currentVisitaion,
}: VisitationCountPropsType) {
  if (
    typeof maxVisitation !== 'number'
    || typeof currentVisitaion !== 'number'
  ) {
    return <Text style={style.countText}> - / - </Text>;
  }
  return (
    <Text style={style.count}>
      {currentVisitaion}
      {' '}
      /
      {maxVisitation}
    </Text>
  );
}

const style = StyleSheet.create({
  countText: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
    color: colors.black,
  },
  count: {
    fontFamily: font.family.montserrat[500],
    colors: colors.black,
  },
});
