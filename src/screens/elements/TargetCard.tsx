import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';

type TargetCardProps = {
  maxVisitation: number;
  currentVisitaion: number;
  isExpanded: boolean;
};
export default function TargetCard({
  maxVisitation,
  currentVisitaion,
  isExpanded,
}: TargetCardProps) {
  const [isExpandedLocal, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const toValue = isExpandedLocal ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 100,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start(() => [setIsExpanded(isExpanded)]);
  }, [isExpanded]);

  //   const toggleExpanded = () => {
  //   const toValue = isExpandedLocal ? 0 : 1;

  //   Animated.timing(animation, {
  //     toValue,
  //     duration: 200,
  //     useNativeDriver: false,
  //   }).start();

  //     setIsExpanded((current) => !current);
  //   };

  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [130, 130],
  });

  const visitationCount = () => {
    if (
      typeof maxVisitation !== `number` ||
      typeof currentVisitaion !== `number`
    ) {
      return <Text style={style.countText}> - / - </Text>;
    }
    return (
      <Text style={style.count}>
        {currentVisitaion} / {maxVisitation}
      </Text>
    );
  };

  const targetMarker = () => {
    return (
      <View style={style.targetMarker}>
        <View
          style={{
            position: `relative`,
          }}
        >
          <Text
            style={{
              color: `white`,
              zIndex: 2,
              textAlign: `center`,
            }}
          >
            Target hari ini
          </Text>
          <View style={style.markerPointer}></View>
        </View>
      </View>
    );
  };

  const TargetBar = () => {
    if (!isExpandedLocal) {
      return null;
    }
    let max = maxVisitation + 2;

    if (currentVisitaion && currentVisitaion > maxVisitation) {
      max = currentVisitaion;
      if (currentVisitaion <= 12) {
        max += 2;
      } else if (currentVisitaion <= 14) {
        max += 1;
      }
    }

    const emptyProgress = [...Array(max)];
    const currentProgress = [...Array(currentVisitaion)];
    return (
      <View style={style.targetBar}>
        <View style={style.emptyProgressCont}>
          <View style={style.progressCont}>
            {currentProgress.map((_, i) => (
              <View key={i + `current`} style={[style.progress]}></View>
            ))}
          </View>

          {[
            emptyProgress.map((_, i) => (
              <View
                key={i + `empty`}
                style={[
                  style.emptyProgress,
                  i == emptyProgress.length - 1 ? style.progressEnd : null,
                  i == 0 ? { borderLeftWidth: 0 } : null,
                ]}
              >
                {i == maxVisitation - 1 && targetMarker()}
              </View>
            )),
          ]}
        </View>
      </View>
    );
  };

  return (
    <View style={{ position: `relative`, zIndex: 0 }}>
      <Animated.View
        style={[
          {
            width: 340,
            alignSelf: 'flex-start',
            zIndex: 1,
          },
          { height: containerHeight },
        ]}
      >
        <View style={style.targetContainer}>
          <View style={style.targetCount}>
            <Text style={style.countText}>
              Jumlah Kunjungan: {visitationCount()}
            </Text>
          </View>

          <TargetBar></TargetBar>
        </View>
      </Animated.View>
    </View>
  );
}

const style = StyleSheet.create({
  targetContainer: {
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 8,
    minHeight: 60,
    marginTop: 10,
  },
  targetCount: {
    // width: 320,
    height: 40,
    justifyContent: `center`,
    alignItems: `center`,
  },
  targetBar: {
    // width: 320,
    height: 43,
    display: 'flex',
    flexDirection: `row`,
    justifyContent: `center`,
    alignItems: `flex-end`,
  },
  countText: {
    fontFamily: font.family.montserrat[500],
    fontSize: font.size.md,
    color: `black`,
  },
  count: {
    fontFamily: font.family.montserrat[700],
    colors: `black`,
  },
  progress: {
    height: 10,
    width: 20,
  },
  progressCont: {
    position: `absolute`,
    flexDirection: `row`,
    zIndex: 5,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  emptyProgress: {
    height: 10,
    width: 20,
    borderLeftWidth: 1,
    borderLeftColor: colors.border.altGrey,
    // position: `relative`,
  },
  emptyProgressCont: {
    display: `flex`,
    flexDirection: `row`,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    position: `relative`,
  },
  progressEnd: {
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
  },
  targetMarker: {
    position: `absolute`,
    backgroundColor: `black`,
    borderRadius: 10,
    top: -25,
    width: 100,
    height: 20,
    right: -47,
  },
  markerPointer: {
    position: `absolute`,
    zIndex: 1,
    backgroundColor: `black`,
    transform: [{ rotate: `45deg` }],
    width: 15,
    height: 15,
    bottom: 0,
    left: `45%`,
  },
});
