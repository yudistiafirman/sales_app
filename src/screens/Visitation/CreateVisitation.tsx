import React, { useEffect, useState } from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import {
  BBackContinueBtn,
  BButtonPrimary,
  BContainer,
  BSpacer,
} from '@/components';
import SecondStep from './elements/second';
import ThirdStep from './elements/third';
import { CreateVisitationState, PIC, Styles } from '@/interfaces';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import BSheetAddPic from './elements/second/BottomSheetAddPic';
import {
  createVisitationContext,
  CreateVisitationProvider,
} from '@/context/CreateVisitationContext';
import Fourth from './elements/fourth';
import { useKeyboardActive } from '@/hooks';
import FirstStep from './elements/first';
import { BStepperIndicator } from '@/components';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';

const labels = [
  'Alamat Proyek',
  'Data Pelanggan',
  'Data Proyek',
  'Kelengkapan Foto',
];

function ContinueIcon() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

function stepHandler(
  state: CreateVisitationState,
  setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
  const { stepOne, stepTwo, stepThree, stepFour } = state;
  console.log(stepTwo, 'stepTwo');

  if (
    stepOne.createdLocation.formattedAddress &&
    stepOne.locationAddress.formattedAddress
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 0];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 0));
  }
  if (
    stepTwo.customerType &&
    stepTwo.companyName &&
    stepTwo.projectName &&
    stepTwo.selectedPic
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 1));
  }

  if (
    stepThree.stageProject &&
    stepThree.products.length > 0 &&
    stepThree.estimationDate.estimationMonth &&
    stepThree.estimationDate.estimationWeek &&
    stepThree.paymentType
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 2];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 2));
  }

  if (stepFour.images.length > 0) {
    setStepsDone((curr) => {
      return [...new Set(curr), 3];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 3));
  }
}
const CreateVisitation = () => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const { values, action } = React.useContext(createVisitationContext);
  const { shouldScrollView } = values;
  const { updateValue, updateValueOnstep } = action;
  const { keyboardVisible } = useKeyboardActive();
  const [stepsDone, setStepsDone] = useState<number[]>([0, 1, 2, 3]);

  useEffect(() => {
    stepHandler(values, setStepsDone);
  }, [values]);

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
    <>
      <BStepperIndicator
        stepsDone={stepsDone}
        stepOnPress={(pos: number) => {
          next(pos)();
        }}
        currentStep={values.step}
        labels={labels}
      />
      <BSheetAddPic
        ref={bottomSheetRef}
        initialIndex={values.sheetIndex}
        addPic={addPic}
      />
      <BContainer>
        {/* {shouldScrollView ? (
        <ScrollView>{stepRender[values.step]}</ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{stepRender[values.step]}</View>
      )} */}
        <View style={styles.container}>
          {stepRender[values.step]}
          <BSpacer size={'extraSmall'} />
          {!keyboardVisible && shouldScrollView && values.step > 0 && (
            <BBackContinueBtn
              onPressContinue={() => {
                next(values.step + 1)();
                DeviceEventEmitter.emit(
                  'CreateVisitation.continueButton',
                  true
                );
              }}
              onPressBack={next(values.step - 1)}
              disableContinue={!stepsDone.includes(values.step)}
            />
          )}
          {values.step === 0 && (
            <BButtonPrimary
              disable={!stepsDone.includes(values.step)}
              title="Lanjut"
              onPress={next(values.step + 1)}
              rightIcon={ContinueIcon}
            />
          )}
        </View>
      </BContainer>
    </>
  );
};

const styles: Styles = {
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: { flexDirection: 'row-reverse' },
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
};

const CreateVisitationWithProvider = (props: any) => {
  return (
    <CreateVisitationProvider>
      <CreateVisitation {...props} />
    </CreateVisitationProvider>
  );
};

export default CreateVisitationWithProvider;
