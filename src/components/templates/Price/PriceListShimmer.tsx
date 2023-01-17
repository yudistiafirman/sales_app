import { resScale } from '@/utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { PriceListCardStyles } from './PriceListCard';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const PriceListShimmer = () => {
  return (
    <View style={[PriceListCardStyles.container]}>
      <View style={PriceListCardStyles.nameAndPriceContainer}>
        <ShimmerPlaceholder style={styles.shimmerName} />
        <ShimmerPlaceholder style={styles.shimmerPrice} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <ShimmerPlaceholder style={styles.shimmerChip} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerName: { width: resScale(75), height: resScale(17) },
  shimmerPrice: { width: resScale(91), height: resScale(17) },
  shimmerChip: {
    width: resScale(51),
    height: resScale(16),
    borderRadius: resScale(32),
  },
});

export default PriceListShimmer;
