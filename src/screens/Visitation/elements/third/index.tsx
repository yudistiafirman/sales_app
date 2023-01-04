import React from 'react';
import { View, ScrollView } from 'react-native';
import { BForm, BSpacer, BText } from '@/components';
import { Input } from '@/interfaces';
import { MONTH_LIST, STAGE_PROJECT, WEEK_LIST } from '@/constants/dropdown';
import ProductChip from './ProductChip';

interface IProps {
  updateValue: (key: keyof IState, value: any) => void;
}

interface IState {
  step: number;
  stepOne: {};
  stepTwo: {};
  stepThree: {};
}

interface ThirdState {
  stageProject: string;
  products: any[];
  estimationDate: {
    estimationWeek: number | null;
    estimationMonth: number | null;
  };
  paymentType: string;
  notes: string;
}

const cbd = require('@/assets/icon/Visitation/cbd.png');
const credit = require('@/assets/icon/Visitation/credit.png');

const ThirdStep = ({ updateValue }: IProps) => {
  const [state, setState] = React.useState<ThirdState>({
    estimationDate: {
      estimationMonth: null,
      estimationWeek: null,
    },
    notes: '',
    paymentType: '',
    products: [],
    stageProject: '',
  });

  const onChange = (key: keyof ThirdState) => (e: any) => {
    setState({
      ...state,
      [key]: e,
    });
  };

  const inputs: Input[] = [
    {
      label: 'Fase Proyek',
      isRequire: true,
      isError: true,
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
        onChangeOne: (value: any) => {
          setState({
            ...state,
            estimationDate: {
              ...state.estimationDate,
              estimationWeek: value,
            },
          });
        },
        onChangeTwo: (value: any) => {
          setState({
            ...state,
            estimationDate: {
              ...state.estimationDate,
              estimationMonth: value,
            },
          });
        },
        placeholderOne: 'Pilih Minggu',
        placeholderTwo: 'Pilih Bulan',
        errorMessageOne: 'Pilih minggu',
        errorMessageTwo: 'Pilih bulan',
        isErrorOne: true,
        isErrorTwo: true,
      },
    },
    {
      label: 'Tipe Pemabayaran',
      isRequire: true,
      isError: true,
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
      isError: true,
      type: 'area',
      onChange: onChange('notes'),
      value: state.notes,
    },
  ];

  React.useEffect(() => {
    updateValue('stepThree', state);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

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
      <BSpacer size="small" />
      <BForm inputs={inputsTwo} />
    </View>
  );
};

export default ThirdStep;
