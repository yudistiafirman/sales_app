import React, { useEffect, useState } from 'react';
import { View, DeviceEventEmitter, BackHandler } from 'react-native';
import {
  BBackContinueBtn,
  BButtonPrimary,
  BContainer,
  BHeaderIcon,
  BSpacer,
  PopUpQuestion,
} from '@/components';
import SecondStep from './elements/second';
import ThirdStep from './elements/third';
import { PIC, Styles, visitationListResponse } from '@/interfaces';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import BSheetAddPic from './elements/second/BottomSheetAddPic';
import Fourth from './elements/fourth';
import { useKeyboardActive } from '@/hooks';
import FirstStep from './elements/first';
import { BStepperIndicator } from '@/components';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { resetRegion, updateRegion } from '@/redux/reducers/locationReducer';
import { layout } from '@/constants';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import crashlytics from '@react-native-firebase/crashlytics';
import { CREATE_VISITATION } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';
import {
  updateCurrentStep,
  updateExistingVisitationID,
  updateStepOne,
  updateStepTwo,
  VisitationGlobalState,
} from '@/redux/reducers/VisitationReducer';
import { RootState } from '@/redux/store';

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
  state: VisitationGlobalState,
  setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
  const { stepOne, stepTwo, stepThree, stepFour } = state;

  if (
    stepOne?.createdLocation?.formattedAddress &&
    stepOne?.locationAddress?.formattedAddress
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 0];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 0));
  }
  const selectedPic = stepTwo?.pics?.find((pic) => {
    if (pic.isSelected) {
      return pic;
    }
  });
  const customerTypeCond =
    stepTwo?.customerType === 'COMPANY' ? !!stepTwo?.companyName : true;
  if (
    stepTwo?.customerType &&
    customerTypeCond &&
    stepTwo?.projectName &&
    selectedPic
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 1));
  }

  if (
    stepThree?.stageProject &&
    stepThree?.products?.length > 0 &&
    stepThree?.estimationDate?.estimationMonth &&
    stepThree?.estimationDate?.estimationWeek &&
    stepThree?.paymentType
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 2];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 2));
  }

  if (stepFour?.images?.length > 0) {
    setStepsDone((curr) => {
      return [...new Set(curr), 3];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 3));
  }
}

const CreateVisitation = () => {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const visitationData = useSelector((state: RootState) => state.visitation);
  const { keyboardVisible } = useKeyboardActive();
  const [stepsDone, setStepsDone] = useState<number[]>([0, 1, 2, 3]);
  const [isPopupVisible, setPopupVisible] = React.useState(false);

  const existingVisitation: visitationListResponse =
    route?.params?.existingVisitation;

  function populateData(existingData: visitationListResponse) {
    customLog(JSON.stringify(existingData), 'difunction');
    const { project } = existingData;
    const { company, PIC: picList, mainPic } = project;
    let stepTwo;
    stepTwo = {
      ...visitationData,
      projectId: project.id,
      projectName: project.name,
    };
    if (company) {
      stepTwo = {
        ...visitationData,
        customerType: 'COMPANY',
        companyName: company.displayName,
      };
      dispatch(updateStepTwo(stepTwo));
    } else {
      stepTwo = {
        ...visitationData,
        customerType: 'INDIVIDU',
      };
      dispatch(updateStepTwo(stepTwo));
    }
    if (picList) {
      const list = picList.map((pic) => {
        if (mainPic) {
          if (pic.id === mainPic.id) {
            return {
              ...pic,
              isSelected: true,
            };
          }
        }
        return {
          ...pic,
          isSelected: false,
        };
      });
      stepTwo = {
        ...visitationData,
        pics: list,
      };
      dispatch(updateStepTwo(stepTwo));
    }
  }

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => actionBackButton(true)}
        iconName="x"
      />
    ),
  });

  useEffect(() => {
    crashlytics().log(CREATE_VISITATION);

    if (existingVisitation) {
      dispatch(updateExistingVisitationID(existingVisitation?.id));
      populateData(existingVisitation);
      const { project } = existingVisitation;
      const { locationAddress } = project;
      let stepOne;
      stepOne = {
        ...visitationData,
        existingLocationId: locationAddress?.id,
      };
      dispatch(updateStepOne(stepOne));
      if (locationAddress) {
        if (locationAddress?.lon && locationAddress?.lat) {
          const longitude = +locationAddress?.lon;
          const latitude = +locationAddress?.lat;
          dispatch(
            updateRegion({
              formattedAddress: locationAddress?.line1,
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
    }

    return () => {
      dispatch(resetImageURLS({ source: CREATE_VISITATION }));
      dispatch(resetRegion());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (bottomSheetRef?.current) bottomSheetRef?.current?.close();
        actionBackButton();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visitationData?.step])
  );

  useEffect(() => {
    stepHandler(visitationData, setStepsDone);
  }, [visitationData]);

  const next = (nextStep: number) => () => {
    const totalStep = stepRender.length;
    if (nextStep < totalStep && nextStep >= 0) {
      dispatch(updateCurrentStep(nextStep));
    }
  };

  const actionBackButton = (directlyClose: boolean = false) => {
    if (visitationData?.step > 0 && !directlyClose) {
      next(visitationData?.step - 1)();
    } else {
      setPopupVisible(true);
    }
  };

  const addPic = (state: PIC) => {
    if (visitationData?.stepTwo.pics.length === 0) {
      state.isSelected = true;
    }
    let stepTwo;
    stepTwo = {
      ...visitationData,
      pics: [...visitationData?.stepTwo?.pics, state],
    };
    dispatch(updateStepTwo(stepTwo));
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
        currentStep={visitationData?.step}
        labels={labels}
      />

      <BContainer>
        <View style={styles.container}>
          {stepRender[visitationData?.step]}
          <BSpacer size={'extraSmall'} />
          {!keyboardVisible &&
            visitationData?.shouldScrollView &&
            visitationData?.step > 0 && (
              <BBackContinueBtn
                onPressContinue={() => {
                  next(visitationData?.step + 1)();
                  DeviceEventEmitter.emit(
                    'CreateVisitation.continueButton',
                    true
                  );
                }}
                onPressBack={actionBackButton}
                disableContinue={!stepsDone.includes(visitationData?.step)}
              />
            )}
          {visitationData?.step === 0 && (
            <View style={styles.conButton}>
              <View style={styles.buttonOne}>
                <BButtonPrimary
                  title="Kembali"
                  isOutline
                  emptyIconEnable
                  onPress={() => actionBackButton()}
                />
              </View>
              <View style={styles.buttonTwo}>
                <BButtonPrimary
                  disable={!stepsDone.includes(visitationData?.step)}
                  title="Lanjut"
                  onPress={next(visitationData?.step + 1)}
                  rightIcon={ContinueIcon}
                />
              </View>
            </View>
          )}
        </View>
        <BSheetAddPic ref={bottomSheetRef} initialIndex={-1} addPic={addPic} />
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
          text={'Apakah Anda yakin ingin keluar?'}
        />
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
  conButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonOne: {
    flex: 1,
    paddingEnd: layout.pad.md,
  },
  buttonTwo: {
    flex: 1.5,
    paddingStart: layout.pad.md,
  },
};

export default CreateVisitation;
