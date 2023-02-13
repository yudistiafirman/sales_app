/* eslint-disable react-native/no-inline-styles */
import BText from '@/components/atoms/BText';
import { layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

type EmptyProductType = {
  emptyProductName?: string;
  emptyText?: string;
};

const EmptyProduct = ({ emptyProductName, emptyText }: EmptyProductType) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.emptyimage}
        source={require('@/assets/icon/ic_not_found.png')}
      />
      <View style={{ flex: 1 }}>
        {!emptyText ? (
          <BText style={styles.emptyText}>
            Pencarian mu "{emptyProductName}" tidak ada. Coba cari produk
            lainnya.
          </BText>
        ) : (
          <BText style={styles.emptyText}>{emptyText}</BText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  emptyimage: {
    width: resScale(88),
    height: resScale(88),
    marginBottom: layout.pad.md,
  },
  emptyText: {
    fontFamily: font.family.montserrat['600'],
    fontSize: font.size.md,
    textAlign: 'center',
    color: colors.text.darker,
  },
});

export default EmptyProduct;
