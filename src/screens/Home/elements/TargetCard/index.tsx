import { View, StyleSheet, Animated, Easing } from 'react-native';
import React, { useState, useEffect } from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import TargetBar from './elements/TargetBar';
import TopVisitation from './elements/TopVisitation';
import scaleSize from '@/utils/scale';

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

  const containerHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [130, 130],
  });

  return (
    <View style={{ position: `relative`, zIndex: 0 }}>
      <Animated.View
        style={[
          {
            width: scaleSize.moderateScale(320),
            alignSelf: 'flex-start',
            zIndex: 1,
          },
          { height: containerHeight },
        ]}
      >
        <View style={style.targetContainer}>
          <TopVisitation
            maxVisitation={maxVisitation}
            currentVisitaion={currentVisitaion}
          />

          <TargetBar
            maxVisitation={maxVisitation}
            currentVisitaion={currentVisitaion}
            isExpanded={isExpandedLocal}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const style = StyleSheet.create({
  targetContainer: {
    padding: scaleSize.moderateScale(10),
    backgroundColor: colors.white,
    borderRadius: 8,
    minHeight: scaleSize.moderateScale(60),
    marginTop: scaleSize.moderateScale(10),
  },

  count: {
    fontFamily: font.family.montserrat[700],
    colors: `black`,
  },
});
