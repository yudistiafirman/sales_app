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
} from '@react-navigation/native';
import {
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
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';

const labels = ['Cari PT / Proyek', 'Detil Pengiriman'];

function stepHandler(
  state: CreateScheduleState,
  setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
  const { stepOne, stepTwo } = state;

  if (stepOne?.purchaseOrders && stepOne?.purchaseOrders.length > 0) {
    setStepsDone((curr) => {
      return [...new Set(curr), 0];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 0));
  }
  if (
    stepTwo?.deliveryDate &&
    stepTwo?.deliveryTime &&
    stepTwo?.method &&
    stepTwo?.inputtedVolume &&
    stepTwo?.salesOrder &&
    getTotalProduct(stepTwo) <= stepTwo?.totalDeposit
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 1));
  }
}

const getTotalProduct = (stepTwo: CreateScheduleSecondStep): number => {
  let total =
    stepTwo?.inputtedVolume *
    stepTwo?.salesOrder?.PoProduct?.RequestedProduct?.offeringPrice;
  return total;
};

const CreateScheduleScreen = () => {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateScheduleContext);
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

  useHeaderTitleChanged({
    title: values.isSearchingPurchaseOrder === true ? 'Cari PT / Proyek' : 'Buat Jadwal',
  });

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
    }, [
      values.step,
      values.stepOne?.companyName,
      values.isSearchingPurchaseOrder,
    ])
  );

  React.useEffect(() => {
    return () => {
      dispatch(resetImageURLS({ source: CREATE_SCHEDULE }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    stepHandler(values, setStepsDone);

    if (!values.stepTwo?.deliveryTime) {
      action.updateValueOnstep(
        'stepTwo',
        'deliveryTime',
        moment(new Date()).format('HH:mm')
      );
    }
  }, [values]);

  const next = (nextStep: number) => async () => {
    const totalStep = stepRender.length;
    if (nextStep < totalStep && nextStep >= 0) {
      action.updateValue('step', nextStep);
    } else {
      try {
        dispatch(
          openPopUp({
            popUpType: 'loading',
            popUpText: 'Membuat Jadwal',
            highlightedText: 'schedule',
            outsideClickClosePopUp: false,
          })
        );
        let payload: CreateSchedule = {
          saleOrderId: values.stepTwo?.salesOrder?.id,
          projectId: values.existingProjectID,
          purchaseOrderId: values.stepOne?.purchaseOrders[0].id,
          quotationLetterId:
            values.stepOne?.purchaseOrders[0].quotationLetterId,
          quantity: values.stepTwo?.inputtedVolume, // volume inputted
          date: moment(
            values.stepTwo?.deliveryDate + ' ' + values.stepTwo?.deliveryTime,
            'DD/MM/yyyy HH:mm'
          ).valueOf(), // date + time
          withPump: values.stepTwo?.method === 'pompa' ? true : false,
          consecutive:
            values.stepTwo?.isConsecutive !== undefined
              ? values.stepTwo?.isConsecutive
              : false,
          withTechnician:
            values.stepTwo?.hasTechnicalRequest !== undefined
              ? values.stepTwo?.hasTechnicalRequest
              : false,
          status: 'SUBMITTED',
        };
        await dispatch(postOrderSchedule({ payload })).unwrap();
        navigation.dispatch(StackActions.popToTop());
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpText: 'Pembuatan Jadwal\nBerhasil',
            highlightedText: 'schedule',
            outsideClickClosePopUp: true,
          })
        );
      } catch (error) {
        const message = error.message || 'Pembuatan Jadwal Gagal';
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
    if (values.isSearchingPurchaseOrder === true) {
      action.updateValue('isSearchingPurchaseOrder', false);
    } else {
      if (values.step > 0 && !directlyClose) {
        next(values.step - 1)();
      } else {
        if (values.stepOne?.companyName) setPopupVisible(true);
        else navigation.goBack();
      }
    }
  };

  const stepRender = [<FirstStep />, <SecondStep />];

  return (
    <>
      {values.isSearchingPurchaseOrder === false && (
        <BStepperIndicator
          stepsDone={stepsDone}
          stepOnPress={(pos: number) => {
            next(pos)();
          }}
          currentStep={values.step}
          labels={labels}
        />
      )}

      <BContainer>
        <View style={styles.container}>
          {stepRender[values.step]}
          <BSpacer size={'extraSmall'} />
          {!keyboardVisible && values.shouldScrollView && values.step > -1 && (
            <BBackContinueBtn
              onPressContinue={() => {
                next(values.step + 1)();
                DeviceEventEmitter.emit('CreateSchedule.continueButton', true);
              }}
              onPressBack={() => actionBackButton(false)}
              continueText={values.step > 0 ? 'Buat Jadwal' : 'Lanjut'}
              unrenderBack={values.step > 0 ? false : true}
              disableContinue={!stepsDone.includes(values.step)}
              isContinueIcon={values.step < 1 ? true : false}
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
