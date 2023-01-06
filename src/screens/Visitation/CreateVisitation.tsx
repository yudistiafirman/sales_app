import React from 'react';
import { View, ScrollView } from 'react-native';
import { BContainer, BText } from '@/components';
import SecondStep from './elements/second';
import { Button } from 'react-native-paper';
import ThirdStep from './elements/third';

interface IState {
  step: number;
  stepOne: {};
  stepTwo: {};
  stepThree: {};
}

const CreateVisitation = () => {
  const [state, setState] = React.useState<IState>({
    step: 1,
    stepOne: {},
    stepTwo: {},
    stepThree: {},
  });

  const updateValue = (key: keyof IState, value: any) => {
    setState({
      ...state,
      [key]: value,
    });

    console.log(state, '<STATE DI PARENT');
  };

  const stepRender = [
    <BText>1</BText>,
    <SecondStep updateValue={updateValue} />,
    <ThirdStep updateValue={updateValue} />,
  ];

  const next = (nextStep: number) => () => {
    const totalStep = stepRender.length;

    if (nextStep < totalStep && nextStep >= 0) {
      updateValue('step', nextStep);
    }

    console.log(state, 'ini step');
  };

  return (
    <BContainer>
      <ScrollView>
        {stepRender[state.step]}
        {/* {stepRender[state.step]}
        {stepRender[state.step]} */}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button
          mode="text"
          onPress={next(state.step - 1)}
          // disabled={state.step === 0}
        >
          Kembali
        </Button>
        <Button
          mode="contained"
          icon="chevron-right"
          contentStyle={{ flexDirection: 'row-reverse' }}
          onPress={next(state.step + 1)}
          // disabled={state.step === stepRender.length - 1}
        >
          Lanjut
        </Button>
      </View>
    </BContainer>
  );
};

export default CreateVisitation;
