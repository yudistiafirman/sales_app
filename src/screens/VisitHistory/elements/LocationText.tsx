import { BLocationText } from '@/components';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const LocationText = ({ locationAddress }: { locationAddress?: string }) => {
  return (
    <View style={styles.locationWrapper}>
      <BLocationText location={locationAddress} />
    </View>
  );
};

const styles = StyleSheet.create({
  locationWrapper: {
    paddingHorizontal: layout.pad.lg,
    oaddingTop: layout.pad.lg,
  },
  viewMoreText: {
    fontFamily: font.family.montserrat[300],
    fontSize: font.size.xs,
    color: colors.text.blue,
  },
});
export default LocationText;
