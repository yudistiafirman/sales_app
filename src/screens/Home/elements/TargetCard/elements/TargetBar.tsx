import { View, StyleSheet } from 'react-native';
import React from 'react';
import colors from '@/constants/colors';
import EmptyItem from './EmptyItem';
import scaleSize from '@/utils/scale';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

export default function TargetBar({
  maxVisitation,
  currentVisitaion,
  isExpanded,
  isLoading,
}: {
  maxVisitation: number;
  currentVisitaion: number;
  isExpanded: boolean;
  isLoading: boolean;
}) {
  if (!isExpanded) {
    return null;
  }
  let max = maxVisitation + 2;

  if (currentVisitaion && currentVisitaion > maxVisitation) {
    max = currentVisitaion;
    if (currentVisitaion <= 10) {
      max += 2;
    } else if (currentVisitaion <= 14) {
      max += 1;
    }
  }
  if (max >= 14) {
    max = 14;
  }
  let maxCurrentVisit = currentVisitaion;
  if (maxCurrentVisit >= 14) {
    maxCurrentVisit = 14;
  }
  const emptyProgress = [...Array(max)];
  const currentProgress = [...Array(maxCurrentVisit)];
  return (
    <ShimmerPlaceHolder style={style.shimmerStyle} visible={!isLoading}>
      <View style={style.targetBar}>
        <View style={style.emptyProgressCont}>
          <View style={style.progressCont}>
            {currentProgress.map((_, i) => (
              <View key={i + `current`} style={[style.progress]}></View>
            ))}
          </View>

          {[
            emptyProgress.map((_, i) => (
              <EmptyItem
                key={i.toString()}
                isLast={i == emptyProgress.length - 1}
                isFirst={i == 0}
                isTargetMarker={i == maxVisitation - 1}
              />
            )),
          ]}
        </View>
      </View>
    </ShimmerPlaceHolder>
  );
}

const style = StyleSheet.create({
  targetBar: {
    height: scaleSize.moderateScale(43),
    display: 'flex',
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `flex-end`,
    width: '100%',
  },
  emptyProgressCont: {
    display: `flex`,
    flexDirection: `row`,
    backgroundColor: colors.lightGray,
    borderRadius: scaleSize.moderateScale(8),
    position: `relative`,
  },
  progressCont: {
    position: `absolute`,
    flexDirection: `row`,
    zIndex: 5,
    borderRadius: scaleSize.moderateScale(8),
    backgroundColor: colors.primary,
  },
  progress: {
    height: scaleSize.moderateScale(8),
    width: scaleSize.moderateScale(20),
  },
  shimmerStyle: {
    borderRadius: scaleSize.moderateScale(8),
    width: '100%',
    height: scaleSize.moderateScale(43),
  },
});
