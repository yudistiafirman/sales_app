import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { resScale } from '@/utils';
import { colors, layout } from '@/constants';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  container: {
    height: resScale(56),
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
    marginTop: layout.pad.sm + layout.pad.xs,
  },
  nameAndPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.pad.md,
    marginTop: layout.pad.sm + layout.pad.xs,
  },
  shimmerName: { width: resScale(75), height: resScale(17) },
  shimmerPrice: { width: resScale(91), height: resScale(17) },
  shimmerChip: {
    width: resScale(51),
    height: layout.pad.lg,
    borderRadius: layout.radius.xl,
  },
});

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
function POListShimmer() {
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
}

export default POListShimmer;
