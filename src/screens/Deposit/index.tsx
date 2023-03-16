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
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';
import {
  CreateDepositState,
  PoProductData,
  PurchaseOrdersData,
} from '@/interfaces/CreateDeposit';
import {
  CreateDepositContext,
  CreateDepositProvider,
} from '@/context/CreateDepositContext';
import FirstStep from './element/FirstStep';
import SecondStep from './element/SecondStep';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { useDispatch } from 'react-redux';
import { CREATE_DEPOSIT } from '@/navigation/ScreenNames';
import { CreateDeposit } from '@/models/CreateDeposit';
import { openPopUp } from '@/redux/reducers/modalReducer';
import moment from 'moment';
import { postOrderDeposit } from '@/redux/async-thunks/orderThunks';
import { postUploadFiles } from '@/redux/async-thunks/commonThunks';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';

const labels = ['Data Pelanggan', 'Cari PO'];

function stepHandler(
  state: CreateDepositState,
  setStepsDone: (e: number[] | ((curr: number[]) => number[])) => void
) {
  const { stepOne, stepTwo, existingProjectID } = state;

  if (
    stepOne?.deposit?.picts &&
    stepOne?.deposit?.picts.length > 0 &&
    stepOne?.deposit?.createdAt &&
    stepOne?.deposit?.nominal
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 0];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 0));
  }

  let allProducts: PoProductData[] = [];
  stepTwo?.purchaseOrders?.forEach((sp) => {
    if (sp?.PoProducts) allProducts.push(...sp.PoProducts);
  });

  let totalAmountProducts = 0;
  if (allProducts.length > 0)
    totalAmountProducts = allProducts
      ?.map(
        (prod) =>
          prod?.RequestedProduct?.offeringPrice * prod?.requestedQuantity
      )
      ?.reduce((prev: any, next: any) => prev + next);

  if (
    stepTwo?.companyName &&
    stepTwo?.purchaseOrders &&
    getTotalLastDeposit(stepTwo?.purchaseOrders) +
      parseInt(stepOne?.deposit?.nominal, 0) >=
      totalAmountProducts &&
    existingProjectID
  ) {
    setStepsDone((curr) => {
      return [...new Set(curr), 1];
    });
  } else {
    setStepsDone((curr) => curr.filter((num) => num !== 1));
  }
}

const getTotalLastDeposit = (purchaseOrders: PurchaseOrdersData[]) => {
  let total: number = 0;
  if (purchaseOrders && purchaseOrders.length > 0) {
    purchaseOrders.forEach((it) => {
      total = it.totalDeposit;
    });
  }
  return total;
};

const Deposit = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { values, action } = React.useContext(CreateDepositContext);
  const { keyboardVisible } = useKeyboardActive();
  const [stepsDone, setStepsDone] = React.useState<number[]>([0, 1]);
  const [isPopupVisible, setPopupVisible] = React.useState(false);

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
    title: values.isSearchingPurchaseOrder === true ? 'Cari PO' : 'Buat Deposit',
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
    }, [values.step, values.isSearchingPurchaseOrder])
  );

  React.useEffect(() => {
    return () => {
      dispatch(resetImageURLS({ source: CREATE_DEPOSIT }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    stepHandler(values, setStepsDone);
  }, [values]);

  const next = (nextStep: number) => async () => {
    const totalStep = stepRender.length;
    if (nextStep < totalStep && nextStep >= 0) {
      action.updateValue('step', nextStep);
    } else {
      try {
        const photoFiles = values.stepOne?.deposit?.picts?.map((photo) => {
          return {
            ...photo.file,
            uri: photo?.file?.uri?.replace('file:', 'file://'),
          };
        });
        const uploadedImage = await dispatch(
          postUploadFiles({ files: photoFiles, from: 'deposit' })
        ).unwrap();

        let payload: CreateDeposit = {
          projectId: values.existingProjectID,
          quotationLetterId:
            values.stepTwo?.purchaseOrders[0]?.quotationLetterId,
          purchaseOrderId: values.stepTwo?.purchaseOrders[0]?.id,
          value: values.stepOne?.deposit?.nominal,
          paymentDate: moment(
            values.stepOne?.deposit?.createdAt,
            'DD/MM/yyyy'
          ).valueOf(),
          status: 'SUBMITTED',
          files: [],
        };
        uploadedImage.forEach((item) => {
          payload.files.push({ fileId: item?.id });
        });
        await dispatch(postOrderDeposit({ payload })).unwrap();
        navigation.dispatch(StackActions.popToTop());
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpText: 'Penambahan Deposit Berhasil',
            highlightedText: 'Deposit',
            outsideClickClosePopUp: true,
          })
        );
      } catch (error) {
        const message = error.message || 'Gagal Menambah Deposit';
        dispatch(
          openPopUp({
            popUpType: 'error',
            popUpText: message,
            highlightedText: 'Deposit',
            outsideClickClosePopUp: true,
          })
        );
      }
    }
  };

  const actionBackButton = (directlyClose: boolean = false) => {
    if (values.step > 0 && !directlyClose) {
      if (values.isSearchingPurchaseOrder === true) {
        action.updateValue('isSearchingPurchaseOrder', false);
      } else {
        next(values.step - 1)();
      }
    } else {
      setPopupVisible(true);
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
                DeviceEventEmitter.emit('Deposit.continueButton', true);
              }}
              onPressBack={() => actionBackButton(false)}
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
