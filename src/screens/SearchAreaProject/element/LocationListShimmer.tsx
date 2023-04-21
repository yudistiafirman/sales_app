import { layout } from '@/constants';
import { resScale } from '@/utils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import SearchAreaStyles from '../styles';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const LocationListShimmer = () => {
  return (
    <View
      style={[
        SearchAreaStyles.locationListCardContainer,
        { marginHorizontal: layout.pad.lg },
      ]}
    >
      <View style={SearchAreaStyles.innerListContainer}>
        <ShimmerPlaceholder style={styles.iconShimmer} />

        <View>
          <ShimmerPlaceholder style={styles.titleShimmer} />
          <ShimmerPlaceholder style={styles.secondaryTextShimmer} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconShimmer: {
    width: resScale(18),
    height: resScale(20),
    marginRight: layout.pad.ml,
  },
  titleShimmer: {
    width: resScale(108),
    height: resScale(17),
    marginBottom: layout.pad.sm,
  },
  secondaryTextShimmer: { width: resScale(296), height: resScale(15) },
});

export default LocationListShimmer;
