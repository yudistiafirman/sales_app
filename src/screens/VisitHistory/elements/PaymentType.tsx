import { BCardOption, BLabel, BSpacer } from '@/components';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

interface Props {
  paymentType: 'CBD' | 'CREDIT';
}

const PaymentType = ({ paymentType }: Props) => {
  const renderPaymentTitleAndIcon = useMemo(() => {
    let title;
    let icon;
    if (paymentType === 'CBD') {
      title = 'Cash Before Delivery';
      icon = cbd;
    } else {
      title = 'Credit';
      icon = credit;
    }
    return [title, icon];
  }, [paymentType]);

  const [title, icon] = renderPaymentTitleAndIcon;

  return (
    <View style={styles.container}>
      <BLabel bold="600" sizeInNumber={font.size.md} label="Tipe Pembayaran" />
      <BSpacer size="extraSmall" />
      <BCardOption isActive={false} title={title} icon={icon} />
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
