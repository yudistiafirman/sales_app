import {
  BBackContinueBtn,
  BHeaderIcon,
  BSpacer,
  BStepperIndicator,
  PopUpQuestion,
} from '@/components';
import { layout } from '@/constants';
import { RootStackParamList } from '@/navigation/navTypes';
import { AppDispatch, RootState } from '@/redux/store';
import {
  RouteProp,
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { BackHandler, SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CreatePo from './element/CreatePo';
import UploadFiles from './element/PaymentDetail';
import DetailProduk from './element/ProductDetail';
import { useKeyboardActive } from '@/hooks';
import { bStorage } from '@/actions';
import { PO } from '@/navigation/ScreenNames';

export type PORoutes = RouteProp<RootStackParamList['PO']>;

const PurchaseOrder = () => {
  const navigation = useNavigation();
  const poState = useSelector((state: RootState) => state.purchaseOrder);
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentStep,
    poNumber,
    choosenSphDataFromModal,
    files,
    selectedProducts,
    poImages,
  } = poState.currentState.context;
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const { keyboardVisible } = useKeyboardActive();
  const [isPopupExitVisible, setIsPopupExitVisible] = useState(false);
  const labels = ['Cari SPH', 'Detil Pembayaran', 'Detil Produk'];
  const isBtnFooterShown = !poState.currentState.matches('firstStep.SearchSph');

  const handleDisableContinueBtn = () => {
    if (currentStep === 0) {
      return (
        poNumber.length === 0 ||
        JSON.stringify(choosenSphDataFromModal) === '{}' ||
        poImages.length === 0
      );
    } else if (currentStep === 1) {
      const isFilesValueNull = files.filter((v) => v.value === null);
      return isFilesValueNull.length > 0;
    } else {
      const hasNoQuantityMultiProducts = selectedProducts.filter(
        (v) => v.quantity.length === 0 || v.quantity[0] === '0'
      );
      return (
        hasNoQuantityMultiProducts.length > 0 || selectedProducts.length === 0
      );
    }
  };

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      if (poState.currentState.matches('firstStep.SearchSph')) {
        dispatch({ type: 'backToAddPo' });
      } else {
        bStorage.getItem(PO).then((value) => {
          if (value) {
            setIsPopupExitVisible(true);
          } else {
            dispatch({
              type: 'backToBeginningState',
            });
            navigation.dispatch(StackActions.popToTop());
          }
        });
      }
    } else if (currentStep === 1) {
      dispatch({ type: 'goBackToFirstStep' });
    } else if (currentStep === 2) {
      dispatch({ type: 'goBackToSecondStep' });
    }
  }, [currentStep, dispatch, navigation, poState.currentState]);

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      dispatch({
        type: 'goToSecondStep',
      });
      bStorage.setItem(PO, {
        poContext: poState.currentState.context,
      });
    } else if (currentStep === 1) {
      dispatch({ type: 'goToThirdStep' });
      const dataToSaved = { ...poState.currentState.context, currentStep: 1 };
      bStorage.setItem(PO, {
        poContext: dataToSaved,
      });
    } else {
      dispatch({ type: 'goToPostPo' });
    }
  }, [currentStep, dispatch, poState.currentState.context]);

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
    if (poState.currentState.matches('firstStep.SearchSph')) {
      title = 'Cari SPH';
    }
    return title;
  }, [poState.currentState]);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        handleBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
    }, [handleBack])
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
          <BBackContinueBtn
            onPressContinue={handleNext}
            onPressBack={handleBack}
            disableContinue={handleDisableContinueBtn()}
          />
        </View>
      )}
      <PopUpQuestion
        isVisible={isPopupExitVisible}
        setIsPopupVisible={() => {
          bStorage.deleteItem(PO);
          dispatch({
            type: 'backToBeginningState',
          });
          navigation.dispatch(StackActions.popToTop());
        }}
        actionButton={() => setIsPopupExitVisible(false)}
        cancelText={'Keluar'}
        actionText={'Lanjutkan'}
        desc={'Progres pembuatan PO Anda sudah tersimpan.'}
        text={'Apakah Anda yakin ingin keluar?'}
      />
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

export default PurchaseOrder;
