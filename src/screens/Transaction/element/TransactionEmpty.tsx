import BText from '@/components/atoms/BText';
import { layout } from '@/constants';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import resScale from '@/utils/resScale';
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const TransactionEmpty = ({
  emptyTransactionName,
  errorName,
}: {
  emptyTransactionName?: string;
  errorName?: string;
}) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.emptyimage}
        source={require('@/assets/icon/ic_not_found.png')}
      />
      <View style={styles.parent}>
        <BText style={styles.emptyText}>
          {errorName
            ? errorName
            : `Pencarian mu ${emptyTransactionName} tidak ada. Coba cari transaksi lainnya.`}
        </BText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  emptyimage: {
    width: resScale(88),
    height: resScale(88),
    marginVertical: layout.pad.lg,
  },
  emptyText: {
    fontFamily: font.family.montserrat[600],
    fontSize: font.size.md,
    textAlign: 'center',
    color: colors.text.darker,
  },
});

export default TransactionEmpty;
