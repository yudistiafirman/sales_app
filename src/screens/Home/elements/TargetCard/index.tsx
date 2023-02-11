import { View, StyleSheet, Animated, Easing } from 'react-native';
import React, { useState, useEffect } from 'react';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import TargetBar from './elements/TargetBar';
import TopVisitation from './elements/TopVisitation';
import resScale from '@/utils/resScale';
import { layout } from '@/constants';

type TargetCardProps = {
  maxVisitation: number;
  currentVisitaion: number;
  isExpanded: boolean;
  isLoading: boolean;
};

export default function TargetCard({
  maxVisitation,
  currentVisitaion,
  isExpanded,
  isLoading,
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
    outputRange: [75, 90],
  });

  return (
    <View style={{ width: '100%', position: `relative`, zIndex: 0 }}>
      <Animated.View
        style={[
          {
            width: '100%',
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
            isLoading={isLoading}
          />

          <TargetBar
            maxVisitation={maxVisitation}
            currentVisitaion={currentVisitaion}
            isExpanded={isExpandedLocal}
            isLoading={isLoading}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const style = StyleSheet.create({
  targetContainer: {
    backgroundColor: colors.white,
    borderRadius: layout.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontFamily: font.family.montserrat[700],
    colors: colors.black,
  },
});
