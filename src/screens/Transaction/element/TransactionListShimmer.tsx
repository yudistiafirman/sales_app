import { resScale } from '@/utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import colors from '@/constants/colors';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const TransactionListShimmer = () => {
  return (
    <View style={styles.parent}>
      <View style={styles.container}>
        <ShimmerPlaceholder style={styles.shimmerName} />
        <ShimmerPlaceholder style={styles.shimmerPrice} />
      </View>
      <View style={styles.container}>
        <ShimmerPlaceholder style={styles.shimmerChip} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: resScale(56),
    borderBottomWidth: 1,
    borderColor: colors.border.disabled,
    marginTop: resScale(6),
  },
  container: {
    flexDirection: 'row',
  },
  shimmerName: { width: resScale(75), height: resScale(17) },
  shimmerPrice: { width: resScale(91), height: resScale(17) },
  shimmerChip: {
    width: resScale(51),
    height: resScale(16),
    borderRadius: resScale(32),
  },
});

export default TransactionListShimmer;
