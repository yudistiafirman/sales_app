import {
  BButtonPrimary,
  BHeaderIcon,
  BSpacer,
  BStepperIndicator,
  PopUpQuestion,
} from '@/components';
import { colors, layout } from '@/constants';
import { RootStackParamList } from '@/navigation/navTypes';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { AppDispatch, RootState } from '@/redux/store';
import {
  RouteProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CreatePo from './element/CreatePo';
import Icon from 'react-native-vector-icons/AntDesign';
import { resScale } from '@/utils';
import UploadFiles from './element/PaymentDetail';
import DetailProduk from './element/ProductDetail';
import { useKeyboardActive } from '@/hooks';

export type PORoutes = RouteProp<RootStackParamList['PO']>;

const PO = () => {
  const navigation = useNavigation();
  const poGlobalState = useSelector(
    (postate: RootState) => postate.purchaseOrder
  );
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep } = poGlobalState.poState;
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const [popUpVisible, setPopUpQuestion] = useState(false);
  const { keyboardVisible } = useKeyboardActive();
  const labels = ['Cari SPH', 'Detil Pembayaran', 'Detil Produk'];
  const isBtnFooterShown = !poGlobalState.matches('firstStep.SearchSph');

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      if (poGlobalState.matches('firstStep.SearchSph')) {
        dispatch({ type: 'backToAddPo' });
      } else {
        setPopUpQuestion(true);
      }
    } else if (currentStep === 1) {
      dispatch({ type: 'goBackToFirstStep' });
    } else if (currentStep === 2) {
      dispatch({ type: 'goBackToSecondStep' });
    }
  }, [currentStep, dispatch, poGlobalState]);

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      dispatch({
        type: 'goToSecondStep',
      });
    } else if (currentStep === 1) {
      dispatch({ type: 'goToThirdStep' });
    }
  }, [currentStep, dispatch]);

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
    if (poGlobalState.matches('firstStep.SearchSph')) {
      title = 'Cari SPH';
    }
    return title;
  }, [poGlobalState]);

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
      headerTitle: renderTitle(),
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
      {isBtnFooterShown && !keyboardVisible && (
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
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  poContainer: { flex: 1, margin: layout.pad.lg },
  stepperIndicator: { alignSelf: 'center' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PO;
