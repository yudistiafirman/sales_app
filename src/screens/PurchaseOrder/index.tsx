import {
  BButtonPrimary,
  BHeaderIcon,
  BHeaderTitle,
  BSpacer,
  BStepperIndicator,
} from '@/components';
import { colors, layout } from '@/constants';
import {
  PurchaseOrderContext,
  PurchaseOrderProvider,
} from '@/context/PoContext';
import { RootStackParamList } from '@/navigation/navTypes';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { AppDispatch } from '@/redux/store';
import {
  RouteProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import { useActor } from '@xstate/react';
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import CreatePo from './element/CreatePo';
import Icon from 'react-native-vector-icons/AntDesign';
import { resScale } from '@/utils';
import UploadFiles from './element/PaymentDetail';
import DetailProduk from './element/ProductDetail';

export type PORoutes = RouteProp<RootStackParamList['PO']>;

const PO = () => {
  const navigation = useNavigation();
  const { purchaseOrderService } = useContext(PurchaseOrderContext);
  const [state] = useActor(purchaseOrderService);
  const { send } = purchaseOrderService;
  const dispatch = useDispatch<AppDispatch>();

  const [currentStep, setCurrentStep] = useState(0);
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const labels = ['Cari SPH', 'Detil Pembayaran', 'Detil Produk'];
  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      if (state.matches('firstStep.SearchSph')) {
        send('backToAddPo');
      } else {
        dispatch(resetImageURLS());
        navigation.dispatch(StackActions.popToTop());
      }
    } else if (currentStep === 1) {
      setCurrentStep((prevState) => prevState - 1);
      send('goBackToFirstStep');
    } else if (currentStep === 2) {
      setCurrentStep((prevState) => prevState - 1);
      send('goBackToSecondStep');
    }
  }, [currentStep, dispatch, navigation, send, state]);

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      setCurrentStep((prevState) => prevState + 1);
      send('goToSecondStep');
    } else if (currentStep === 1) {
      setCurrentStep((prevState) => prevState + 1);
      send('goToThirdStep');
    }
  }, [currentStep, send]);

  const renderHeaderLeft = useCallback(
    () => (
      <BHeaderIcon
        size={layout.pad.lg + layout.pad.md}
        iconName="x"
        marginRight={layout.pad.lg}
        onBack={handleBack}
      />
    ),
    [handleBack]
  );

  const renderTitle = useCallback(() => {
    let title = 'Buat PO';
    if (state.matches('firstStep.SearchSph')) {
      title = 'Cari SPH';
    }
    return title;
  }, [state]);

  const renderBtnIcon = () => (
    <Icon
      name="right"
      style={{ marginTop: layout.pad.sm }}
      color={colors.white}
    />
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
      headerTitle: () => BHeaderTitle(renderTitle(), 'flex-start'),
    });
  }, [navigation, renderHeaderLeft, renderTitle]);

  const stepToRender = [<CreatePo />, <UploadFiles />, <DetailProduk />];

  return (
    <SafeAreaView style={styles.poContainer}>
      <View style={styles.stepperIndicator}>
        <BStepperIndicator
          labels={labels}
          currentStep={currentStep}
          stepsDone={stepsDone}
        />
      </View>
      <BSpacer size="medium" />
      {stepToRender[currentStep]}
      <View style={styles.footer}>
        <BButtonPrimary
          onPress={handleBack}
          buttonStyle={{ width: resScale(132) }}
          isOutline
          title="Kembali"
        />
        <BButtonPrimary
          title="Lanjut"
          onPress={handleNext}
          buttonStyle={{ width: resScale(202) }}
          rightIcon={() => renderBtnIcon()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  poContainer: { flex: 1, margin: layout.pad.lg },
  stepperIndicator: { alignSelf: 'center' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

const PurchaseOrderWithProvider = () => {
  return (
    <PurchaseOrderProvider>
      <PO />
    </PurchaseOrderProvider>
  );
};

export default PurchaseOrderWithProvider;
