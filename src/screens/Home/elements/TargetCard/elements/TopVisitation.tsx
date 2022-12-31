import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import VisitationCount from './VisitationCount';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import colors from '@/constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function TopVisitation({
  maxVisitation,
  currentVisitaion,
  isLoading,
}: {
  maxVisitation: number;
  currentVisitaion: number;
  isLoading: boolean;
}) {
  return (
    <View style={style.targetCount}>
      <ShimmerPlaceHolder style={style.shimmerStyle} visible={!isLoading}>
        <Text style={style.countText}>
          Jumlah Kunjungan:{' '}
          <VisitationCount
            maxVisitation={maxVisitation}
            currentVisitaion={currentVisitaion}
          />
        </Text>
      </ShimmerPlaceHolder>
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

  shimmerStyle: {
    borderRadius: scaleSize.moderateScale(8),
  },
});
