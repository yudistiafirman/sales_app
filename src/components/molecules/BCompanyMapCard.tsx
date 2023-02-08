import { View, Text, StyleSheet } from 'react-native';
import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import BTouchableText from '../atoms/BTouchableText';
import BSpacer from '../atoms/BSpacer';

type BCompanyMapCardType = {
  location?: string;
  companyName?: string;
  onPressLocation?: () => void;
};

export default function BCompanyMapCard({
  location,
  companyName,
  onPressLocation,
}: BCompanyMapCardType) {
  return (
    <View style={styles.company}>
      <Text style={styles.companyText}>{companyName}</Text>
      <BSpacer size={'extraSmall'} />
      <View style={styles.locationContainer}>
        <SimpleLineIcons
          name="location-pin"
          size={13}
          color="#000000"
          style={styles.iconStyle}
        />
        <View>
          <Text style={styles.mapLocation}>{location}</Text>
          <BTouchableText title="Lihat Peta" onPress={onPressLocation} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  company: {
    backgroundColor: colors.tertiary,
    padding: layout.mainPad,
  },
  companyText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
  },
  mapLocation: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.xs,
  },
  mapLink: {
    color: colors.primary,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.xs,
  },
  locationContainer: {
    flexDirection: 'row',
  },
  iconStyle: {
    marginRight: layout.pad.md,
  },
});
