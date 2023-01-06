import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import scaleSize from '@/utils/scale';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type TimeType = {
  time?: string;
};
export default function Time({ time }: TimeType) {
  if (!time) {
    return null;
  }
  return (
    <View style={[style.container]}>
      <MaterialIcon
        name="clock-time-four-outline"
        style={style.iconStyle}
        size={13}
      />
      <Text>{time}</Text>
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    marginRight: scaleSize.moderateScale(7),
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    marginRight: scaleSize.moderateScale(7),
  },
});
