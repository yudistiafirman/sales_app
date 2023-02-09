import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BHeaderIcon } from '@/components';
import { resScale } from '@/utils';
import {
  CreateScheduleContextInterface,
  CreateScheduleStateInterface,
} from '@/interfaces';
import StepperIndicator from '@/components/molecules/StepperIndicator';
import { ScrollView } from 'react-native-gesture-handler';
import { CreateScheduleContext } from './element/context/CreateScheduleContext';
import Steps from './element/Steps';
import FirstStep from './element/FirstStep';
import SecondStep from './element/SecondStep';

const labels = ['Cari PO', 'Detil Pengiriman'];
const stepsToRender = [<FirstStep />, <SecondStep />];

function stepHandler(
  createScheduleData: CreateScheduleStateInterface,
  stepsDone: number[],
  setSteps: (e: number[] | ((curr: number[]) => number[])) => void,
  stepController: (step: number) => void
) {
  if (createScheduleData.selectedCompany && createScheduleData.selectedSPH) {
    if (!stepsDone.includes(0)) {
      setSteps((curr) => {
        return [...new Set(curr), 0];
      });
    }
  } else {
    setSteps((curr) => curr.filter((num) => num !== 0));
  }

  if (
    createScheduleData.deliveryDetail &&
    createScheduleData.deliveryDetail.date &&
    createScheduleData.deliveryDetail.time &&
    createScheduleData.deliveryDetail.method
  ) {
    setSteps((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setSteps((curr) => curr.filter((num) => num !== 1));
  }

  const max = Math.max(...stepsDone);
  console.log(stepsDone, 'stepsDone');

  stepController(max);
}

const CreateSchedule = () => {
  const navigation = useNavigation();

  const renderHeaderLeft = React.useCallback(() => {
    return (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => navigation.goBack()}
        iconName="x"
      />
    );
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
    });
  }, [navigation, renderHeaderLeft]);

  const stepRef = React.useRef<ScrollView>(null);
  const [currentPosition, setCurrentPosition] = React.useState<number>(0);
  const [stepsDone, setStepsDone] = React.useState<number[]>([]);
  const [createScheduleData, setCreateScheduleData] =
    React.useState<CreateScheduleStateInterface>({
      selectedCompany: null,
      selectedSPH: null,
      deliveryDetail: null,
      lastDeposit: null,
      newDeposit: null,
    });
  const stepControl = React.useCallback((step: number) => {
    console.log(step, 'stepsss');
  }, []);

  React.useEffect(() => {
    stepHandler(createScheduleData, stepsDone, setStepsDone, stepControl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createScheduleData]);

  const stateUpdate = (key: string) => (e: any) => {
    setCreateScheduleData((current) => {
      console.log('stateUpdate', e);

      return {
        ...current,
        [key]: e,
      };
    });
  };

  return (
    <View style={styles.parent}>
      <View style={styles.stepper}>
        <StepperIndicator
          stepsDone={stepsDone}
          stepOnPress={setCurrentPosition}
          currentStep={currentPosition}
          labels={labels}
          ref={stepRef}
        />
      </View>
      <CreateScheduleContext.Provider
        value={
          [
            createScheduleData,
            stateUpdate,
            setCurrentPosition,
          ] as CreateScheduleContextInterface
        }
      >
        <Steps
          currentPosition={currentPosition}
          stepsToRender={stepsToRender}
        />
      </CreateScheduleContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  stepper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateSchedule;
