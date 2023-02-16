import { BButtonPrimary, BDivider, BForm, BOperationCard } from '@/components';
import { colors, layout } from '@/constants';
import { TM_CONDITION } from '@/constants/dropdown';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { Input } from '@/interfaces';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import { resScale } from '@/utils';
import {
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { SUBMIT_FORM } from '@/navigation/ScreenNames';

const SubmitForm = () => {
  const route = useRoute<RootStackScreenProps>();
  useHeaderTitleChanged({ title: 'Dispatch' });
  const navigation = useNavigation();
  const [toggleCheckBox, setToggleCheckBox] = useState(true);

  React.useEffect(() => {
    crashlytics().log(SUBMIT_FORM);
  }, []);

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
            console.log(value);
          },
        },
      },
    ];
    return baseInput;
  }, [toggleCheckBox]);

  return (
    <View style={style.parent}>
      <View style={style.baseContainer}>
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
        {
          // put array of images here
        }
        {(route?.params?.type === 'delivery' ||
          route?.params?.type === 'return') && (
          <View>
            <BDivider />
          </View>
        )}
        {route?.params?.type === 'delivery' && (
          <View style={style.container}>
            <BForm inputs={deliveryInputs} />
          </View>
        )}
        {route?.params?.type === 'return' && (
          <>
            <View style={style.container}>
              <BForm inputs={returnInputs} spacer="extraSmall" />
            </View>
          </>
        )}
      </View>
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
