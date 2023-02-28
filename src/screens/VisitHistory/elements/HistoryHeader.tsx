import { BText } from '@/components';
import font from '@/constants/fonts';
import { colors } from '@/constants';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const HistoryHeader = ({
  projectName,
}: {
  projectName: string | undefined;
}) => {
  return (
    <View>
      <BText style={styles.header}>Riwayat Kunjungan</BText>
      <BText style={styles.projectName}>{projectName}</BText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: font.family.montserrat[400],
    fontSize: font.size.md,
    color: colors.text.darker,
  },
  projectName: {
    fontFamily: font.family.montserrat[600],
    fontSize: font.size.md,
    color: colors.text.darker,
    textAlign: 'center',
  },
});

export default HistoryHeader;
