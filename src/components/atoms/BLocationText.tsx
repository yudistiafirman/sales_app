import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import font from '@/constants/fonts';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import resScale from '@/utils/resScale';
import { fonts, layout } from '@/constants';

type locationType = {
  location?: string;
};
export default function BLocationText({ location }: locationType) {
  if (!location) {
    return null;
  }
  return (
    <View style={style.location}>
      <SimpleLineIcons
        name="location-pin"
        size={13}
        color="#0080FF"
        style={style.iconStyle}
      />
      <Text style={style.locationText}>{location}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: resScale(210),
  },
  locationText: {
    color: '#0080FF',
    fontFamily: font.family.montserrat[300],
    fontSize: fonts.size.xs,
  },
  iconStyle: {
    marginRight: layout.pad.md,
  },
});
