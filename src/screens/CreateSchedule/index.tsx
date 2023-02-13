import * as React from 'react';
import { View, DeviceEventEmitter } from 'react-native';
import {
  BBackContinueBtn,
  BButtonPrimary,
  BContainer,
  BHeaderIcon,
  BSpacer,
} from '@/components';
import { Styles } from '@/interfaces';
import { useKeyboardActive } from '@/hooks';
import { BStepperIndicator } from '@/components';
import Entypo from 'react-native-vector-icons/Entypo';
import { resScale } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { layout } from '@/constants';
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

const labels = ['Cari PO', 'Detil Pengiriman'];

function ContinueIcon() {
  return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

function stepHandler(
  state: CreateScheduleState,
  setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
  const { stepOne, stepTwo } = state;

  if (stepOne.products) {
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
  console.log(JSON.stringify(existingData), 'difunction');
  updateValue('stepOne', 'companyName', existingData.companyName);
  updateValue('stepOne', 'locationName', existingData.locationName);
  updateValue(
    'stepOne',
    'title',
    existingData.sphs && existingData.sphs.length > 0
      ? existingData.sphs[0]
      : '-'
  );
  updateValue('stepOne', 'products', existingData.products);
  updateValue('stepOne', 'addedDeposit', existingData.addedDeposit);
  updateValue('stepOne', 'lastDeposit', existingData.lastDeposit);

  updateValue('stepTwo', 'deliveryDate', existingData.deliveryDate);
  updateValue('stepTwo', 'deliveryTime', existingData.deliveryTime);
  updateValue('stepTwo', 'method', existingData.method);
  updateValue('stepTwo', 'isConsecutive', existingData.isConsecutive);
  updateValue(
    'stepTwo',
    'hasTechnicalRequest',
    existingData.hasTechnicalRequest
  );
  updateValue('stepTwo', 'products', existingData.products);
  updateValue(
    'stepTwo',
    'totalDeposit',
    existingData.lastDeposit +
      existingData.addedDeposit
        .map((item) => item.nominal)
        .reduce((prev, next) => prev + next)
  );
}

const CreateSchedule = () => {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
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

  const existingSchedule: CreateScheduleListResponse =
    route?.params?.existingSchedule;

  React.useEffect(() => {
    if (existingSchedule) {
      updateValue('existingScheduleID', existingSchedule.id);
      populateData(existingSchedule, updateValueOnstep);
    }
    stepHandler(values, setStepsDone);
  }, [existingSchedule, updateValue, updateValueOnstep, values]);

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
          {!keyboardVisible && shouldScrollView && values.step > 0 && (
            <BBackContinueBtn
              onPressContinue={() => {
                next(values.step + 1)();
                DeviceEventEmitter.emit('CreateSchedule.continueButton', true);
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

const CreateScheduleWithProvider = (props: any) => {
  return (
    <CreateScheduleProvider>
      <CreateSchedule {...props} />
    </CreateScheduleProvider>
  );
};

export default CreateScheduleWithProvider;
