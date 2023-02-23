import { colors, layout } from '@/constants';
import { resScale } from '@/utils';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const POListShimmer = () => {
  return (
    <View style={[styles.container]}>
      <View style={styles.nameAndPriceContainer}>
        <ShimmerPlaceholder style={styles.shimmerName} />
        <ShimmerPlaceholder style={styles.shimmerPrice} />
      </View>
      <View style={styles.flexRow}>
        <ShimmerPlaceholder style={styles.shimmerChip} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  container: {
    height: resScale(56),
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
    marginTop: resScale(6),
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.pad.md,
    marginTop: resScale(6),
  },
  shimmerName: { width: resScale(75), height: resScale(17) },
  shimmerPrice: { width: resScale(91), height: resScale(17) },
  shimmerChip: {
    width: resScale(51),
    height: resScale(16),
    borderRadius: resScale(32),
  },
});

export default POListShimmer;
