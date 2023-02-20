import { BLabel, BSpacer, BText } from '@/components';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Estimation = () => {
  return (
    <View style={styles.container}>
      <BLabel
        bold="600"
        sizeInNumber={font.size.md}
        label="Estimasi waktu dibutuhkannya barang"
      />
      <BSpacer size="extraSmall" />
      <BText style={styles.date}>Minggu ke 2; Desember</BText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.pad.lg,
  },
  date: {
    fontFamily: font.family.montserrat['400'],
    fontSize: font.size.md,
  },
});

export default Estimation;
