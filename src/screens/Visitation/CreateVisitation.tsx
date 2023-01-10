import React from 'react';
import { View, ScrollView } from 'react-native';
import { BContainer, BText } from '@/components';
import SecondStep from './elements/second';
import { Button } from 'react-native-paper';
import ThirdStep from './elements/third';
import { PIC, Styles } from '@/interfaces';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import BSheetAddPic from './elements/second/BottomSheetAddPic';
import {
  createVisitationContext,
  CreateVisitationProvider,
} from '@/context/CreateVisitationContext';
import Fourth from './elements/fourth';

const CreateVisitation = () => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const { values, action } = React.useContext(createVisitationContext);
  const { updateValue, updateValueOnstep } = action;

  const next = (nextStep: number) => () => {
    const totalStep = stepRender.length;
    console.log(values, 'ini values');
    if (nextStep < totalStep && nextStep >= 0) {
      updateValue('step', nextStep);
    }
  };

  const addPic = (state: PIC) => {
    updateValueOnstep('stepTwo', 'pics', [...values.stepTwo.pics, state]);
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const stepRender = [
    <BText>1</BText>,
    <SecondStep openBottomSheet={openBottomSheet} />,
    <ThirdStep />,
    <Fourth />,
  ];

  return (
    <BContainer>
      <ScrollView>
        {stepRender[values.step]}
        {/* {stepRender[state.step]}
          {stepRender[state.step]} */}
      </ScrollView>
      <View style={styles.footer}>
        <Button
          mode="text"
          onPress={next(values.step - 1)}
          // disabled={state.step === 0}
        >
          Kembali
        </Button>
        <Button
          mode="contained"
          icon="chevron-right"
          contentStyle={styles.button}
          onPress={next(values.step + 1)}
          // disabled={state.step === stepRender.length - 1}
        >
          Lanjut
        </Button>
      </View>
      <BSheetAddPic
        ref={bottomSheetRef}
        initialIndex={values.sheetIndex}
        addPic={addPic}
      />
    </BContainer>
  );
};

const styles: Styles = {
  sheetStyle: {
    // paddingLeft: 20,
    // paddingRight: 20,
    backgroundColor: 'red',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: { flexDirection: 'row-reverse' },
};

const CreateVisitationWithProvider = () => {
  return (
    <CreateVisitationProvider>
      <CreateVisitation />
    </CreateVisitationProvider>
  );
};

export default CreateVisitationWithProvider;
