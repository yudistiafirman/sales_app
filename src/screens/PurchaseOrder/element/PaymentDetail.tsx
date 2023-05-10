import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  BCardOption, BLabel, BSpacer, BForm, BSpinner,
} from '@/components';
import EmptyState from '@/components/organism/BEmptyState';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import { Input } from '@/interfaces';
import { ProjectDocs } from '@/interfaces/CreatePurchaseOrder';
import { AppDispatch, RootState } from '@/redux/store';

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

function PaymentDetail() {
  const poState = useSelector((state: RootState) => state.purchaseOrder);
  const dispatch = useDispatch<AppDispatch>();
  const {
    files, paymentType, loadingDocument, errorGettingSphMessage,
  } = poState.currentState.context;
  const paymentTitle = paymentType === 'CBD' ? 'Cash Before Delivery' : 'Credit';
  const paymentIcon = paymentType === 'CBD' ? cbd : credit;

  const fileInput: Input[] = useMemo(() => {
    const requiredFileInput = files.map((val: ProjectDocs, idx: number) => ({
      ...val,
      onChange: (newValue: any) => dispatch({ type: 'uploading', value: newValue, idx }),
    }));
    return requiredFileInput;
  }, [dispatch, files]);

  useEffect(() => {
    if (poState.currentState.matches('SecondStep.idle')) {
      dispatch({
        type: 'getSphDocument',
      });
    }
  }, [dispatch, poState.currentState]);

  if (poState.currentState.matches('SecondStep.errorGettingDocuments')) {
    return (
      <EmptyState
        isError
        errorMessage={errorGettingSphMessage}
        onAction={() => dispatch({ type: 'retryGettingDocument' })}
      />
    );
  } if (loadingDocument) {
    return (
      <View style={styles.loading}>
        <BSpinner size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <>
        <BLabel
          bold="600"
          sizeInNumber={font.size.md}
          label="Tipe Pembayaran"
        />
        <BSpacer size="extraSmall" />
        <BCardOption
          isActive={false}
          title={paymentTitle}
          icon={paymentIcon}
          isClickable={false}
          flexDirection="row"
        />
        <BSpacer size="small" />
        <BLabel
          bold="600"
          sizeInNumber={font.size.md}
          label="Kelengkapan Dokumen"
        />
        <BSpacer size="extraSmall" />
        <BForm titleBold="500" inputs={fileInput} />
      </>
    </ScrollView>
  );
}

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
