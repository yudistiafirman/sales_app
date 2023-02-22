import React, { useEffect, useState } from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import {
  BBackContinueBtn,
  BButtonPrimary,
  BContainer,
  BHeaderIcon,
  BSpacer,
} from '@/components';
import SecondStep from './elements/second';
import ThirdStep from './elements/third';
import {
  CreateVisitationFirstStep,
  CreateVisitationFourthStep,
  CreateVisitationSecondStep,
  CreateVisitationState,
  CreateVisitationThirdStep,
  PIC,
  Styles,
  visitationListResponse,
} from '@/interfaces';
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
import { useDispatch } from 'react-redux';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { resetRegion, updateRegion } from '@/redux/reducers/locationReducer';
import { layout } from '@/constants';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import crashlytics from '@react-native-firebase/crashlytics';
import { CREATE_VISITATION } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';

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
  const selectedPic = stepTwo.pics.find((pic) => {
    if (pic.isSelected) {
      return pic;
    }
  });
  const customerTypeCond =
    stepTwo.customerType === 'COMPANY' ? !!stepTwo.companyName : true;
  if (
    stepTwo.customerType &&
    customerTypeCond &&
    stepTwo.projectName &&
    selectedPic
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
function populateData(
  existingData: visitationListResponse,
  updateValue: (
    step: keyof CreateVisitationState,
    key:
      | keyof CreateVisitationFirstStep
      | keyof CreateVisitationSecondStep
      | keyof CreateVisitationThirdStep
      | keyof CreateVisitationFourthStep,
    value: any
  ) => void
) {
  customLog(JSON.stringify(existingData), 'difunction');
  const { project } = existingData;
  const { company, PIC: picList, mainPic } = project;
  if (company) {
    updateValue('stepTwo', 'customerType', 'COMPANY');
    // const selectedCompany = {
    //   id: company.id,
    //   title: company.displayName,
    // };
    updateValue('stepTwo', 'companyName', company.displayName);
    // updateValue('stepTwo', 'options', {
    //   loading: false,
    //   items: [selectedCompany],
    // });
  } else {
    updateValue('stepTwo', 'customerType', 'INDIVIDU');
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
    updateValue('stepTwo', 'pics', list);
  }
  updateValue('stepTwo', 'projectId', project.id);

  updateValue('stepTwo', 'projectName', project.name);
  // updateValue('stepTwo', 'companyName');
}
const CreateVisitation = () => {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const { values, action } = React.useContext(createVisitationContext);
  const { shouldScrollView } = values;
  const { updateValue, updateValueOnstep } = action;
  const { keyboardVisible } = useKeyboardActive();
  const [stepsDone, setStepsDone] = useState<number[]>([0, 1, 2, 3]);

  const existingVisitation: visitationListResponse =
    route?.params?.existingVisitation;

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => navigation.goBack()}
        iconName="x"
      />
    ),
  });

  useEffect(() => {
    crashlytics().log(CREATE_VISITATION);

    if (existingVisitation) {
      updateValue('existingVisitationId', existingVisitation.id);
      populateData(existingVisitation, updateValueOnstep);
      const { project } = existingVisitation;
      const { locationAddress } = project;
      updateValueOnstep('stepOne', 'existingLocationId', locationAddress.id);
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
    }

    return () => {
      dispatch(resetImageURLS());
      dispatch(resetRegion());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    if (values.stepTwo.pics.length === 0) {
      state.isSelected = true;
    }
    updateValueOnstep('stepTwo', 'pics', [...values.stepTwo.pics, state]);
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  // const renderHeaderLeft = useCallback(
  //   () => (
  //     <BHeaderIcon
  //       size={layout.pad.xl - layout.pad.md}
  //       iconName="x"
  //       marginRight={layout.pad.lg}
  //       onBack={() => {
  //         if (values.step) {
  //           // setCurrentPosition(currentPosition - 1);
  //           updateValue('step', values.step - 1);
  //         } else {
  //           navigation.goBack();
  //         }
  //       }}
  //     />
  //   ),
  //   [navigation, values.step, updateValue]
  // );
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerBackVisible: false,
  //     headerTitle: () => BHeaderTitle('Buat Kunjungan', 'flex-start'),
  //     headerLeft: () => renderHeaderLeft(),
  //   });
  // }, [navigation, renderHeaderLeft]);

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

      <BContainer>
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
            <View style={styles.conButton}>
              <View style={styles.buttonOne}>
                <BButtonPrimary
                  title="Kembali"
                  isOutline
                  emptyIconEnable
                  onPress={() => navigation.goBack()}
                />
              </View>
              <View style={styles.buttonTwo}>
                <BButtonPrimary
                  disable={!stepsDone.includes(values.step)}
                  title="Lanjut"
                  onPress={next(values.step + 1)}
                  rightIcon={ContinueIcon}
                />
              </View>
            </View>
          )}
        </View>
        <BSheetAddPic
          ref={bottomSheetRef}
          initialIndex={values.sheetIndex}
          addPic={addPic}
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

const CreateVisitationWithProvider = (props: any) => {
  return (
    <CreateVisitationProvider>
      <CreateVisitation {...props} />
    </CreateVisitationProvider>
  );
};

export default CreateVisitationWithProvider;
