import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BLocationText } from '@/components';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';

function LocationText({ locationAddress }: { locationAddress?: string }) {
  return (
    <View style={styles.locationWrapper}>
      <BLocationText location={locationAddress} />
    </View>
  );
}

const styles = StyleSheet.create({
  locationWrapper: {
    paddingHorizontal: layout.pad.lg,
    paddingTop: layout.pad.md,
  },
});
export default LocationText;
