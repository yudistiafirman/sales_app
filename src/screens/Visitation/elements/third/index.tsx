import React from 'react';
import { View } from 'react-native';
import { BForm, BText } from '@/components';
import { Input } from '@/interfaces';

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
      label: 'Estimasi Yang dibutuhkan barang',
      isRequire: true,
      type: 'estimationDate',
      onChange: onChange('estimationDate'),
      value: state.estimationDate,
    },
    {
      label: 'Tipe Pemabayaran',
      isRequire: true,
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
      type: 'area',
      onChange: onChange('notes'),
      value: state.notes,
    },
  ];

  React.useEffect(() => {
    updateValue('stepThree', state);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <View>
      <BText>step 3</BText>
      <BForm inputs={inputs} />
    </View>
  );
};

export default ThirdStep;
