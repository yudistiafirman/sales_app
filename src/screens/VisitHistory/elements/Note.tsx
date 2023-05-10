import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BLabel, BSpacer, BText } from '@/components';
import { colors, layout } from '@/constants';
import font from '@/constants/fonts';

function Notes({ visitNotes }: { visitNotes: string | null }) {
  if (visitNotes) {
    return (
      <View style={styles.container}>
        <BLabel bold="600" sizeInNumber={font.size.md} label="Catatan" />
        <BSpacer size="extraSmall" />
        <BText numberOfLines={3} style={styles.textNotes}>
          {visitNotes}
        </BText>
      </View>
    );
  }
  return null;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.pad.lg,
  },
  textNotes: {
    fontFamily: font.family.montserrat[400],
    fontSize: font.size.md,
    color: colors.text.darker,
  },
});

export default Notes;
