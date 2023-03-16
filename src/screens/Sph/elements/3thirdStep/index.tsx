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
import { fetchSphDocuments } from '@/redux/async-thunks/commonThunks';
import { useDispatch, useSelector } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import { SPH } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';
import { RootState } from '@/redux/store';
import {
  updatePaymentBankGuarantee,
  updatePaymentType,
  updateRequiredDocuments,
} from '@/redux/reducers/SphReducer';

type documentType = {
  id: string;
  name: string;
  payment_type: 'CBD' | 'CREDIT';
  is_required: boolean;
};
const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

type docResponse = {
  cbd: documentType[];
  credit: documentType[];
};

function checkDocFilled(data: { [key: string]: any }) {
  return Object.values(data).every((val) => !!val);
}

export default function ThirdStep() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [fileKeys, setFileKeys] = useState<
    { key: string; label: string; isRequired: boolean }[]
  >([]);
  const [documents, setDocuments] = useState<{ [key: string]: any }>({});
  const [sphDocuments, setSphDocuments] = useState<docResponse>({
    cbd: [],
    credit: [],
  });
  const [sphState, stateUpdate, setCurrentPosition] = useContext(SphContext);
  const { paymentType, paymentRequiredDocuments, paymentBankGuarantee } =
    useSelector((state: RootState) => state.sph);

  useEffect(() => {
    crashlytics().log(SPH + '-Step3');

    if (paymentType) {
      const objKey: {
        CREDIT: 'credit';
        CBD: 'cbd';
      } = {
        CREDIT: 'credit',
        CBD: 'cbd',
      };
      const key: 'cbd' | 'credit' = objKey[paymentType];

      if (sphDocuments[key]) {
        if (sphDocuments[key].length) {
          const newFileKeys = sphDocuments[key].map((doc) => {
            return {
              key: doc.id,
              label: doc.name,
              isRequired: doc.is_required,
            };
          });
          const documentObj: { [key: string]: any } = {};
          sphDocuments[key].forEach((doc) => {
            documentObj[doc.id] = null;
          });
          const parentReqDocKeys = Object.keys(paymentRequiredDocuments);
          const localReqDocKeys = Object.keys(documentObj);
          const parentDocString = JSON.stringify(parentReqDocKeys);
          const localDocString = JSON.stringify(localReqDocKeys);

          if (
            parentDocString === localDocString &&
            parentReqDocKeys.length > 0
          ) {
            setDocuments(paymentRequiredDocuments);
          } else {
            setDocuments(documentObj);
          }
          setFileKeys(newFileKeys);
        }
      }
    }
  }, [sphDocuments, paymentType]);

  async function getDocument() {
    try {
      setIsLoading(true);
      const response: docResponse = await dispatch(
        fetchSphDocuments()
      ).unwrap();

      if (paymentType) {
        const objKey: {
          CREDIT: 'credit';
          CBD: 'cbd';
        } = {
          CREDIT: 'credit',
          CBD: 'cbd',
        };
        const key: 'cbd' | 'credit' = objKey[paymentType];
        if (response[key]) {
          if (response[key].length) {
            const newFileKeys = response[key].map((doc) => {
              return {
                key: doc.id,
                label: doc.name,
                isRequired: doc.is_required,
              };
            });
            const documentObj: { [key: string]: any } = {};
            response[key].forEach((doc) => {
              documentObj[doc.id] = null;
            });
            const parentReqDocKeys = Object.keys(paymentRequiredDocuments);
            const localReqDocKeys = Object.keys(documentObj);
            const parentDocString = JSON.stringify(parentReqDocKeys);
            const localDocString = JSON.stringify(localReqDocKeys);

            if (
              parentDocString === localDocString &&
              parentReqDocKeys.length > 0
            ) {
              setDocuments(paymentRequiredDocuments);
            } else {
              setDocuments(documentObj);
            }
            setFileKeys(newFileKeys);
          }
        }
      }
      setSphDocuments(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      customLog('error getDocument128', error);
    }
  }

  useEffect(() => {
    getDocument();
  }, []);

  useEffect(() => {
    // if (stateUpdate) {
    // stateUpdate('paymentRequiredDocuments')(documents);
    dispatch(updateRequiredDocuments(documents));
    // const isFilled = checkDocFilled(documents);
    // stateUpdate('paymentDocumentsFullfilled')(isFilled);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]);
  const inputsData2: Input[] = useMemo(() => {
    const inputs: Input[] = [
      {
        label: 'Tipe Pembayaran',
        isRequire: true,
        isError: paymentType ? false : true,
        type: 'cardOption',
        // onChange: () => {
        //   getPaymentDocReq();
        // },
        value: paymentType,
        options: [
          {
            title: 'Cash Before Delivery',
            icon: cbd,
            value: 'CBD',
            onChange: () => {
              // if (stateUpdate) {
              // stateUpdate('paymentType')('CBD');
              dispatch(updatePaymentType('CBD'));
              // getPaymentDocReq('cbd');
              // }
            },
          },
          {
            title: 'Credit',
            icon: credit,
            value: 'CREDIT',
            onChange: () => {
              // if (stateUpdate) {
              // stateUpdate('paymentType')('CREDIT');
              dispatch(updatePaymentType('CREDIT'));
              // getPaymentDocReq('credit');
              // }
            },
          },
        ],
      },
    ];
    fileKeys.forEach((key) => {
      inputs.push({
        label: key.label,
        onChange: (data: any) => {
          if (data) {
            setDocuments((curr) => {
              customLog(curr, 'curr298');

              return {
                ...curr,
                [key.key]: {
                  ...data,
                  name: key.key.trim() + data.name.trim(),
                },
              };
            });
          }
          // stateUpdate('paymentRequiredDocuments')({
          //   ...sphState.paymentRequiredDocuments,
          //   [key.key]: data,
          // });
        }, //onChange(key.key),
        type: 'fileInput',
        value: paymentRequiredDocuments?.[key.key],
        isRequire: key.isRequired,
        isError: key.isRequired ? !paymentRequiredDocuments?.[key.key] : false,
      });
    });
    return inputs;
  }, [fileKeys, documents, paymentRequiredDocuments, paymentType]);
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
          {paymentType === 'CREDIT' && (
            <View style={style.checkboxContainer}>
              <Checkbox
                status={paymentBankGuarantee ? 'checked' : 'unchecked'}
                onPress={() => {
                  // if (stateUpdate) {
                  //   stateUpdate('paymentBankGuarantee')(!paymentBankGuarantee);
                  // }
                  dispatch(updatePaymentBankGuarantee(!paymentBankGuarantee));
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
            onPressBack={() => {
              setCurrentPosition(1);
            }}
            onPressContinue={() => {
              if (setCurrentPosition) {
                setCurrentPosition(3);
              }
            }}
            disableContinue={
              !(
                paymentType &&
                (paymentType === 'CREDIT' ? paymentBankGuarantee : true)
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
