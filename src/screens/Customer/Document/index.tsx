import { updateCustomer, uploadFileImage } from '@/actions/CommonActions';
import {
  BChip,
  BContainer,
  BDivider,
  BForm,
  BLabel,
  BSpacer,
  BSvg,
} from '@/components';
import { colors, fonts, layout } from '@/constants';
import { CustomerDocsPayType } from '@/models/Customer';
import { CUSTOMER_DOCUMENT } from '@/navigation/ScreenNames';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { resScale } from '@/utils';
import { uniqueStringGenerator } from '@/utils/generalFunc';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import SvgNames from '@/components/atoms/BSvg/svgName';
import TotalDocumentChip from '../elements/TotalDocumentChip';

const Document = () => {
  const route = useRoute();
  const { docs, customerId, customerType } = route.params;
  const dispatch = useDispatch();
  const [customerDocs, setCustomerDocs] = useState<ICustomerDocs>(docs);

  useEffect(() => {
    crashlytics().log(CUSTOMER_DOCUMENT);
  }, []);

  const onChangeFileValue = async (value, docsIndex, paymentType) => {
    try {
      if (!value) return;
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
          isRequire: v.Document?.isRequired,
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
          isRequire: v.Document?.isRequired,
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
          <TotalDocumentChip
            customerType={customerType}
            documents={customerDocs}
            chipText={styles.chipText}
          />
        </View>
      </View>
      <BSpacer size={'small'} />
      <BSpacer size="extraSmall" />
      <BForm titleBold="500" inputs={cbdFileInput} />
      {customerType === 'COMPANY' && <View style={styles.divider} />}

      <BSpacer size="middleSmall" />
      {customerType === 'COMPANY' && (
        <BForm titleBold="500" inputs={creditFileInput} />
      )}
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
  chipText: {
    fontSize: fonts.size.sm,
    color: colors.offWhite,
    fontFamily: fonts.family.montserrat[400],
  },
  documentProggress: {},
  fileInputShimmer: {
    width: resScale(330),
    height: resScale(30),
    borderRadius: layout.radius.md,
  },
});

export default Document;
