import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts, layout } from '@/constants';

type LabelSuccessType = {
  sphId?: string;
};

export default function LabelSuccess({ sphId }: LabelSuccessType) {
  return (
    <View style={styles.labelSuccess}>
      <Text style={styles.labelText}>{sphId} telah berhasil dibuat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  labelSuccess: {
    backgroundColor: colors.chip.green,
    paddingHorizontal: layout.pad.lg,
    paddingVertical: layout.pad.md,
  },
  labelText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.xs,
  },
});
