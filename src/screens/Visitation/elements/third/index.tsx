import React, { useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import { BForm, BLabel, BSpacer, BText, BTextInput } from '@/components';
import { CreateVisitationThirdStep, Input } from '@/interfaces';
import { MONTH_LIST, STAGE_PROJECT, WEEK_LIST } from '@/constants/dropdown';
import ProductChip from './ProductChip';
import { TextInput } from 'react-native-paper';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import {
  ALL_PRODUCT,
  CREATE_VISITATION,
  SEARCH_PRODUCT,
} from '@/navigation/ScreenNames';
import { fonts } from '@/constants';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateStepThree } from '@/redux/reducers/VisitationReducer';

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const ThirdStep = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const visitationData = useSelector((state: RootState) => state.visitation);

  const onChange = (key: keyof CreateVisitationThirdStep) => (e: any) => {
    let stepThree;
    stepThree = {
      ...visitationData,
      [key]: e,
    };
    dispatch(updateStepThree(stepThree));
  };

  const inputs: Input[] = [
    {
      label: 'Fase Proyek',
      isRequire: true,
      isError: false,
      value: visitationData?.stageProject,
      onChange: onChange('stageProject'),
      type: 'dropdown',
      dropdown: {
        items: STAGE_PROJECT,
        placeholder: 'Fase Proyek',
        onChange: (value: any) => {
          onChange('stageProject')(value);
        },
      },
    },
  ];

  const inputsTwo: Input[] = [
    {
      label: 'Estimasi Waktu Dibutuhkannya Barang',
      isRequire: true,
      type: 'comboDropdown',
      // onChange: onChange('estimationDate'),
      value: visitationData?.estimationDate,
      comboDropdown: {
        itemsOne: WEEK_LIST,
        itemsTwo: MONTH_LIST,
        valueOne: visitationData?.stepThree?.estimationDate?.estimationWeek,
        valueTwo: visitationData?.stepThree?.estimationDate?.estimationMonth,
        onChangeOne: (value: any) => {
          const estimateionDate = {
            ...visitationData?.stepThree?.estimationDate,
          };
          estimateionDate.estimationWeek = value;
          let stepThree;
          stepThree = {
            ...visitationData,
            estimationDate: estimateionDate,
          };
          dispatch(updateStepThree(stepThree));
        },
        onChangeTwo: (value: any) => {
          const estimateionDate = {
            ...visitationData?.stepThree?.estimationDate,
          };
          estimateionDate.estimationMonth = value;
          let stepThree;
          stepThree = {
            ...visitationData,
            estimationDate: estimateionDate,
          };
          dispatch(updateStepThree(stepThree));
        },
        placeholderOne: 'Pilih Minggu',
        placeholderTwo: 'Pilih Bulan',
        errorMessageOne: 'Pilih minggu',
        errorMessageTwo: 'Pilih bulan',
        isErrorOne: false,
        isErrorTwo: false,
      },
    },
    {
      label: 'Tipe Pembayaran',
      isRequire: true,
      isError: false,
      type: 'cardOption',
      onChange: onChange('paymentType'),
      value: visitationData?.paymentType,
      options: [
        {
          title: 'Cash Before Delivery',
          icon: cbd,
          value: 'CBD',
          onChange: () => {
            onChange('paymentType')('CBD');
          },
        },
        {
          title: 'Credit',
          icon: credit,
          value: 'CREDIT',
          onChange: () => {
            onChange('paymentType')('CREDIT');
          },
        },
      ],
    },
    {
      label: 'Catatan Sales',
      isRequire: false,
      isError: false,
      type: 'area',
      placeholder: 'Tulis catatan di sini',
      onChange: onChange('notes'),
      value: visitationData?.notes,
      textSize: fonts.size.sm,
    },
  ];

  const listenerCallback = useCallback(
    ({ data }: { data: any }) => {
      const newArray = [...visitationData?.products, data];
      const uniqueArray = newArray.reduce((acc, obj) => {
        if (!acc[obj.id]) {
          acc[obj.id] = obj;
        }
        return acc;
      }, {} as { [id: number]: any });
      let stepThree;
      stepThree = {
        ...visitationData,
        products: Object.values(uniqueArray),
      };
      dispatch(updateStepThree(stepThree));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visitationData?.products]
  );

  const deleteProduct = (index: number) => {
    const products = visitationData?.products;
    const restProducts = products.filter((o, i) => index !== i);
    let stepThree;
    stepThree = {
      ...visitationData,
      products: restProducts,
    };
    dispatch(updateStepThree(stepThree));
  };

  useEffect(() => {
    crashlytics().log(CREATE_VISITATION + '-Step3');

    DeviceEventEmitter.addListener('event.testEvent', listenerCallback);
    return () => {
      DeviceEventEmitter.removeAllListeners('event.testEvent');
    };
  }, [listenerCallback]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* <BText>step 3</BText> */}
      <BForm titleBold="500" inputs={inputs} />
      <TouchableOpacity
        onPress={() => {
          const coordinate = {
            longitude:
              visitationData?.stepOne?.locationAddress.lon !== 0
                ? Number(visitationData?.stepOne?.locationAddress?.lon)
                : Number(visitationData?.stepOne?.createdLocation?.lon),
            latitude:
              visitationData?.stepOne.locationAddress.lat !== 0
                ? Number(visitationData?.stepOne?.locationAddress?.lat)
                : Number(visitationData?.stepOne?.createdLocation?.lat),
          };
          navigation.navigate(ALL_PRODUCT, {
            coordinate: coordinate,
            from: CREATE_VISITATION,
          });
        }}
        style={styles.labelContainer}
      >
        <BLabel bold="500" label="Produk" isRequired />
        <BText bold="500" color="primary">
          Lihat Semua
        </BText>
      </TouchableOpacity>
      <View style={styles.posRelative}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            const distance = visitationData?.stepOne?.locationAddress?.distance
              ?.value
              ? visitationData?.stepOne?.locationAddress?.distance?.value
              : visitationData?.stepOne?.createdLocation?.distance?.value;
            navigation.navigate(SEARCH_PRODUCT, {
              isGobackAfterPress: true,
              distance: distance,
            });
          }}
        />
        <BTextInput
          placeholder="Cari Produk"
          left={<TextInput.Icon icon={'magnify'} />}
        />
      </View>
      <BSpacer size={'extraSmall'} />
      {visitationData?.products?.length ? (
        <>
          <ScrollView horizontal={true}>
            {visitationData?.products.map((val, index) => (
              <React.Fragment key={index}>
                <ProductChip
                  name={val.display_name}
                  category={val.Category}
                  onDelete={() => deleteProduct(index)}
                />
                <BSpacer size="extraSmall" />
              </React.Fragment>
            ))}
          </ScrollView>
          <BSpacer size="medium" />
        </>
      ) : (
        <BSpacer size="extraSmall" />
      )}
      <BForm titleBold="500" inputs={inputsTwo} />
    </ScrollView>
  );
};

export default ThirdStep;

const styles = StyleSheet.create({
  posRelative: {
    position: 'relative',
    // backgroundColor: 'blue',
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: resScale(4),
    height: resScale(45),
    zIndex: 2,
    // backgroundColor: 'red',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
