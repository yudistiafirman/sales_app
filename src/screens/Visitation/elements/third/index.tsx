import React from 'react';
import { View, ScrollView } from 'react-native';
import { BForm, BSpacer, BText } from '@/components';
import { CreateVisitationThirdStep, Input } from '@/interfaces';
import { MONTH_LIST, STAGE_PROJECT, WEEK_LIST } from '@/constants/dropdown';
import ProductChip from './ProductChip';
import { createVisitationContext } from '@/context/CreateVisitationContext';

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const ThirdStep = () => {
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
      label: 'Tipe Pemabayaran',
      isRequire: true,
      isError: false,
      type: 'cardOption',
      onChange: onChange('paymentType'),
      value: state.paymentType,
      options: [
        {
          title: 'Cash Before Delivery',
          icon: cbd,
          value: 'cbd',
          onChange: () => {
            onChange('paymentType')('cbd');
          },
        },
        {
          title: 'Credit',
          icon: credit,
          value: 'credit',
          onChange: () => {
            onChange('paymentType')('credit');
          },
        },
      ],
    },
    {
      label: 'Catatan Sales',
      isRequire: true,
      isError: false,
      type: 'area',
      onChange: onChange('notes'),
      value: state.notes,
    },
  ];

  const products = [
    {
      name: 'Product 1',
    },
    {
      name: 'Product 2',
    },
    {
      name: 'Product 3',
    },
    {
      name: 'Product 4',
    },
    {
      name: 'Product 5',
    },
    {
      name: 'Product 6',
    },
    {
      name: 'Product 7',
    },
  ];

  return (
    <View>
      <BText>step 3</BText>
      <BForm inputs={inputs} />
      <ScrollView horizontal={true}>
        {products.map((val, index) => (
          <React.Fragment key={index}>
            <ProductChip name="k150" category={{ name: 'NFA' }} />
            <BSpacer size="extraSmall" />
          </React.Fragment>
        ))}
      </ScrollView>
      <BSpacer size="medium" />
      <BForm inputs={inputsTwo} />
    </View>
  );
};

export default ThirdStep;
