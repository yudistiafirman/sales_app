import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import respFS from '@/utils/resFontSize';
import font from '@/constants/fonts';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import resScale from '@/utils/resScale';

type locationType = {
  location?: string;
};
export default function Location({ location }: locationType) {
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
  },
  locationText: {
    color: '#0080FF',
    fontFamily: font.family.montserrat[300],
    fontSize: respFS(12),
  },
  iconStyle: {
    marginRight: resScale(7),
  },
});
