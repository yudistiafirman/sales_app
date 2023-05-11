import React from 'react';
import { View, StyleSheet } from 'react-native';
import { layout } from '@/constants';
import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import TargetMarker from './TargetMarker';

type EmptyItemType = {
  isLast: boolean;
  isTargetMarker: boolean;
  isFirst: boolean;
};

export default function EmptyItem({ isLast, isFirst, isTargetMarker }: EmptyItemType) {
  return (
    <View
      style={[
        style.emptyProgress,
        isLast ? style.progressEnd : null,
        isFirst ? { borderLeftWidth: 0 } : null,
      ]}>
      {isTargetMarker && <TargetMarker />}
    </View>
  );
}

const style = StyleSheet.create({
  emptyProgress: {
    height: resScale(8),
    width: resScale(25),
    borderLeftWidth: resScale(1),
    borderLeftColor: colors.border.altGrey,
  },
  progressEnd: {
    borderTopEndRadius: layout.radius.sm,
    borderBottomEndRadius: layout.radius.sm,
  },
});
