import { BCardOption, BLabel, BSpacer, BForm, BSpinner } from '@/components';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import { Input } from '@/interfaces';
import { ProjectDocs } from '@/interfaces/CreatePurchaseOrder';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const PaymentDetail = () => {
  const poGlobalState = useSelector(
    (postate: RootState) => postate.purchaseOrder
  );
  const dispatch = useDispatch<AppDispatch>();
  const { files, paymentType, loadingDocument } = poGlobalState.poState;
  const paymentTitle =
    paymentType === 'CBD' ? 'Cash Before Delivery' : 'Credit';
  const paymentIcon = paymentType === 'CBD' ? cbd : credit;

  const fileInput: Input[] = useMemo(() => {
    const requiredFileInput = files.map((val: ProjectDocs, idx: number) => {
      return {
        ...val,
        onChange: (newValue: any) =>
          dispatch({ type: 'uploading', value: newValue, idx: idx }),
      };
    });
    return requiredFileInput;
  }, [dispatch, files]);

  if (loadingDocument) {
    return (
      <View style={styles.loading}>
        <BSpinner size="large" />
      </View>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        <BLabel
          bold="600"
          sizeInNumber={font.size.md}
          label="Tipe Pembayaran"
        />
        <BSpacer size="extraSmall" />
        <BCardOption isActive={false} title={paymentTitle} icon={paymentIcon} />
        <BSpacer size="small" />
        <BLabel
          bold="600"
          sizeInNumber={font.size.md}
          label="Kelengkapan Dokumen"
        />
        <BSpacer size="extraSmall" />
        <BForm inputs={fileInput} />
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: layout.pad.xxl,
  },
  paymentType: {
    flex: 1,
    flexDirection: 'row',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentDetail;
