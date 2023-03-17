import {
  BBackContinueBtn,
  BDivider,
  BForm,
  BGallery,
  BLocationText,
  BSpacer,
  BVisitationCard,
} from '@/components';
import { colors, layout } from '@/constants';
import { TM_CONDITION } from '@/constants/dropdown';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { Input } from '@/interfaces';
import { resScale } from '@/utils';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useState } from 'react';
import { BackHandler, KeyboardAvoidingView, SafeAreaView, StyleSheet, View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { OPERATION, SUBMIT_FORM } from '@/navigation/ScreenNames';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { onChangeInputValue, resetOperationState } from '@/redux/reducers/operationReducer';
import { useKeyboardActive } from '@/hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

const SubmitForm = () => {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>()
  const [toggleCheckBox, setToggleCheckBox] = useState(true);
  const { userData } = useSelector((state: RootState) => state.auth);
  const { inputsValue, projectDetails, photoFiles } = useSelector((state: RootState) => state.operation)
  const { keyboardVisible } = useKeyboardActive();
  const operationType = route?.params?.operationType;
  const enableLocationHeader = operationType === ENTRY_TYPE.DRIVER && projectDetails.address && projectDetails.address?.length > 0

  React.useEffect(() => {
    crashlytics().log(SUBMIT_FORM);
  }, []);

  const getHeaderTitle = () => {
    switch (userData?.type) {
      case ENTRY_TYPE.BATCHER:
        return 'Produksi';
      case ENTRY_TYPE.SECURITY:
        if (operationType === ENTRY_TYPE.DISPATCH) return 'Dispatch';
        else return 'Return';
      case ENTRY_TYPE.DRIVER:
        return 'Penuangan';
      default:
        return '';
    }
  };

  const handleDisableContinueButton = () => {
    if (userData?.type === ENTRY_TYPE.DRIVER) {
      return photoFiles.length === 0 || inputsValue.recepientName.length === 0 || inputsValue.recepientPhoneNumber.length === 0
    }
  }

  const handleBack = () => {
    dispatch(resetOperationState())
    navigation.dispatch(StackActions.popToTop())
  }


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

  useHeaderTitleChanged({ title: getHeaderTitle() });

  const deliveryInputs: Input[] = [
    {
      label: 'Nama Penerima',
      value: inputsValue.recepientName,
      onChange: (e) => dispatch(onChangeInputValue({ inputType: 'recepientName', value: e.nativeEvent.text })),
      isRequire: true,
      isError: false,
      type: 'textInput',
      placeholder: 'Masukkan nama penerima',
    },
    {
      label: 'No. Telp Penerima',
      value: inputsValue.recepientPhoneNumber,
      onChange: (e) => {
        if (e.nativeEvent.text.length >= 3) {
          dispatch(onChangeInputValue({ inputType: 'recepientPhoneNumber', value: e.nativeEvent.text }))
        }
      },
      isRequire: true,
      isError: false,
      keyboardType: 'numeric',
      type: 'textInput',
      placeholder: 'Masukkan no telp',
    },
  ];

  const returnInputs: Input[] = [
    {
      label: 'Ada Muatan Tersisa di Dalam TM?',
      value: '',
      type: 'checkbox',
      isRequire: false,
      checkbox: {
        value: toggleCheckBox,
        onValueChange: setToggleCheckBox,
      },
    },
    {
      label: 'Kondisi TM',
      value: '',
      isRequire: true,
      isError: false,
      type: 'dropdown',
      dropdown: {
        items: TM_CONDITION,
        placeholder: 'Pilih Kondisi TM',
        onChange: (value: any) => {
          dispatch(onChangeInputValue({ inputType: 'truckMixCondition', value: value }))
        },
      },
    },
  ];

  return (
    <SafeAreaView style={style.parent}>
      <KeyboardAwareScrollView style={style.flexFull}>
        {enableLocationHeader && (
          <BLocationText location={projectDetails.address} />
        )}
        <BSpacer size={'extraSmall'} />
        <View style={style.top}>
          <BVisitationCard
            item={{
              name: projectDetails.projectName,
              location: projectDetails.address,
            }}
            isRenderIcon={false}
          />
          <BVisitationCard
            item={{
              name: projectDetails.doNumber,
              unit: `${projectDetails.requestedQuantity} m3`,
              time: `${moment(projectDetails.deliveryTime).format('L')} | ${moment(projectDetails.deliveryTime).format('hh:mm A')}`,
            }}
            customStyle={{ backgroundColor: colors.tertiary }}
            isRenderIcon={false}
          />
        </View>
        <View>
          <BDivider />
          <BSpacer size={'extraSmall'} />
        </View>
        <View>
          <BGallery picts={photoFiles} />
        </View>
        <View style={style.flexFull}>
          {(operationType === ENTRY_TYPE.DRIVER ||
            operationType === ENTRY_TYPE.RETURN) && <BSpacer size={'small'} />}
          {operationType === ENTRY_TYPE.DRIVER && (
            <BForm titleBold="500" inputs={deliveryInputs} />
          )}
          {operationType === ENTRY_TYPE.RETURN && (
            <BForm titleBold="500" inputs={returnInputs} spacer="extraSmall" />
          )}
        </View>
      </KeyboardAwareScrollView>
      {
        !keyboardVisible && <BBackContinueBtn
          onPressContinue={() => {
            navigation.dispatch(StackActions.popToTop());
          }}
          disableContinue={handleDisableContinueButton()}
          onPressBack={handleBack}
          continueText={'Simpan'}
          isContinueIcon={false}
        />
      }

    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  flexFull: {
    flex: 1,
  },
  parent: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
    paddingBottom: layout.pad.lg,
  },
  top: {
    height: resScale(120),
    marginBottom: layout.pad.lg,
  },
  headerTwo: {
    borderColor: colors.border.default,
  },
  conButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: layout.pad.lg,
    bottom: 0,
  },
  buttonOne: {
    width: '40%',
    paddingEnd: layout.pad.md,
  },
  buttonTwo: {
    width: '60%',
    paddingStart: layout.pad.md,
  },
});
export default SubmitForm;
