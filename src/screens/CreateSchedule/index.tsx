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
  sphData: CreateScheduleStateInterface,
  stepsDone: number[],
  setSteps: (e: number[] | ((curr: number[]) => number[])) => void,
  stepController: (step: number) => void
) {
  if (sphData.selectedCompany) {
    if (!stepsDone.includes(0)) {
      setSteps((curr) => {
        return [...new Set(curr), 0];
      });
    }
  } else {
    setSteps((curr) => curr.filter((num) => num !== 0));
  }

  if (sphData.selectedSPH) {
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
  const [sphData, setSphData] = React.useState<CreateScheduleStateInterface>({
    selectedCompany: null,
    selectedSPH: null,
  });
  const stepControll = React.useCallback((step: number) => {
    console.log(step, 'stepsss');
  }, []);

  React.useEffect(() => {
    stepHandler(sphData, stepsDone, setStepsDone, stepControll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sphData]);

  const stateUpdate = (key: string) => (e: any) => {
    setSphData((current) => {
      console.log('stateUpdate', e);

      return {
        ...current,
        [key]: e,
      };
    });
  };

  return (
    <View style={styles.parent}>
      <StepperIndicator
        stepsDone={stepsDone}
        stepOnPress={setCurrentPosition}
        currentStep={currentPosition}
        labels={labels}
        ref={stepRef}
      />
      <CreateScheduleContext.Provider
        value={
          [
            sphData,
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
});

export default CreateSchedule;
