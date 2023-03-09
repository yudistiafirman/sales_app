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
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { SUBMIT_FORM } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';

const SubmitForm = () => {
  const route = useRoute<RootStackScreenProps>();
  const navigation = useNavigation();
  const [toggleCheckBox, setToggleCheckBox] = useState(true);
  const { operationPhotoURLs } = useSelector(
    (state: RootState) => state.camera
  );
  const { entryType } = useSelector((state: RootState) => state.auth);
  const operationType = route?.params?.operationType;

  React.useEffect(() => {
    crashlytics().log(SUBMIT_FORM);
  }, []);

  const getHeaderTitle = () => {
    switch (entryType) {
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

  useHeaderTitleChanged({ title: getHeaderTitle() });

  const deliveryInputs: Input[] = [
    {
      label: 'Nama Penerima',
      value: '',
      isRequire: true,
      isError: false,
      type: 'textInput',
      placeholder: 'Masukkan nama penerima',
    },
    {
      label: 'No. Telp Penerima',
      value: '',
      isRequire: true,
      isError: false,
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
          customLog(value);
        },
      },
    },
  ];

  return (
    <SafeAreaView style={style.parent}>
      <View style={style.flexFull}>
        {operationType === ENTRY_TYPE.DRIVER && (
          <BLocationText location="Green Lake City, Cipondoh, Legok 11520" />
        )}
        <BSpacer size={'extraSmall'} />
        <View style={style.top}>
          <BVisitationCard
            item={{
              name: 'PT. Guna Karya Mandiri',
              location: 'Jakarta Barat',
            }}
            isRenderIcon={false}
          />
          <BVisitationCard
            item={{
              name: 'DO/BRIK/2022/11/00254',
              unit: '7 m3',
              time: '23/11/2022 | 08:10',
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
          <BGallery picts={operationPhotoURLs} />
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
      </View>
      <BBackContinueBtn
        onPressContinue={() => {
          navigation.dispatch(StackActions.popToTop());
        }}
        onPressBack={() => navigation.goBack()}
        continueText={'Simpan'}
        isContinueIcon={false}
      />
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
