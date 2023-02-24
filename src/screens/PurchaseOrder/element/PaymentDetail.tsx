import { BCardOption, BLabel, BSpacer, BForm } from '@/components';
import { style } from '@/components/templates/PO/POListCard';
import { layout } from '@/constants';
import font from '@/constants/fonts';
import { PurchaseOrderContext } from '@/context/PoContext';
import { Input } from '@/interfaces';
import { useActor } from '@xstate/react';
import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const PaymentDetail = () => {
  const { purchaseOrderService } = useContext(PurchaseOrderContext);
  const [state] = useActor(purchaseOrderService);
  const { send } = purchaseOrderService;
  const { choosenSphDataFromModal, files } = state.context;
  const paymentTitle =
    choosenSphDataFromModal.paymentType === 'CBD'
      ? 'Cash Before Delivery'
      : 'Credit';
  const paymentIcon =
    choosenSphDataFromModal.paymentType === 'CBD' ? cbd : credit;

  const fileInput: Input[] = useMemo(() => {
    const fileInputCredit: Input[] = [
      {
        label: 'KTP Direktur',
        type: 'fileInput',
        isRequire: true,
        isError: files.credit.ktpDirektur.errorMessage.length > 0,
        customerErrorMsg: files.credit.ktpDirektur.errorMessage,
        value: files.credit.ktpDirektur.value,
        onChange: (val) =>
          send('uploading', {
            paymentType: 'credit',
            fileType: 'ktpDirektur',
            value: val,
          }),
      },
      {
        label: 'SK Kemenkumham',
        type: 'fileInput',
        isRequire: true,
        isError: files.credit.skKemenkumham.errorMessage.length > 0,
        customerErrorMsg: files.credit.skKemenkumham.errorMessage,
        value: files.credit.skKemenkumham.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'credit',
            fileType: 'skKemenkumham',
            value: val,
          });
        },
      },
      {
        label: 'Akta Pendirian',
        type: 'fileInput',
        isRequire: true,
        isError: files.credit.aktaPendirian.errorMessage.length > 0,
        customerErrorMsg: files.credit.aktaPendirian.errorMessage,
        value: files.credit.aktaPendirian.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'credit',
            fileType: 'aktaPendirian',
            value: val,
          });
        },
      },
      {
        label: 'NIB Perusahaan',
        type: 'fileInput',
        isRequire: true,
        isError: files.credit.nibPerushaan.errorMessage.length > 0,
        customerErrorMsg: files.credit.nibPerushaan.errorMessage,
        value: files.credit.nibPerushaan.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'credit',
            fileType: 'nibPerushaan',
            value: val,
          });
        },
      },
      {
        label: 'Npwp Direktur',
        type: 'fileInput',
        isRequire: true,
        isError: files.credit.npwpDirektur.errorMessage.length > 0,
        customerErrorMsg: files.credit.npwpDirektur.errorMessage,
        value: files.credit.npwpDirektur.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'credit',
            fileType: 'npwpDirektur',
            value: val,
          });
        },
      },
      {
        label: 'Surat Kuasa',
        type: 'fileInput',
        isRequire: true,
        isError: files.credit.suratKuasa.errorMessage.length > 0,
        customerErrorMsg: files.credit.suratKuasa.errorMessage,
        value: files.credit.suratKuasa.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'credit',
            fileType: 'suratKuasa',
            value: val,
          });
        },
      },
      {
        label: 'Bank Guarantee',
        type: 'fileInput',
        isRequire: true,
        isError: files.credit.bankGuarantee.errorMessage.length > 0,
        customerErrorMsg: files.credit.bankGuarantee.errorMessage,
        value: files.credit.bankGuarantee.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'credit',
            fileType: 'bankGuarantee',
            value: val,
          });
        },
      },
      {
        label: 'Perjanjian Kerja Sama',
        type: 'fileInput',
        isRequire: true,
        isError: files.credit.perjanjian.errorMessage.length > 0,
        customerErrorMsg: files.credit.perjanjian.errorMessage,
        value: files.credit.perjanjian.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'credit',
            fileType: 'perjanjian',
            value: val,
          });
        },
      },
    ];

    const fileInputCbd: Input[] = [
      {
        label: 'Foto NPWP',
        type: 'fileInput',
        isRequire: true,
        isError: files.cbd.fotoNpwp.errorMessage.length > 0,
        customerErrorMsg: files.cbd.fotoNpwp.errorMessage,
        value: files.cbd.fotoNpwp.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'cbd',
            fileType: 'fotoNpwp',
            value: val,
          });
        },
      },
      {
        label: 'Foto KTP',
        type: 'fileInput',
        isRequire: true,
        isError: files.cbd.fotoKtp.errorMessage.length > 0,
        customerErrorMsg: files.cbd.fotoKtp.errorMessage,
        value: files.cbd.fotoKtp.value,
        onChange: (val) => {
          send('uploading', {
            paymentType: 'cbd',
            fileType: 'fotoKtp',
            value: val,
          });
        },
      },
    ];
    if (choosenSphDataFromModal.paymentType === 'CBD') {
      return fileInputCbd;
    } else {
      return fileInputCredit;
    }
  }, [choosenSphDataFromModal.paymentType, files, send]);

  return (
    <ScrollView style={styles.container}>
      <BLabel bold="600" sizeInNumber={font.size.md} label="Tipe Pembayaran" />
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: layout.pad.xl * 2,
  },
  paymentType: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default PaymentDetail;
