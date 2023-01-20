import { View, ScrollView } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
// import StepIndicator from 'react-native-step-indicator';
import StepperIndicator from './elements/StepIndicator';

import Steps from './elements/Steps';
import { SphContext } from './elements/context/SphContext';
import { SphStateInterface, SphContextInterface } from '@/interfaces';

import FirstStep from './elements/1firstStep';
import SecondStep from './elements/2secondStep';
import ThirdStep from './elements/3thirdStep';
import FourthStep from './elements/4fourthStep';
import FifthStep from './elements/5fifthStep';

const labels = [
  'Cari Pelanggan',
  'Konfirmasi Alamat',
  'Tipe Pembayaran',
  'Pilih Produk',
  'Ringkasan',
];

const stepsToRender = [
  <FirstStep />,
  <SecondStep />,
  <ThirdStep />,
  <FourthStep />,
  <FifthStep />,
];

// enum
function stepHandler(
  sphData: SphStateInterface,
  stepsDone: number[],
  setSteps: (e: number[] | ((curr: number[]) => number[])) => void,
  stepController: (step: number) => void
) {
  if (sphData.selectedPic && sphData.selectedCompany) {
    if (!stepsDone.includes(0)) {
      setSteps((curr) => {
        return [...new Set(curr), 0];
      });
    }
  } else {
    setSteps((curr) => curr.filter((num) => num !== 0));
  }
  const billingAddressFilled =
    !Object.values(sphData.billingAddress).every((val) => !val) &&
    Object.entries(sphData.billingAddress.addressAutoComplete).length > 1;

  if (sphData.isBillingAddressSame || billingAddressFilled) {
    setSteps((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setSteps((curr) => curr.filter((num) => num !== 1));
  }

  const paymentCondition =
    sphData.paymentType === 'credit' ? sphData.paymentBankGuarantee : true;

  if (
    sphData.paymentDocumentsFullfilled &&
    sphData.paymentType &&
    paymentCondition
  ) {
    setSteps((curr) => {
      return [...new Set(curr), 2];
    });
  } else {
    setSteps((curr) => curr.filter((num) => num !== 2));
  }

  if (sphData.chosenProducts.length > 0) {
    setSteps((curr) => {
      return [...new Set(curr), 3];
    });
  } else {
    setSteps((curr) => curr.filter((num) => num !== 3));
  }
  const max = Math.max(...stepsDone);
  console.log(stepsDone, 'stepsDone');

  stepController(max);
}

export default function Sph() {
  const stepRef = useRef<ScrollView>(null);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([0, 1, 2, 3, 4]);
  const [sphData, setSphData] = useState<SphStateInterface>({
    selectedCompany: null,
    selectedPic: null,
    isBillingAddressSame: false,
    billingAddress: {
      name: '',
      phone: '',
      addressAutoComplete: {},
      fullAddress: '',
    },
    paymentType: '',
    paymentRequiredDocuments: {},
    paymentDocumentsFullfilled: false,
    paymentBankGuarantee: false,
    chosenProducts: [],
    useHighway: false,
  });
  const stepControll = useCallback((step: number) => {
    console.log(step, 'stepsss');

    // if (step >= 2) {
    //   stepRef.current?.scrollToEnd();
    // }
  }, []);

  useEffect(() => {
    // stepHandler(sphData, stepsDone, setStepsDone, stepControll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphData]);

  const stateUpdate = (key: string) => (e: any) => {
    setSphData((current) => {
      console.log('stateUpdate', e);

      return {
        ...current,
        [key]: e,
      };
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <StepperIndicator
        stepsDone={stepsDone}
        stepOnPress={setCurrentPosition}
        currentStep={currentPosition}
        labels={labels}
        ref={stepRef}
      />
      <SphContext.Provider
        value={
          [sphData, stateUpdate, setCurrentPosition] as SphContextInterface
        }
      >
        <Steps
          currentPosition={currentPosition}
          stepsToRender={stepsToRender}
        />
      </SphContext.Provider>
    </View>
  );
}
