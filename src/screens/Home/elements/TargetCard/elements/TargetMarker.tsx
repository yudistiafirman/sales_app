import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import colors from '@/constants/colors';

export default function TargetMarker() {
  return (
    <View style={style.targetMarker}>
      <View
        style={{
          position: `relative`,
        }}
      >
        <Text
          style={{
            color: colors.white,
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
}
const style = StyleSheet.create({
  targetMarker: {
    position: `absolute`,
    backgroundColor: colors.black,
    borderRadius: resScale(10),
    top: resScale(-25),
    width: resScale(100),
    height: resScale(18),
    right: resScale(-48),
  },
  markerPointer: {
    position: `absolute`,
    zIndex: 1,
    backgroundColor: colors.black,
    transform: [{ rotate: `45deg` }],
    width: resScale(15),
    height: resScale(15),
    bottom: 0,
    left: `45%`,
  },
});
