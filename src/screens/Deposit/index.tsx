import * as React from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import {
  BBackContinueBtn,
  BContainer,
  BHeaderIcon,
  BSpacer,
} from '@/components';
import { Styles } from '@/interfaces';
import { useKeyboardActive } from '@/hooks';
import { BStepperIndicator } from '@/components';
import { resScale } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { layout } from '@/constants';
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

  if (stepOne.deposit?.createdAt && stepOne.deposit?.nominal) {
    setStepsDone((curr) => {
      return [...new Set(curr), 0];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 0));
  }
  if (stepTwo.companyName && stepTwo.title && stepTwo.product) {
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
  updateValue('stepOne', 'title', existingData?.sph);
  updateValue('stepTwo', 'companyName', existingData?.companyName);
  updateValue('stepTwo', 'locationName', existingData?.locationName);
  updateValue('stepTwo', 'title', existingData?.sph);
  updateValue('stepTwo', 'product', existingData?.product);
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

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => navigation.goBack()}
        iconName="x"
      />
    ),
  });

  const existingSchedule: CreateDepositListResponse =
    route?.params?.existingSchedule;

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
              isContinueIcon={true}
              onPressBack={() =>
                values.step > 0 ? next(values.step - 1) : navigation.goBack()
              }
              continueText={values.step > 0 ? 'Buat Deposit' : 'Lanjut'}
              disableContinue={!stepsDone.includes(values.step)}
            />
          )}
        </View>
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

const DepositWithProvider = (props: any) => {
  return (
    <CreateDepositProvider>
      <Deposit {...props} />
    </CreateDepositProvider>
  );
};

export default DepositWithProvider;
