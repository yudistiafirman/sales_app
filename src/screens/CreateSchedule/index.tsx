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
  updateValue(
    'stepTwo',
    'totalDeposit',
    existingData?.lastDeposit?.nominal +
      existingData?.addedDeposit
        ?.map((item) => item.nominal)
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
  const [isPopupVisible, setPopupVisible] = React.useState(false);
  const dispatch = useDispatch();

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => setPopupVisible(true)}
        iconName="x"
      />
    ),
  });

  const existingSchedule: CreateScheduleListResponse =
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
      updateValue('existingScheduleID', existingSchedule.id);
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
                DeviceEventEmitter.emit('CreateSchedule.continueButton', true);
              }}
              onPressBack={handleBackButton}
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
      <CreateSchedule {...props} />
    </CreateScheduleProvider>
  );
};

export default CreateScheduleWithProvider;
