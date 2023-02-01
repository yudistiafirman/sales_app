import {
  BButtonPrimary,
  BHeaderIcon,
  BSpacer,
  BStepperIndicator,
} from '@/components';
import { layout } from '@/constants';
import {
  AppointmentActionType,
  AppointmentProvider,
  StepOne,
} from '@/context/AppointmentContext';
import React, { useCallback, useLayoutEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Steps from '../Sph/elements/Steps';
import FirstStep from './element/FirstStep';
import { colors } from '@/constants';
import { resScale } from '@/utils';
import BSheetAddPic from './element/FirstStep/BottomSheetAddPict';
import { useAppointmentData } from '@/hooks';
import { PIC } from '@/interfaces';
import SecondStep from './element/SecondStep';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
const Appointment = () => {
  const navigation = useNavigation();
  const [values, dispatchValue] = useAppointmentData();
  const { searchQuery, stepOne, isModalPicVisible, step, stepDone } = values;
  const customerType =
    stepOne.customerType === 'company' ? 'company' : 'individu';
  const btnShown = searchQuery.length === 0 && stepOne.customerType.length > 0;
  const isFirstPage = step === 0;
  const labels = ['Data Pelanggan', 'Tanggal Kunjungan'];

  const renderHeaderLeft = useCallback(
    () => (
      <BHeaderIcon
        size={layout.pad.xl - layout.pad.md}
        iconName="x"
        marginRight={layout.pad.lg}
        onBack={() => {
          if (!isFirstPage) {
            dispatchValue({ type: AppointmentActionType.DECREASE_STEP });
          }
        }}
      />
    ),
    [dispatchValue, isFirstPage]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
    });
  }, [navigation, renderHeaderLeft, step]);

  const renderBtnIcon = () => (
    <Icon
      name="right"
      style={{ marginTop: layout.pad.sm }}
      color={colors.white}
    />
  );
  const stepsToRender = [<FirstStep />, <SecondStep />];

  const validateCompanyDetailsForm = useCallback(() => {
    const errors: Partial<StepOne> = {};
    if (customerType === 'company') {
      if (!stepOne.company.companyName) {
        errors.errorCompany = 'Nama perusahaan harus diisi';
      } else if (stepOne.company.companyName.length < 4) {
        errors.errorCompany =
          'Nama perusahaan tidak boleh kurang dari 4 karakter';
      }
    }
    if (stepOne[customerType].projectName?.length === 0) {
      errors.errorProject = 'Nama Proyek harus diisi';
    } else if (stepOne[customerType].projectName?.length < 4) {
      errors.errorProject = 'Nama Proyek tidak boleh kurang dari 4 karakter';
    }
    if (stepOne[customerType].pics.length === 0) {
      errors.errorPics = 'Tambahkan minimal 1 PIC';
    }
    return errors;
  }, [customerType, stepOne]);

  const onNext = useCallback(() => {
    // const errors = validateCompanyDetailsForm();

    // if (JSON.stringify(errors) !== '{}') {
    //   Object.keys(errors).forEach((val) => {
    //     dispatchValue({
    //       type: AppointmentActionType.ASSIGN_ERROR,
    //       key: val as keyof StepOne,
    //       value: errors[val as keyof StepOne],
    //     });
    //   });
    // } else {
    //   dispatchValue({
    //     type: AppointmentActionType.INCREASE_STEP,
    //   });
    // }
    dispatchValue({
      type: AppointmentActionType.INCREASE_STEP,
    });
  }, [dispatchValue, validateCompanyDetailsForm]);

  const onBackPress = () => {
    if (!isFirstPage) {
      dispatchValue({
        type: AppointmentActionType.DECREASE_STEP,
      });
    }
  };
  return (
    <View style={style.container}>
      <BStepperIndicator
        stepsDone={stepDone}
        currentStep={step}
        labels={labels}
      />
      <BSpacer size="medium" />
      <Steps currentPosition={step} stepsToRender={stepsToRender} />
      {btnShown && (
        <View style={style.footer}>
          <BButtonPrimary
            onPress={onBackPress}
            buttonStyle={{ width: resScale(132) }}
            isOutline
            title="Kembali"
          />
          <BButtonPrimary
            title="Lanjut"
            onPress={onNext}
            disable={step === 1}
            buttonStyle={{ width: resScale(202) }}
            rightIcon={() => renderBtnIcon()}
          />
        </View>
      )}
      <BSheetAddPic
        isVisible={isModalPicVisible}
        addPic={(dataPic: PIC) =>
          dispatchValue({
            type: AppointmentActionType.SET_PICS,
            key: customerType,
            value: [...values.stepOne[customerType].pics, dataPic],
          })
        }
        onClose={() =>
          dispatchValue({ type: AppointmentActionType.TOGGLE_MODAL_PICS })
        }
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: layout.pad.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: (height - width) * 2 - layout.pad.xl,
  },
});

const AppointmentWithProvider = () => {
  return (
    <AppointmentProvider>
      <Appointment />
    </AppointmentProvider>
  );
};

export default AppointmentWithProvider;
