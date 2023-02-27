import {
  BButtonPrimary,
  BForm,
  BGallery,
  BOperationCard,
  BSpacer,
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
import { ScrollView, StyleSheet, View } from 'react-native';
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
  const { photoURLs } = useSelector((state: RootState) => state.camera);
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

  const deliveryInputs: Input[] = React.useMemo(() => {
    const baseInput: Input[] = [
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
    return baseInput;
  }, []);

  const returnInputs: Input[] = React.useMemo(() => {
    const baseInput: Input[] = [
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
    return baseInput;
  }, [toggleCheckBox]);

  return (
    <View style={style.parent}>
      <ScrollView style={style.baseContainer}>
        <View style={style.top}>
          <BOperationCard
            item={{
              id: 'PT. Guna Karya Mandiri',
              addressID: 'Jakarta Barat',
            }}
            customStyle={style.headerOne}
            clickable={false}
          />
          <BOperationCard
            item={{
              id: 'DO/BRIK/2022/11/00254',
              qty: '7 m3',
              date: '23/11/2022 | 08:10',
            }}
            color={colors.tertiary}
            customStyle={style.headerTwo}
            clickable={false}
          />
        </View>
        <View>
          <BGallery picts={photoURLs} />
        </View>
        {(operationType === ENTRY_TYPE.DRIVER ||
          operationType === ENTRY_TYPE.RETURN) && (
          <View>
            <BSpacer size={'small'} />
          </View>
        )}
        {operationType === ENTRY_TYPE.DRIVER && (
          <View style={style.container}>
            <BForm inputs={deliveryInputs} />
          </View>
        )}
        {operationType === ENTRY_TYPE.RETURN && (
          <>
            <View style={style.container}>
              <BForm inputs={returnInputs} spacer="extraSmall" />
            </View>
          </>
        )}
      </ScrollView>
      <View style={style.conButton}>
        <View style={style.buttonOne}>
          <BButtonPrimary
            title="Kembali"
            isOutline
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={style.buttonTwo}>
          <BButtonPrimary
            title="Simpan"
            onPress={() => navigation.dispatch(StackActions.popToTop())}
          />
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.white,
    padding: resScale(16),
  },
  top: {
    flex: 1,
    height: '20%',
    marginBottom: layout.pad.lg,
  },
  headerOne: {
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
    borderColor: colors.border.default,
  },
  headerTwo: {
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    borderColor: colors.border.default,
  },
  baseContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
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
