import { View, ScrollView, StyleSheet } from 'react-native';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react';
// import StepIndicator from 'react-native-step-indicator';
// import StepperIndicator from '../../components/molecules/StepIndicator';
import { BStepperIndicator as StepperIndicator } from '@/components';

import Steps from './elements/Steps';
import { SphContext, SphProvider } from './elements/context/SphContext';
import { SphStateInterface, PIC } from '@/interfaces';

import FirstStep from './elements/1firstStep';
import SecondStep from './elements/2secondStep';
import ThirdStep from './elements/3thirdStep';
import FourthStep from './elements/4fourthStep';
import FifthStep from './elements/5fifthStep';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';
import { updateRegion } from '@/redux/reducers/locationReducer';
import { getOneProjectById } from '@/redux/async-thunks/commonThunks';

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
function checkSelected(picList: PIC[]) {
  let isSelectedExist = false;
  picList.forEach((pic) => {
    if (pic.isSelected) {
      isSelectedExist = true;
    }
  });
  return isSelectedExist;
}
function stepHandler(
  sphData: SphStateInterface,
  stepsDone: number[],
  setSteps: (e: number[] | ((curr: number[]) => number[])) => void,
  stepController: (step: number) => void
) {
  if (checkSelected(sphData.picList) && sphData.selectedCompany) {
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

function SphContent() {
  const dispatch = useDispatch();
  const route = useRoute();
  const stepRef = useRef<ScrollView>(null);
  // const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const [sphData, updateState, setCurrentPosition, currentPosition] =
    useContext(SphContext);
  const stepControll = useCallback((step: number) => {
    console.log(step, 'stepsss');
  }, []);

  useEffect(() => {
    stepHandler(sphData, stepsDone, setStepsDone, stepControll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphData]);

  async function getProjectById(projectId: string) {
    try {
      dispatch(
        openPopUp({
          popUpType: 'loading',
          popUpText: 'loading fetching data',
          outsideClickClosePopUp: false,
        })
      );
      const response = await dispatch(
        getOneProjectById({ projectId: projectId })
      ).unwrap();
      dispatch(closePopUp());
      console.log(JSON.stringify(response), 'response138');
      const project = response[0];
      const { locationAddress } = project;
      if (project.mainPic) {
        updateState('selectedPic')(project.mainPic);
      }
      updateState('selectedCompany')(project);
      console.log(locationAddress, 'locationAddress146');

      if (locationAddress) {
        if (locationAddress.lon && locationAddress.lat) {
          const longitude = +locationAddress.lon;
          const latitude = +locationAddress.lat;
          dispatch(
            updateRegion({
              formattedAddress: locationAddress.line1,
              latitude: latitude,
              longitude: longitude,
              lat: latitude,
              long: latitude,
              PostalId: undefined,
              line2: locationAddress?.line2,
            })
          );
        }
      }
    } catch (error) {
      console.log(error, 'errorgetVisitationById');
      dispatch(closePopUp());
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: 'Error fetching visitation',
          outsideClickClosePopUp: true,
        })
      );
    }
  }

  useEffect(() => {
    const projectId = route.params?.projectId;
    console.log(projectId, 'visitationId122');
    if (projectId) {
      getProjectById(projectId);
      // (async () => {
      //   await dispatch(
      //     getOneVisitation({ visitationId: visitationId })
      //   ).unwrap();
      // })();
    }
  }, []);

  return (
    <View style={style.container}>
      <StepperIndicator
        stepsDone={stepsDone}
        stepOnPress={setCurrentPosition}
        currentStep={currentPosition}
        labels={labels}
        ref={stepRef}
      />
      <Steps currentPosition={currentPosition} stepsToRender={stepsToRender} />
    </View>
  );
}

export default function Sph() {
  return (
    <SphProvider>
      <SphContent />
    </SphProvider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
