import {
  BBackContinueBtn,
  BButtonPrimary,
  BHeaderIcon,
  BottomSheetAddPIC,
  BSpacer,
  BStepperIndicator,
} from '@/components';
import { layout } from '@/constants';
import {
  AppointmentActionType,
  AppointmentProvider,
  StepOne,
} from '@/context/AppointmentContext';
import React, { useCallback } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Steps from '../Sph/elements/Steps';
import FirstStep from './element/FirstStep';
import { colors } from '@/constants';
import { resScale } from '@/utils';
import { useAppointmentData } from '@/hooks';
import {
  locationPayloadType,
  PIC,
  picPayloadType,
  projectPayloadType,
  visitationPayload,
} from '@/interfaces';
import SecondStep from './element/SecondStep';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { postBookingAppointment } from '@/actions/ProductivityActions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';
import crashlytics from '@react-native-firebase/crashlytics';
import { APPOINTMENT } from '@/navigation/ScreenNames';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';

const { width } = Dimensions.get('window');
const Appointment = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [values, dispatchValue] = useAppointmentData();
  const {
    searchQuery,
    stepOne,
    isModalPicVisible,
    step,
    stepDone,
    selectedDate,
  } = values;
  const customerType =
    stepOne.customerType === 'company' ? 'company' : 'individu';
  const btnShown = searchQuery.length === 0 && stepOne.customerType.length > 0;
  const labels = ['Data Pelanggan', 'Tanggal Kunjungan'];
  const inCustomerDataStep = step === 0;
  const inVisitationDateStep = step === 1;
  const stepsToRender = [<FirstStep />, <SecondStep />];

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => navigation.goBack()}
        iconName="x"
      />
    ),
  });

  // const renderHeaderLeft = useCallback(
  //   () => (
  //     <BHeaderIcon
  //       size={layout.pad.xl - layout.pad.md}
  //       iconName="x"
  //       marginRight={layout.pad.lg}
  //       onBack={() => {
  //         if (inVisitationDateStep) {
  //           if (selectedDate) {
  //             dispatchValue({
  //               type: AppointmentActionType.SET_DATE,
  //               value: null,
  //             });
  //           }
  //           dispatchValue({
  //             type: AppointmentActionType.DECREASE_STEP,
  //           });
  //         } else {
  //           navigation.goBack();
  //         }
  //       }}
  //     />
  //   ),
  //   [dispatchValue, inVisitationDateStep, navigation, selectedDate]
  // );

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerBackVisible: false,
  //     headerTitle: () => BHeaderTitle('Buat Janji Temu', 'flex-start'),
  //     headerLeft: () => renderHeaderLeft(),
  //   });
  // }, [navigation, renderHeaderLeft, step]);

  React.useEffect(() => {
    crashlytics().log(APPOINTMENT);
  }, []);

  const renderBtnIcon = () => (
    <Icon
      name="right"
      style={{ marginTop: layout.pad.sm }}
      color={colors.white}
      size={resScale(24)}
    />
  );

  const validateCompanyDetailsForm = useCallback(() => {
    const errors: Partial<StepOne> = {};
    if (stepOne.customerType === 'company') {
      if (!stepOne.company.Company?.title) {
        errors.errorCompany = 'Nama perusahaan harus diisi';
      }
    }

    if (stepOne[customerType].name?.length === 0) {
      errors.errorProject = 'Nama Proyek harus diisi';
    } else if (stepOne[customerType].name?.length < 4) {
      errors.errorProject = 'Nama Proyek tidak boleh kurang dari 4 karakter';
    }
    if (stepOne[customerType].PIC.length === 0) {
      errors.errorPics = 'Tambahkan minimal 1 PIC';
    } else if (stepOne[customerType].PIC.length > 1) {
      const selectedPic = stepOne[customerType].PIC.filter((v) => v.isSelected);
      if (selectedPic.length === 0) {
        errors.errorPics = 'Pilih salah satu PIC';
      }
    }
    return errors;
  }, [customerType, stepOne]);

  const goToVisitationDateStep = useCallback(() => {
    const errors = validateCompanyDetailsForm();
    if (JSON.stringify(errors) !== '{}') {
      Object.keys(errors).forEach((val) => {
        dispatchValue({
          type: AppointmentActionType.ASSIGN_ERROR,
          key: val as keyof StepOne,
          value: errors[val as keyof StepOne],
        });
      });
    } else {
      dispatchValue({
        type: AppointmentActionType.INCREASE_STEP,
      });
    }
  }, [dispatchValue, validateCompanyDetailsForm]);

  const submitAppoinmentData = useCallback(async () => {
    const today = moment();
    const payload = {
      visitation: {
        location: {} as locationPayloadType,
      } as visitationPayload,
      project: {
        location: {} as locationPayloadType,
      } as projectPayloadType,
      pic: [] as picPayloadType[],
    };
    if (stepOne[customerType].PIC.length === 1) {
      const pic = [];
      pic.push({ ...stepOne[customerType].PIC[0], isSelected: true });
      payload.pic = pic;
    } else {
      const selectedPic = stepOne[customerType].PIC.filter((v) => v.isSelected);
      payload.pic = selectedPic;
    }
    const typeCustomer = customerType === 'individu' ? 'INDIVIDU' : 'COMPANY';
    payload.visitation.order = stepOne[customerType].Visitation.finish_date
      ? stepOne[customerType].Visitation.order
      : stepOne[customerType].Visitation.order - 1;
    payload.visitation.status = 'VISIT';
    if (stepOne[customerType].locationAddress.line1) {
      payload.project.location.line1 =
        stepOne[customerType].locationAddress.line1;
    }
    if (stepOne[customerType].locationAddress.line2) {
      payload.project.location.line2 =
        stepOne[customerType].locationAddress.line2;
    }
    if (stepOne[customerType].locationAddress.postalCode) {
      payload.project.location.postalId =
        stepOne[customerType].locationAddress.postalCode;
    }
    if (stepOne[customerType].locationAddress.formattedAddress) {
      payload.project.location.formattedAddress =
        stepOne[customerType].locationAddress.formattedAddress;
    }
    if (stepOne[customerType].locationAddress.lon) {
      payload.project.location.lon = stepOne[customerType].locationAddress.lon;
    }
    if (stepOne[customerType].locationAddress.lat) {
      payload.project.location.lat = stepOne[customerType].locationAddress.lat;
    }
    if (stepOne.customerType) {
      payload.visitation.customerType = typeCustomer;
    }
    if (values.selectedDate) {
      const selectDate = moment(values.selectedDate.date);
      payload.visitation.bookingDate = selectDate.valueOf();
    }
    payload.visitation.dateVisit = today.valueOf();
    if (stepOne[customerType].name) {
      payload.project.name = stepOne[customerType].name;
    }
    if (stepOne.customerType === 'company') {
      if (stepOne[customerType].Company?.title) {
        payload.project.companyDisplayName =
          stepOne[customerType].Company?.title;
      }
    }
    if (stepOne[customerType].Visitation.id) {
      payload.visitation.visitationId = stepOne[customerType].Visitation.id;
    }
    if (stepOne[customerType].id) {
      payload.project.id = stepOne[customerType].id;
    }

    payload.visitation.isBooking = true;
    try {
      const response = await postBookingAppointment({ payload });
      if (response.data.success) {
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpTitle: 'Apakah Anda Ingin Membuat Janji Temu Lagi?',
            popUpText: 'Janji Temu Berhasil Dibuat',
            outlineBtnTitle: 'Tidak',
            outsideClickClosePopUp: false,
            outlineBtnAction: () => {
              navigation.goBack();
              dispatch(closePopUp());
            },
            primaryBtnAction: () => {
              dispatchValue({ type: AppointmentActionType.RESET_STATE });
              dispatch(closePopUp());
            },
            primaryBtnTitle: 'Buat Janji',
            isRenderActions: true,
          })
        );
      } else {
        dispatch(
          openPopUp({
            popUpType: 'error',
            popUpText: 'Something went wrong',
            highlightedText: 'error',
            outsideClickClosePopUp: true,
          })
        );
      }
    } catch (error) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: error.message,
          highlightedText: 'error',
          outsideClickClosePopUp: true,
        })
      );
    }
  }, [
    customerType,
    dispatch,
    dispatchValue,
    navigation,
    stepOne,
    values.selectedDate,
  ]);

  const onNext = useCallback(() => {
    if (inCustomerDataStep) {
      goToVisitationDateStep();
    } else {
      submitAppoinmentData();
    }
  }, [goToVisitationDateStep, inCustomerDataStep, submitAppoinmentData]);

  const onBackPress = useCallback(() => {
    if (inVisitationDateStep) {
      if (selectedDate) {
        dispatchValue({
          type: AppointmentActionType.SET_DATE,
          value: null,
        });
      }
      dispatchValue({
        type: AppointmentActionType.DECREASE_STEP,
      });
    } else {
      navigation.goBack();
    }
  }, [dispatchValue, inVisitationDateStep, navigation, selectedDate]);

  function isCanAdvanceToStep2() {
    const customerTypeCondition = stepOne.customerType;
    const companyNameCondition = stepOne.company.Company;
    const projectNameConditionIndividu = stepOne.individu.name;
    const projectNameConditionCompany = stepOne.company.name;
    const picIndividu = stepOne.individu.PIC ? stepOne.individu.PIC : [];
    const picCompany = stepOne.company.PIC ? stepOne.company.PIC : [];

    if (customerTypeCondition === 'company') {
      return (
        !!companyNameCondition &&
        !!projectNameConditionCompany &&
        picCompany.length > 0
      );
    }
    if (customerTypeCondition === 'individu') {
      return !!projectNameConditionIndividu && picIndividu.length > 0;
    }
  }

  return (
    <View style={style.container}>
      <BStepperIndicator
        stepsDone={stepDone}
        currentStep={step}
        labels={labels}
      />
      <BSpacer size="small" />
      <View style={style.content}>
        <Steps currentPosition={step} stepsToRender={stepsToRender} />

        {btnShown && (
          <>
            {step === 0 ? (
              <View style={{ width: '100%' }}>
                <BButtonPrimary
                  title="Lanjut"
                  onPress={onNext}
                  disable={!isCanAdvanceToStep2() && !selectedDate}
                  // buttonStyle={{ width: resScale(202) }}
                  rightIcon={() => renderBtnIcon()}
                />
              </View>
            ) : (
              <BBackContinueBtn
                backText="Kembali"
                continueText="Lanjut"
                onPressBack={onBackPress}
                onPressContinue={onNext}
                disableContinue={!selectedDate}
              />
            )}
          </>
        )}
      </View>
      <BottomSheetAddPIC
        isVisible={isModalPicVisible}
        addPic={(dataPic: PIC) =>
          dispatchValue({
            type: AppointmentActionType.SET_PICS,
            key: customerType,
            value: [...values.stepOne[customerType].PIC, dataPic],
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
    paddingBottom: layout.pad.lg,
    paddingStart: layout.pad.lg,
    paddingEnd: layout.pad.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: width + width - resScale(100),
  },
  content: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
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
