import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';
import colors from '@/constants/colors';
import { fonts } from '@/constants';

export default function TargetMarker() {
  return (
    <View style={style.targetMarker}>
      <View style={style.todayTargetContainer}>
        <Text style={style.todayTargetText}>Target hari ini</Text>
        <View style={style.markerPointer} />
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  todayTargetContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayTargetText: {
    color: colors.white,
    zIndex: 2,
    textAlign: 'center',
    fontFamily: fonts.family.montserrat['500'],
    fontSize: fonts.size.xs,
    marginTop: resScale(2),
  },
  targetMarker: {
    position: 'absolute',
    backgroundColor: colors.black,
    borderRadius: resScale(10),
    top: resScale(-25),
    width: resScale(100),
    height: resScale(18),
    right: resScale(-48),
  },
  markerPointer: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: colors.black,
    transform: [{ rotate: '45deg' }],
    width: resScale(15),
    height: resScale(15),
    bottom: 0,
    top: 5,
    left: '45%',
  },
});
