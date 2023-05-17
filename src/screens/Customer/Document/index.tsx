import { updateCustomer, uploadFileImage } from '@/actions/CommonActions';
import { BContainer, BDivider, BForm, BLabel, BSpacer } from '@/components';
import { colors, fonts, layout } from '@/constants';
import { CustomerDocsPayType } from '@/models/Customer';
import { CUSTOMER_DOCUMENT } from '@/navigation/ScreenNames';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { resScale } from '@/utils';
import { uniqueStringGenerator } from '@/utils/generalFunc';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';

const Document = () => {
  const route = useRoute();
  const { docs, customerId } = route.params;
  const dispatch = useDispatch();
  const [customerDocs, setCustomerDocs] = useState<ICustomerDocs>(docs);

  const totalDocuments = docs.cbd.length + docs.credit.length;

  useEffect(() => {
    crashlytics().log(CUSTOMER_DOCUMENT);
  }, []);

  const onChangeFileValue = async (value, docsIndex, paymentType) => {
    try {
      dispatch(
        openPopUp({
          popUpType: 'loading',
          popUpText:
            'Mengupload Dokumen ' +
            customerDocs[paymentType][docsIndex].Document.name,
          outsideClickClosePopUp: true,
        })
      );
      const valueToUpload = {
        ...value,
        name: `CD-${uniqueStringGenerator()}-${value.name}}`,
      };
      const response = await uploadFileImage([valueToUpload]);
      const { id } = response.data.data[0];
      if (response.data.success) {
        const payload = {};
        payload.customerDocs = [
          {
            File: {
              id: id,
            },
            Document: {
              id: customerDocs[paymentType][docsIndex].Document.id,
            },
          },
        ];

        const customerDocId =
          customerDocs[paymentType][docsIndex].customerDocId;

        if (customerDocId) {
          payload.customerDocs[0].customerDocId = customerDocId;
        }
        const response = await updateCustomer(customerId, payload);
        if (response.data.success) {
          const newFilesData = [...customerDocs[paymentType]];
          const newFilesDataValue = newFilesData.map((v, i) => {
            if (i === docsIndex) {
              return {
                ...v,
                File: valueToUpload,
              };
            } else {
              return { ...v };
            }
          });

          setCustomerDocs((prev) => ({
            ...prev,
            [paymentType]: newFilesDataValue,
          }));
          dispatch(
            openPopUp({
              popUpType: 'success',
              popUpText:
                'Berhasil Upload Dokumen ' +
                customerDocs[paymentType][docsIndex].Document.name,
            })
          );
        }
      }
    } catch (error) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: error?.message
            ? error?.message
            : 'Error Upload Dokumen ' +
              customerDocs[paymentType][docsIndex].Document.name,
          outsideClickClosePopUp: true,
        })
      );
    }
  };

  const completedDocumentCount = useMemo(() => {
    const totalCompletedDocumentCbd = customerDocs.cbd.filter(
      (v) => v.File !== null
    );
    const totalCompletedDocumentCredit = customerDocs.credit.filter(
      (v) => v.File !== null
    );
    return (
      totalCompletedDocumentCbd.length + totalCompletedDocumentCredit.length
    );
  }, [docs, customerDocs]);

  const cbdFileInput: Input[] = useMemo(() => {
    const cbdDocs = customerDocs?.cbd?.map(
      (v: CustomerDocsPayType, i: number) => {
        return {
          customerDocId: v.customerDocId,
          documentId: v.Document?.id,
          label: v.Document?.name,
          type: 'fileInput',
          value: v.File,
          titleBold: '500',
          onChange: (newValue) => onChangeFileValue(newValue, i, 'cbd'),
          loading: false,
        };
      }
    );

    return cbdDocs;
  }, [docs, customerDocs]);

  const creditFileInput: Input[] = useMemo(() => {
    const creditDocs = customerDocs?.credit?.map(
      (v: CustomerDocsPayType, i: number) => {
        return {
          customerDocId: v.customerDocId,
          documentId: v.Document?.id,
          label: v.Document?.name,
          type: 'fileInput',
          value: v.File,
          onChange: (newValue) => onChangeFileValue(newValue, i, 'credit'),
          titleBold: '500',
        };
      }
    );

    return creditDocs;
  }, [docs, customerDocs]);

  return (
    <BContainer>
      <View style={styles.documentProggress}>
        <View style={styles.between}>
          <Text style={styles.fontW500}>Kelengkapan Dokumen</Text>
          <Text style={styles.fontW500}>
            {completedDocumentCount}/{totalDocuments}
          </Text>
        </View>
        <ProgressBar
          styleAttr="Horizontal"
          indeterminate={false}
          progress={
            completedDocumentCount / totalDocuments
              ? completedDocumentCount / totalDocuments
              : 0
          }
          color={colors.primary}
        />
      </View>
      <BSpacer size={'small'} />
      <BSpacer size="extraSmall" />
      <BForm titleBold="500" inputs={cbdFileInput} />
      <View style={styles.divider} />
      <BSpacer size="middleSmall" />
      <BForm titleBold="500" inputs={creditFileInput} />
    </BContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  fontW500: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: colors.textInput.inActive,
  },
  documentProggress: {},
  fileInputShimmer: {
    width: resScale(330),
    height: resScale(30),
    borderRadius: layout.radius.md,
  },
});

export default Document;
