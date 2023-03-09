import {
  BBackContinueBtn,
  BButtonPrimary,
  BHeaderIcon,
  BSpacer,
  BStepperIndicator,
  PopUpQuestion,
} from '@/components';
import { colors, fonts, layout } from '@/constants';
import { RootStackParamList } from '@/navigation/navTypes';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { AppDispatch, RootState } from '@/redux/store';
import {
  RouteProp,
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { BackHandler, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CreatePo from './element/CreatePo';
import Icon from 'react-native-vector-icons/AntDesign';
import { resScale } from '@/utils';
import UploadFiles from './element/PaymentDetail';
import DetailProduk from './element/ProductDetail';
import { useKeyboardActive } from '@/hooks';
import { bStorage } from '@/actions';
import { PO } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';

export type PORoutes = RouteProp<RootStackParamList['PO']>;

const PurchaseOrder = () => {
  const navigation = useNavigation();
  const poState = useSelector((state: RootState) => state.purchaseOrder);
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep, poNumber, isModalContinuePo } =
    poState.currentState.context;
  const [stepsDone, setStepsDone] = useState<number[]>([]);
  const { keyboardVisible } = useKeyboardActive();
  const labels = ['Cari SPH', 'Detil Pembayaran', 'Detil Produk'];
  const isBtnFooterShown = !poState.currentState.matches('firstStep.SearchSph');

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      if (poState.currentState.matches('firstStep.SearchSph')) {
        dispatch({ type: 'backToAddPo' });
      }
    } else if (currentStep === 1) {
      dispatch({ type: 'goBackToFirstStep' });
    } else if (currentStep === 2) {
      dispatch({ type: 'goBackToSecondStep' });
    }
  }, [currentStep, dispatch, poState.currentState]);

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
          />
        </View>
      )}
      <PopUpQuestion
        isVisible={isModalContinuePo}
        onCancel={() => {
          bStorage.deleteItem(PO);
          dispatch({ type: 'createNewPo' });
        }}
        actionButton={() => {
          if (currentStep === 0) {
            dispatch({ type: 'goToSecondStepFromSaved' });
          } else {
            dispatch({ type: 'goToThirdStepFromSaved' });
          }
        }}
        descContent={
          <View style={styles.poNumberWrapper}>
            <Text style={styles.poNumber}>{poNumber}</Text>
          </View>
        }
        cancelText="Buat Baru"
        actionText="Lanjutkan"
        desc="PO yang lama akan hilang kalau Anda buat PO yang baru"
        text="Apakah Anda ingin melanjutkan pembuatan PO sebelumnya?"
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
  poNumber: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.text.darker,
  },
  poNumberWrapper: {
    backgroundColor: colors.tertiary,
    height: resScale(37),
    alignItems: 'center',
    justifyContent: 'center',
    width: resScale(277),
    alignSelf: 'center',
    borderRadius: layout.radius.md,
  },
});

export default PurchaseOrder;
