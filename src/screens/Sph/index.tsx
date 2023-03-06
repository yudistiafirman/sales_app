import { View, ScrollView, StyleSheet, BackHandler } from 'react-native';
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react';
import {
  BHeaderIcon,
  BStepperIndicator as StepperIndicator,
  PopUpQuestion,
} from '@/components';

import Steps from './elements/Steps';
import { SphContext, SphProvider } from './elements/context/SphContext';
import { SphStateInterface, PIC } from '@/interfaces';

import FirstStep from './elements/1firstStep';
import SecondStep from './elements/2secondStep';
import ThirdStep from './elements/3thirdStep';
import FourthStep from './elements/4fourthStep';
import FifthStep from './elements/5fifthStep';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';
import { updateRegion } from '@/redux/reducers/locationReducer';
import { getOneProjectById } from '@/redux/async-thunks/commonThunks';
import { Region } from 'react-native-maps';
import { getLocationCoordinates } from '@/actions/CommonActions';
import crashlytics from '@react-native-firebase/crashlytics';
import { SPH } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { resScale } from '@/utils';
import { RootState } from '@/redux/store';

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

  const list = picList ? picList : [];
  list.forEach((pic) => {
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
  if (sphData.selectedCompany) {
    if (checkSelected(sphData.selectedCompany?.PIC)) {
      if (!stepsDone.includes(0)) {
        setSteps((curr) => {
          return [...new Set(curr), 0];
        });
      }
    }
  } else {
    setSteps((curr) => curr.filter((num) => num !== 0));
  }
  const billingAddressFilled =
    !Object.values(sphData.billingAddress).every((val) => !val) &&
    Object.entries(sphData.billingAddress.addressAutoComplete).length > 1;

  if (
    (sphData.isBillingAddressSame || billingAddressFilled) &&
    sphData.distanceFromLegok !== null
  ) {
    setSteps((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setSteps((curr) => curr.filter((num) => num !== 1));
  }

  const paymentCondition =
    sphData.paymentType === 'CREDIT' ? sphData.paymentBankGuarantee : true;

  if (sphData.paymentType && paymentCondition) {
    setSteps((curr) => {
      return [...new Set(curr), 2];
    });
  } else {
    setSteps((curr) => curr.filter((num) => num !== 2));
  }
  customLog(sphData.chosenProducts.length, 'lengthproduct');

  if (sphData.chosenProducts.length) {
    setSteps((curr) => {
      return [...new Set(curr), 3];
    });
  } else {
    setSteps((curr) => curr.filter((num) => num !== 3));
  }
  const max = Math.max(...stepsDone);
  customLog(stepsDone, 'stepsDone');

  stepController(max);
}

function SphContent() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const stepRef = useRef<ScrollView>(null);
  // const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const [, updateState, setCurrentPosition, currentPosition] =
    useContext(SphContext);
  const stepControll = useCallback((step: number) => {
    customLog(step, 'stepsss');
  }, []);
  const sphData = useSelector((state: RootState) => state.sphState);
  const [isPopupVisible, setPopupVisible] = React.useState(false);

  useEffect(() => {
    crashlytics().log(SPH);

    stepHandler(sphData, stepsDone, setStepsDone, stepControll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphData]);

  const getLocationCoord = async (coordinate: Region) => {
    try {
      customLog(coordinate, 'coordinateonchange51');
      const { data } = await getLocationCoordinates(
        // '',
        coordinate.longitude as unknown as number,
        coordinate.latitude as unknown as number,
        'BP-LEGOK'
      );
      const { result } = data;
      if (!result) {
        throw data;
      }
      customLog(result, 'getLocationCoordinate');

      const _coordinate = {
        latitude: result?.lat,
        longitude: result?.lon,
        formattedAddress: result?.formattedAddress,
        PostalId: result?.PostalId,
      };

      if (typeof result?.lon === 'string') {
        _coordinate.longitude = Number(result.lon);
        _coordinate.lon = Number(result.lon);
      }

      if (typeof result?.lat === 'string') {
        _coordinate.latitude = Number(result.lat);
        _coordinate.lat = Number(result.lat);
      }
      updateState('distanceFromLegok')(result.distance.value);
      dispatch(updateRegion(_coordinate));
    } catch (error) {
      customLog(JSON.stringify(error), 'onChangeRegionerror');
    }
  };

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
      customLog(JSON.stringify(response), 'response138');
      const project = response[0];
      const { locationAddress } = project;
      if (project.mainPic) {
        updateState('selectedPic')(project.mainPic);
      }
      // if ()
      updateState('selectedCompany')(project);
      customLog(locationAddress, 'locationAddress146');

      if (locationAddress) {
        if (locationAddress.lon && locationAddress.lat) {
          const longitude = +locationAddress.lon;
          const latitude = +locationAddress.lat;
          getLocationCoord({ longitude: longitude, latitude: latitude });
        }
      }
    } catch (error) {
      customLog(error, 'errorgetVisitationById');
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

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => {
          if (sphData.selectedCompany) setPopupVisible(true);
          else navigation.goBack();
        }}
        iconName="x"
      />
    ),
  });

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (currentPosition > 0) {
          setCurrentPosition(currentPosition - 1);
        } else {
          if (sphData.selectedCompany) setPopupVisible(true);
          else navigation.goBack();
        }
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
    }, [currentPosition, navigation, setCurrentPosition, sphData])
  );

  useEffect(() => {
    const projectId = route.params?.projectId;
    customLog(projectId, 'visitationId122');
    if (projectId) {
      getProjectById(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <PopUpQuestion
        isVisible={isPopupVisible}
        setIsPopupVisible={() => {
          setPopupVisible(false);
          navigation.goBack();
        }}
        actionButton={() => {
          setPopupVisible(false);
        }}
        cancelText={'Keluar'}
        actionText={'Lanjutkan'}
        desc={'Progres pembuatan SPH Anda sudah tersimpan.'}
        text={'Apakah Anda yakin ingin keluar?'}
      />
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
