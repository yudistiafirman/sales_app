import React, { useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
} from 'react-native';
import {
  BForm,
  BLabel,
  BSpacer,
  BText,
  BTextInput,
  SVGName,
} from '@/components';
import { CreateVisitationThirdStep, Input } from '@/interfaces';
import { MONTH_LIST, STAGE_PROJECT, WEEK_LIST } from '@/constants/dropdown';
import ProductChip from './ProductChip';
import { createVisitationContext } from '@/context/CreateVisitationContext';
import { TextInput } from 'react-native-paper';

import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import { ALL_PRODUCT, CREATE_VISITATION, SEARCH_PRODUCT } from '@/navigation/ScreenNames';
import { fonts } from '@/constants';

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const ThirdStep = () => {
  const navigation = useNavigation();
  const { values, action } = React.useContext(createVisitationContext);
  const { stepThree: state } = values;
  const { updateValueOnstep } = action;

  const onChange = (key: keyof CreateVisitationThirdStep) => (e: any) => {
    updateValueOnstep('stepThree', key, e);
  };

  const inputs: Input[] = [
    {
      label: 'Fase Proyek',
      isRequire: true,
      isError: false,
      value: state.stageProject,
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
      value: state.estimationDate,
      comboDropdown: {
        itemsOne: WEEK_LIST,
        itemsTwo: MONTH_LIST,
        valueOne: values.stepThree.estimationDate.estimationWeek,
        valueTwo: values.stepThree.estimationDate.estimationMonth,
        onChangeOne: (value: any) => {
          const estimateionDate = { ...values.stepThree.estimationDate };
          estimateionDate.estimationWeek = value;
          updateValueOnstep('stepThree', 'estimationDate', estimateionDate);
        },
        onChangeTwo: (value: any) => {
          const estimateionDate = { ...values.stepThree.estimationDate };
          estimateionDate.estimationMonth = value;
          updateValueOnstep('stepThree', 'estimationDate', estimateionDate);
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
      value: state.paymentType,
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
      value: state.notes,
      textSize: fonts.size.sm,
    },
  ];

  const listenerCallback = useCallback(
    ({ data }: { data: any }) => {
      const newArray = [...state.products, data];
      const uniqueArray = newArray.reduce((acc, obj) => {
        if (!acc[obj.id]) {
          acc[obj.id] = obj;
        }
        return acc;
      }, {} as { [id: number]: any });
      updateValueOnstep('stepThree', 'products', Object.values(uniqueArray));
    },
    [state.products]
  );

  const deleteProduct = (index: number) => {
    const products = state.products;
    const restProducts = products.filter((o, i) => index !== i);
    updateValueOnstep('stepThree', 'products', restProducts);
  };

  useEffect(() => {
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
            longitude: Number(values.stepOne.createdLocation.lon),
            latitude: Number(values.stepOne.createdLocation.lat),
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
            navigation.navigate(SEARCH_PRODUCT, {
              isGobackAfterPress: true,
              distance: values.stepOne.createdLocation?.distance?.value,
            });
          }}
        />
        <BTextInput
          placeholder="Cari Produk"
          left={<TextInput.Icon icon={'magnify'} />}
        />
      </View>
      <BSpacer size={'extraSmall'} />
      {state.products.length ? (
        <>
          <ScrollView horizontal={true}>
            {state.products.map((val, index) => (
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
