import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import scaleSize from '@/utils/scale';
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
    borderRadius: scaleSize.moderateScale(10),
    top: scaleSize.moderateScale(-25),
    width: scaleSize.moderateScale(100),
    height: scaleSize.moderateScale(18),
    right: scaleSize.moderateScale(-48),
  },
  markerPointer: {
    position: `absolute`,
    zIndex: 1,
    backgroundColor: colors.black,
    transform: [{ rotate: `45deg` }],
    width: scaleSize.moderateScale(15),
    height: scaleSize.moderateScale(15),
    bottom: 0,
    left: `45%`,
  },
});
