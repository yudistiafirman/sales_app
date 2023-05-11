import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { fonts, layout } from '@/constants';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';

const style = StyleSheet.create({
  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    color: '#0080FF',
    fontFamily: font.family.montserrat[300],
    fontSize: fonts.size.xs,
  },
  iconStyle: {
    marginRight: layout.pad.md,
  },
});

type LocationType = {
  location?: string;
};
export default function BLocationText({ location }: LocationType) {
  if (!location) {
    return null;
  }
  return (
    <View style={style.location}>
      <SimpleLineIcons name="location-pin" size={13} color="#0080FF" style={style.iconStyle} />
      <Text numberOfLines={1} style={style.locationText}>
        {location}
      </Text>
    </View>
  );
}
