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
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import {
  CreateDepositFirstStep,
  CreateDepositListResponse,
  CreateDepositSecondStep,
  CreateDepositState,
} from '@/interfaces/CreateDeposit';
import {
  CreateDepositContext,
  CreateDepositProvider,
} from '@/context/CreateDepositContext';
import FirstStep from './element/FirstStep';
import SecondStep from './element/SecondStep';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { useDispatch } from 'react-redux';

const labels = ['Data Pelanggan', 'Cari PO'];

function stepHandler(
  state: CreateDepositState,
  setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
  const { stepOne, stepTwo } = state;

  if (
    stepOne.deposit?.picts &&
    stepOne.deposit?.picts.length > 0 &&
    stepOne.deposit?.createdAt &&
    stepOne.deposit?.nominal
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 0];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 0));
  }
  if (stepTwo.companyName && stepTwo.sphs) {
    setStepsDone((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 1));
  }
}

function populateData(
  existingData: CreateDepositListResponse,
  updateValue: (
    step: keyof CreateDepositState,
    key: keyof CreateDepositFirstStep | keyof CreateDepositSecondStep,
    value: any
  ) => void
) {
  updateValue('stepTwo', 'companyName', existingData?.companyName);
  updateValue('stepTwo', 'locationName', existingData?.locationName);
  updateValue('stepTwo', 'sphs', existingData?.sphs);
}

const Deposit = () => {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { values, action } = React.useContext(CreateDepositContext);
  const { shouldScrollView } = values;
  const { updateValue, updateValueOnstep } = action;
  const { keyboardVisible } = useKeyboardActive();
  const [stepsDone, setStepsDone] = React.useState<number[]>([0, 1]);
  const [isPopupVisible, setPopupVisible] = React.useState(false);

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => setPopupVisible(true)}
        iconName="x"
      />
    ),
  });

  const existingSchedule: CreateDepositListResponse =
    route?.params?.existingSchedule;

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (values.step > 0) {
          next(values.step - 1)();
        } else {
          setPopupVisible(true);
        }
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.step])
  );

  React.useEffect(() => {
    if (existingSchedule) {
      updateValue('existingDepositID', existingSchedule.id);
      populateData(existingSchedule, updateValueOnstep);
    }
    return () => {
      dispatch(resetImageURLS());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    stepHandler(values, setStepsDone);
  }, [values]);

  const next = (nextStep: number) => () => {
    const totalStep = stepRender.length;
    if (nextStep < totalStep && nextStep >= 0) {
      updateValue('step', nextStep);
    } else {
      navigation.dispatch(StackActions.popToTop());
    }
  };

  const handleBackButton = () => {
    if (values.step > 0) {
      next(values.step - 1)();
    } else {
      setPopupVisible(true);
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
                DeviceEventEmitter.emit('Deposit.continueButton', true);
              }}
              onPressBack={handleBackButton}
              continueText={values.step > 0 ? 'Buat Deposit' : 'Lanjut'}
              disableContinue={!stepsDone.includes(values.step)}
            />
          )}
        </View>
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
          desc={'Progres pembuatan Deposit anda akan hilang'}
        />
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

const DepositWithProvider = (props: any) => {
  return (
    <CreateDepositProvider>
      <Deposit {...props} />
    </CreateDepositProvider>
  );
};

export default DepositWithProvider;
