import * as React from 'react';
import { View, DeviceEventEmitter, BackHandler } from 'react-native';
import {
  BBackContinueBtn,
  BContainer,
  BHeaderIcon,
  BSpacer,
  PopUpQuestion,
} from '@/components';
import { Styles } from '@/interfaces';
import { useKeyboardActive } from '@/hooks';
import { BStepperIndicator } from '@/components';
import { resScale } from '@/utils';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import {
  CreateScheduleFirstStep,
  CreateScheduleListResponse,
  CreateScheduleSecondStep,
  CreateScheduleState,
} from '@/interfaces/CreateSchedule';
import {
  CreateScheduleContext,
  CreateScheduleProvider,
} from '@/context/CreateScheduleContext';
import SecondStep from './element/SecondStep';
import FirstStep from './element/FirstStep';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { useDispatch } from 'react-redux';
import { CREATE_SCHEDULE } from '@/navigation/ScreenNames';
import { CreateSchedule } from '@/models/CreateSchedule';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { postOrderSchedule } from '@/redux/async-thunks/orderThunks';
import moment from 'moment';

const labels = ['Cari PO', 'Detil Pengiriman'];

function stepHandler(
  state: CreateScheduleState,
  setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
  const { stepOne, stepTwo } = state;

  if (stepOne.sphs && stepOne.sphs.length > 0) {
    setStepsDone((curr) => {
      return [...new Set(curr), 0];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 0));
  }
  if (stepTwo.deliveryDate && stepTwo.deliveryTime && stepTwo.method) {
    setStepsDone((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 1));
  }
}

function populateData(
  existingData: CreateScheduleListResponse,
  updateValue: (
    step: keyof CreateScheduleState,
    key: keyof CreateScheduleFirstStep | keyof CreateScheduleSecondStep,
    value: any
  ) => void
) {
  updateValue('stepOne', 'companyName', existingData?.companyName);
  updateValue('stepOne', 'locationName', existingData?.locationName);
  updateValue('stepOne', 'sphs', existingData?.sphs);
  updateValue('stepOne', 'addedDeposit', existingData?.addedDeposit);
  updateValue('stepOne', 'lastDeposit', existingData?.lastDeposit);

  updateValue('stepTwo', 'deliveryDate', existingData?.deliveryDate);
  updateValue('stepTwo', 'deliveryTime', existingData?.deliveryTime);
  updateValue('stepTwo', 'method', existingData?.method);
  updateValue('stepTwo', 'isConsecutive', existingData?.isConsecutive);
  updateValue(
    'stepTwo',
    'hasTechnicalRequest',
    existingData.hasTechnicalRequest
  );
  let allProducts: any[] = [];
  existingData?.sphs?.forEach((sp) => {
    if (sp?.products) allProducts.push(...sp.products);
  });
  updateValue('stepTwo', 'products', allProducts);
  let lastDeposit = 0;
  let addedDeposit = 0;
  if (existingData?.lastDeposit?.nominal)
    lastDeposit = existingData?.lastDeposit?.nominal;
  if (existingData?.addedDeposit && existingData?.addedDeposit.length > 0)
    addedDeposit = existingData?.addedDeposit
      ?.map((item) => item.nominal)
      .reduce((prev, next) => prev + next);
  updateValue('stepTwo', 'totalDeposit', lastDeposit + addedDeposit);
}

const CreateScheduleScreen = () => {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
  const { shouldScrollView } = values;
  const { stepOne: stateOne } = values;
  const { updateValue, updateValueOnstep } = action;
  const { keyboardVisible } = useKeyboardActive();
  const [stepsDone, setStepsDone] = React.useState<number[]>([0, 1]);
  const [isPopupVisible, setPopupVisible] = React.useState(false);
  const dispatch = useDispatch();

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => actionBackButton(true)}
        iconName="x"
      />
    ),
  });

  const existingSchedule: CreateScheduleListResponse =
    route?.params?.existingSchedule;

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        actionBackButton(false);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.step, stateOne.companyName])
  );

  React.useEffect(() => {
    if (existingSchedule) {
      updateValue('existingScheduleID', existingSchedule.id);
      populateData(existingSchedule, updateValueOnstep);
    }
    return () => {
      dispatch(resetImageURLS({ source: CREATE_SCHEDULE }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    stepHandler(values, setStepsDone);
  }, [values]);

  const next = (nextStep: number) => async () => {
    const totalStep = stepRender.length;
    if (nextStep < totalStep && nextStep >= 0) {
      updateValue('step', nextStep);
    } else {
      try {
        let payload: CreateSchedule = {
          saleOrderId: '',
          projectId: '',
          purchaseOrderId: '',
          quotationLetterId: '',
          quantity: values.stepTwo.inputtedVolume, // volume inputted
          date: moment(
            values.stepTwo.deliveryDate + ' ' + values.stepTwo.deliveryTime,
            'DD/MM/yyyy HH:mm'
          ).valueOf(), // date + time
          withPump: values.stepTwo?.method === 'pompa' ? true : false,
          consecutive: values.stepTwo?.isConsecutive,
          withTechnician: values.stepTwo?.hasTechnicalRequest,
          status: 'SUBMITTED',
        };
        await dispatch(postOrderSchedule({ payload })).unwrap();
        navigation.dispatch(StackActions.popToTop());
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpText: 'Successfully create schedule',
            highlightedText: 'schedule',
            outsideClickClosePopUp: true,
          })
        );
      } catch (error) {
        const message = error.message || 'Error creating schedule';
        dispatch(
          openPopUp({
            popUpType: 'error',
            popUpText: message,
            highlightedText: 'error',
            outsideClickClosePopUp: true,
          })
        );
      }
    }
  };

  const actionBackButton = (directlyClose: boolean = false) => {
    if (values.step > 0 && !directlyClose) {
      next(values.step - 1)();
    } else {
      if (stateOne.companyName) setPopupVisible(true);
      else navigation.goBack();
    }
  };

  const stepRender = [<FirstStep />, <SecondStep />];

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
          {!keyboardVisible && shouldScrollView && values.step > -1 && (
            <BBackContinueBtn
              onPressContinue={() => {
                next(values.step + 1)();
                DeviceEventEmitter.emit('CreateSchedule.continueButton', true);
              }}
              onPressBack={() => actionBackButton(false)}
              continueText={values.step > 0 ? 'Buat Jadwal' : 'Lanjut'}
              unrenderBack={values.step > 0 ? false : true}
              disableContinue={!stepsDone.includes(values.step)}
            />
          )}
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
            desc={'Progres pembuatan Jadwal anda akan hilang'}
          />
        </View>
      </BContainer>
    </>
  );
};

const styles: Styles = {
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
};

const CreateScheduleWithProvider = (props: any) => {
  return (
    <CreateScheduleProvider>
      <CreateScheduleScreen {...props} />
    </CreateScheduleProvider>
  );
};

export default CreateScheduleWithProvider;
