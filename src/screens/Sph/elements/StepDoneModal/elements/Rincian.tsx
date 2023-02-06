import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { colors, fonts, layout } from '@/constants';
import { BSpacer } from '@/components';

type RincianType = {
  status?: string;
  paymentMethod?: string;
  expiredDate?: string;
  projectName?: string;
  productionTime?: string;
};

export default function Rincian({
  status,
  paymentMethod,
  expiredDate,
  projectName,
  productionTime,
}: RincianType) {
  return (
    <View>
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>Status</Text>
        <View style={styles.chip}>
          <Text style={[styles.summary, styles.fontw400]}>{status}</Text>
        </View>
      </View>
      <BSpacer size={'extraSmall'} />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>Metode Pembayaran</Text>
        <Text style={[styles.summary, styles.fontw400]}>{paymentMethod}</Text>
      </View>
      <BSpacer size={'extraSmall'} />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>Expired</Text>
        <Text style={[styles.summary, styles.fontw400]}>{expiredDate}</Text>
      </View>
      <BSpacer size={'extraSmall'} />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>Nama Proyek</Text>
        <Text style={[styles.summary, styles.fontw400]}>{projectName}</Text>
      </View>
      <BSpacer size={'extraSmall'} />
      <View style={styles.summaryContainer}>
        <Text style={styles.summary}>Waktu Pembuatan</Text>
        <Text style={[styles.summary, styles.fontw400]}>{productionTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.sm,
  },
  fontw400: {
    fontFamily: fonts.family.montserrat[400],
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    paddingVertical: layout.pad.xs,
    paddingHorizontal: layout.pad.md,
    borderRadius: layout.radius.xl,
    backgroundColor: colors.status.grey,
  },
});
