import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import VisitationCount from './VisitationCount';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import colors from '@/constants/colors';

export default function TopVisitation({
  maxVisitation,
  currentVisitaion,
}: {
  maxVisitation: number;
  currentVisitaion: number;
}) {
  return (
    <View style={style.targetCount}>
      <Text style={style.countText}>
        Jumlah Kunjungan:{' '}
        <VisitationCount
          maxVisitation={maxVisitation}
          currentVisitaion={currentVisitaion}
        />
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  targetCount: {
    height: scaleSize.moderateScale(40),
    justifyContent: `center`,
    alignItems: `center`,
  },

  countText: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
    color: colors.black,
  },
});
