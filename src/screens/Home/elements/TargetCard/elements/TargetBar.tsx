import { View, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import colors from "@/constants/colors";
import EmptyItem from "./EmptyItem";
import resScale from "@/utils/resScale";

import { layout } from "@/constants";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type TargetBarType = {
  maxVisitation: number;
  currentVisitaion: number;
  isExpanded: boolean;
  isLoading: boolean;
};

export default function TargetBar({
  maxVisitation,
  currentVisitaion,
  isExpanded,
  isLoading,
}: TargetBarType) {
  const [emptyProgress, currentProgress] = useMemo(() => {
    let max = maxVisitation + 2;
    if (currentVisitaion > maxVisitation) {
      if (currentVisitaion <= 10) {
        max = currentVisitaion + 2;
      } else if (currentVisitaion <= 14) {
        max = currentVisitaion + 1;
      } else {
        max = currentVisitaion;
      }
    }

    if (max >= 14) {
      max = 14;
    }

    let maxCurrentVisit = currentVisitaion;
    if (maxCurrentVisit >= 14) {
      maxCurrentVisit = 14;
    }

    const empty = [...Array(max)];
    const current = [...Array(maxCurrentVisit)];

    return [empty, current];
  }, [currentVisitaion, maxVisitation]);
  if (!isExpanded) {
    return null;
  }

  return (
    <ShimmerPlaceHolder style={style.shimmerStyle} visible>
      <View style={style.targetBar}>
        <View style={style.emptyProgressCont}>
          <View style={style.progressCont}>
            {currentProgress.map((_, i) => (
              <View key={`${i}current`} style={[style.progress]} />
            ))}
          </View>
          <ShimmerPlaceHolder style={style.loadingCont} visible={!isLoading} />

          {emptyProgress.map((_, i) => (
            <EmptyItem
              key={i.toString()}
              isLast={i === emptyProgress.length - 1}
              isFirst={i === 0}
              isTargetMarker={i === maxVisitation - 1}
            />
          ))}
        </View>
      </View>
    </ShimmerPlaceHolder>
  );
}

const style = StyleSheet.create({
  targetBar: {
    height: resScale(35),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    width: "100%",
  },
  emptyProgressCont: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: colors.lightGray,
    borderRadius: layout.radius.md,
    position: "relative",
  },
  progressCont: {
    position: "absolute",
    flexDirection: "row",
    zIndex: 2,
    borderRadius: layout.radius.md,
    backgroundColor: colors.primary,
  },
  loadingCont: {
    position: "absolute",
    flexDirection: "row",
    zIndex: 5,
    borderRadius: layout.radius.md,
    width: "100%",
    height: resScale(8),
  },
  progress: {
    height: resScale(8),
    width: resScale(25),
  },
  shimmerStyle: {
    borderRadius: layout.radius.md,
    width: "100%",
    height: resScale(43),
  },
});
