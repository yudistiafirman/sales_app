import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BContainer, BForm, BSpacer } from '@/components';
import { Input } from '@/interfaces';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { resScale } from '@/utils';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
import { Checkbox } from 'react-native-paper';
import { colors, fonts } from '@/constants';
import font from '@/constants/fonts';
import BBackContinueBtn from '../../../../components/molecules/BBackContinueBtn';
import { SphContext } from '../context/SphContext';

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const fileCredit = [
  {
    label: 'SK Kemenkumham',
    key: 'SKKem',
  },
  {
    label: 'KTP Direktur',
    key: 'KTPDir',
  },
  {
    label: 'Akta Pendirian',
    key: 'AktaPend',
  },
  {
    label: 'NIB Perusahaan',
    key: 'NIBPer',
  },
  {
    label: 'NPWP Direktur',
    key: 'NPWPDir',
  },
  {
    label: 'Surat Kuasa',
    key: 'SuratKuasa',
  },
]; //dummy data

const Cbd = [
  {
    label: 'Foto NPWP',
    key: 'FotoNpwp',
  },
  {
    label: 'Foto KTP',
    key: 'FotoKtp',
  },
]; //dummy data

async function fileToUploads(type: string) {
  return new Promise<{ key: string; label: string }[]>((resolve, reject) => {
    if (type === 'cbd') {
      setTimeout(() => {
        resolve(Cbd);
      }, 5000);
    } else if (type === 'credit') {
      setTimeout(() => {
        resolve(fileCredit);
      }, 5000);
    } else {
      reject({ message: 'error' });
    }
  });
} //dummy request

function checkDocFilled(data: { [key: string]: any }) {
  return Object.values(data).every((val) => !!val);
}

export default function ThirdStep() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileKeys, setFileKeys] = useState<{ key: string; label: string }[]>(
    []
  );
  const [documents, setDocuments] = useState<{ [key: string]: any }>({});

  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);

  useEffect(() => {
    if (sphState?.paymentType) {
      // console.log(sphState?.paymentType, 'paymenttype');
      (async () => {
        try {
          setFileKeys([]);
          setDocuments({});
          setIsLoading(true);
          const dataFileKey = await fileToUploads(sphState.paymentType);

          const documentObj: { [key: string]: any } = {};
          dataFileKey.forEach((key) => {
            documentObj[key.key] = null;
          });
          const parentReqDocKeys = Object.keys(
            sphState.paymentRequiredDocuments
          );
          const localReqDocKeys = Object.keys(documentObj);
          const sphDocString = JSON.stringify(parentReqDocKeys);
          const stateDocString = JSON.stringify(localReqDocKeys);

          if (sphDocString === stateDocString && parentReqDocKeys.length > 0) {
            setDocuments(sphState.paymentRequiredDocuments);
          } else {
            setDocuments(documentObj);
          }

          setIsLoading(false);
          setFileKeys(dataFileKey);
        } catch (error) {
          setIsLoading(false);
          console.log(error, 'error');
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphState?.paymentType]);

  useEffect(() => {
    if (stateUpdate) {
      stateUpdate('paymentRequiredDocuments')(documents);
      const isFilled = checkDocFilled(documents);
      stateUpdate('paymentDocumentsFullfilled')(isFilled);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]);

  const inputsData2: Input[] = useMemo(() => {
    const inputs: Input[] = [
      {
        label: 'Tipe Pembayaran',
        isRequire: true,
        isError: sphState?.paymentType ? false : true,
        type: 'cardOption',
        // onChange: () => {
        //   getPaymentDocReq();
        // },
        value: sphState?.paymentType,
        options: [
          {
            title: 'Cash Before Delivery',
            icon: cbd,
            value: 'cbd',
            onChange: () => {
              if (stateUpdate) {
                stateUpdate('paymentType')('cbd');
                // getPaymentDocReq('cbd');
              }
            },
          },
          {
            title: 'Credit',
            icon: credit,
            value: 'credit',
            onChange: () => {
              if (stateUpdate) {
                stateUpdate('paymentType')('credit');
                // getPaymentDocReq('credit');
              }
            },
          },
        ],
      },
    ];
    fileKeys.forEach((key) => {
      inputs.push({
        label: key.label,
        onChange: (data: any) => {
          if (stateUpdate) {
            setDocuments((curr) => {
              return {
                ...curr,
                [key.key]: data,
              };
            });
          }
        }, //onChange(key.key),
        type: 'fileInput',
        value: sphState?.paymentRequiredDocuments?.[key.key],
        isRequire: true,
        isError: Boolean(!sphState?.paymentRequiredDocuments?.[key.key]),
      });
    });
    return inputs;
  }, [fileKeys, sphState, stateUpdate]);

  return (
    <BContainer>
      <View style={style.container}>
        <ScrollView>
          <View pointerEvents={isLoading ? 'none' : 'auto'}>
            <BForm inputs={inputsData2} />
          </View>
          {isLoading && (
            <View>
              <ShimmerPlaceHolder style={style.fileInputShimmer} />
              <BSpacer size={'extraSmall'} />
              <ShimmerPlaceHolder style={style.fileInputShimmer} />
            </View>
          )}
        </ScrollView>

        <View>
          {sphState?.paymentType === 'credit' && (
            <View style={style.checkboxContainer}>
              <Checkbox
                status={
                  sphState?.paymentBankGuarantee ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  if (stateUpdate) {
                    stateUpdate('paymentBankGuarantee')(
                      !sphState?.paymentBankGuarantee
                    );
                  }
                }}
              />
              <Text style={style.checkboxLabel}>
                Bersedia untuk menyediakan Bank Guarantee{' '}
                <Text style={style.redStar}>*</Text>
              </Text>
            </View>
          )}
          <BSpacer size={'small'} />
          <BBackContinueBtn
            onPressBack={() => {}}
            onPressContinue={() => {
              if (setCurrentPosition) {
                setCurrentPosition(3);
              }
            }}
            disableContinue={
              !(
                sphState?.paymentType &&
                sphState?.paymentDocumentsFullfilled &&
                (sphState.paymentType === 'credit'
                  ? sphState?.paymentBankGuarantee
                  : true)
              ) || isLoading
            }
            loadingContinue={isLoading}
          />
          {/* <View style={style.buttonContainer}>
            <View style={style.backButtonContainer}>
              <BButtonPrimary title="Kembali" isOutline />
            </View>
            <View style={style.continueButtonContainer}>
              <BButtonPrimary title="Lanjut" />
            </View>
          </View> */}
        </View>
      </View>
    </BContainer>
  );
}
const style = StyleSheet.create({
  fileInputShimmer: {
    width: resScale(330),
    height: resScale(30),
    borderRadius: resScale(8),
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    width: '30%',
  },
  continueButtonContainer: {
    width: '40%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redStar: {
    color: colors.primary,
  },
  checkboxLabel: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: font.size.md,
    color: colors.textInput.input,
  },
});
