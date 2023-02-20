import { BCardOption, BLabel, BSpacer } from '@/components';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import React from 'react';
import { StyleSheet, View } from 'react-native';
const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const PaymentType = () => {
  return (
    <View style={styles.container}>
      <BLabel bold="600" sizeInNumber={font.size.md} label="Tipe Pembayaran" />
      <BSpacer size="extraSmall" />
      <BCardOption isActive={false} title="Credit" icon={credit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: layout.pad.lg,
  },
});

export default PaymentType;
