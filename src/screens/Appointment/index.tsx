import { BButtonPrimary, BSpacer, BStepperIndicator } from '@/components';
import { layout } from '@/constants';
import {
  AppointmentActionType,
  AppointmentProvider,
  StepOne,
} from '@/context/AppointmentContext';
import React, { useCallback, useState } from 'react';
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
const { width, height } = Dimensions.get('window');
const Appointment = () => {
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [stepsDone, setStepsDone] = useState<number[]>([0]);
  const [values, dispatchValue] = useAppointmentData();
  const { searchQuery, stepOne, isModalPicVisible } = values;
  const customerType =
    stepOne.customerType === 'company' ? 'company' : 'individu';

  const labels = ['Data Pelanggan', 'Tanggal Kunjungan'];

  const renderBtnIcon = () => <Icon name="right" color={colors.white} />;
  const stepsToRender = [<FirstStep />, <SecondStep />];
  const btnShown = searchQuery.length === 0 && stepOne.customerType.length > 0;

  const onNext = useCallback(() => {
    const errors: Partial<StepOne> = {};
    if (customerType === 'company') {
      if (!stepOne.company.companyName) {
        errors.errorCompany = 'Nama perusahaan harus diisi';
      } else if (stepOne.company.companyName.length < 6) {
        errors.errorCompany =
          'Nama perusahaan tidak boleh kurang dari 6 karakter';
      }
    }
    if (stepOne[customerType].projectName?.length === 0) {
      errors.errorProject = 'Nama Proyek harus diisi';
    } else if (stepOne[customerType].projectName?.length < 6) {
      errors.errorProject = 'Nama Proyek tidak boleh kurang dari 6 karakter';
    }
    if (stepOne[customerType].pics.length === 0) {
      errors.errorPics = 'Tambahkan minimal 1 PIC';
    }

    if (JSON.stringify(errors) !== '{}') {
      Object.keys(errors).forEach((val) => {
        dispatchValue({
          type: AppointmentActionType.ASSIGN_ERROR,
          key: val as keyof StepOne,
          value: errors[val as keyof StepOne],
        });
      });
    }
  }, [customerType, dispatchValue, stepOne]);
  return (
    <View style={style.container}>
      <BStepperIndicator
        stepsDone={stepsDone}
        stepOnPress={setCurrentPosition}
        currentStep={currentPosition}
        labels={labels}
      />
      <BSpacer size="medium" />
      <Steps currentPosition={currentPosition} stepsToRender={stepsToRender} />
      {btnShown && (
        <View style={style.footer}>
          <BButtonPrimary
            buttonStyle={{ width: resScale(132) }}
            isOutline
            title="Kembali"
          />
          <BButtonPrimary
            title="Lanjut"
            onPress={onNext}
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
