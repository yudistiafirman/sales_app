import BText from '@/components/atoms/BText';
import { layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';

type EmptyPOType = {
  emptyPOName?: string;
  emptyText?: string;
};

const EmptyPO = ({ emptyPOName, emptyText }: EmptyPOType) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.emptyimage}
        source={require('@/assets/icon/ic_not_found.png')}
      />
      <View style={styles.flexOne}>
        {!emptyText ? (
          <BText style={styles.emptyText}>
            Pencarian mu "{emptyPOName}" tidak ada. Coba cari PO lainnya.
          </BText>
        ) : (
          <BText style={styles.emptyText}>{emptyText}</BText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
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

export default EmptyPO;
