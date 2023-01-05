/* eslint-disable react-native/no-inline-styles */
import BText from '@/components/atoms/BText';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import scaleSize from '@/utils/scale';
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const EmptyProduct = ({ emptyProductName }: { emptyProductName?: string }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.emptyimage}
        source={require('@/assets/icon/ic_not_found.png')}
      />
      <View style={{ flex: 1 }}>
        <BText style={styles.emptyText}>
          Pencarian mu "{emptyProductName}" tidak ada. Coba cari produk lainnya.
        </BText>
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
    width: scaleSize.moderateScale(88),
    height: scaleSize.moderateScale(88),
    marginVertical: scaleSize.moderateScale(32),
  },
  emptyText: {
    fontFamily: font.family.montserrat['600'],
    fontSize: scaleSize.moderateScale(14),
    textAlign: 'center',
    color: colors.text.darker,
  },
});

export default EmptyProduct;
