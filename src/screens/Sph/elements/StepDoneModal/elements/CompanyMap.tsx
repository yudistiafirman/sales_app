import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts, layout } from '@/constants';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { BSpacer } from '@/components';

type CompanyMapType = {
  location?: string;
  companyName?: string;
};

export default function CompanyMap({ location, companyName }: CompanyMapType) {
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
          <Text style={styles.mapLink}>Lihat Peta</Text>
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
