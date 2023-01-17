import React from 'react';
import { View } from 'react-native';
import { BContainer } from '@/components';
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
import { useKeyboardActive } from '@/hooks';
import FirstStep from './elements/first';

const CreateVisitation = () => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const { values, action } = React.useContext(createVisitationContext);
  const { shouldScrollView } = values;
  const { updateValue, updateValueOnstep } = action;
  const { keyboardVisible } = useKeyboardActive();

  const next = (nextStep: number) => () => {
    const totalStep = stepRender.length;
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
    <FirstStep />,
    <SecondStep openBottomSheet={openBottomSheet} />,
    <ThirdStep />,
    <Fourth />,
  ];

  return (
    <BContainer>
      {/* {shouldScrollView ? (
        <ScrollView>{stepRender[values.step]}</ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{stepRender[values.step]}</View>
      )} */}
      {stepRender[values.step]}
      {!keyboardVisible && shouldScrollView && (
        <View style={styles.footer}>
          <Button mode="text" onPress={next(values.step - 1)}>
            Kembali
          </Button>
          <Button
            mode="contained"
            icon="chevron-right"
            contentStyle={styles.button}
            onPress={next(values.step + 1)}
          >
            Lanjut
          </Button>
        </View>
      )}
      <BSheetAddPic
        ref={bottomSheetRef}
        initialIndex={values.sheetIndex}
        addPic={addPic}
      />
    </BContainer>
  );
};

const styles: Styles = {
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: { flexDirection: 'row-reverse' },
};

const CreateVisitationWithProvider = (props: any) => {
  return (
    <CreateVisitationProvider>
      <CreateVisitation {...props} />
    </CreateVisitationProvider>
  );
};

export default CreateVisitationWithProvider;
