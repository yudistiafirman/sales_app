import { View, StyleSheet } from 'react-native';
import React from 'react';
import TargetMarker from './TargetMarker';
import colors from '@/constants/colors';
import scaleSize from '@/utils/scale';

type EmptyItemType = {
  isLast: boolean;
  isTargetMarker: boolean;
  isFirst: boolean;
};

export default function EmptyItem({
  isLast,
  isFirst,
  isTargetMarker,
}: EmptyItemType) {
  return (
    <View
      style={[
        style.emptyProgress,
        isLast ? style.progressEnd : null,
        isFirst ? { borderLeftWidth: 0 } : null,
      ]}
    >
      {isTargetMarker && <TargetMarker />}
    </View>
  );
}

const style = StyleSheet.create({
  emptyProgress: {
    height: scaleSize.moderateScale(8),
    width: scaleSize.moderateScale(20),
    borderLeftWidth: scaleSize.moderateScale(1),
    borderLeftColor: colors.border.altGrey,
  },
  progressEnd: {
    borderTopEndRadius: scaleSize.moderateScale(5),
    borderBottomEndRadius: scaleSize.moderateScale(5),
  },
});
