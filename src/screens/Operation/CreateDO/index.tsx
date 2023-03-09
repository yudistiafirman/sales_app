import {
  BButtonPrimary,
  BDivider,
  BForm,
  BSpacer,
  BText,
  BVisitationCard,
} from '@/components';
import { colors, layout } from '@/constants';
import { DRIVER_LIST, VEHICLE_LIST } from '@/constants/dropdown';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { Input } from '@/interfaces';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { CREATE_DO } from '@/navigation/ScreenNames';
import { customLog } from '@/utils/generalFunc';
import { resScale } from '@/utils';
import font from '@/constants/fonts';

const CreateDO = () => {
  useHeaderTitleChanged({ title: 'Tugaskan DO' });
  const navigation = useNavigation();

  React.useEffect(() => {
    crashlytics().log(CREATE_DO);
  }, []);

  const quantityInputs: Input[] = [
    {
      label: 'Kuantitas',
      value: '',
      isRequire: true,
      isError: false,
      type: 'quantity',
      placeholder: '0',
    },
  ];

  const inputs: Input[] = [
    {
      label: 'No. Segel',
      value: '',
      isRequire: true,
      isError: false,
      type: 'textInput',
      placeholder: 'Masukkan no segel',
    },
    {
      label: 'No. Kendaraan',
      value: '',
      isRequire: true,
      isError: false,
      type: 'dropdown',
      dropdown: {
        items: VEHICLE_LIST,
        placeholder: 'Pilih Nomor Plat',
        onChange: (value: any) => {
          customLog(value);
        },
      },
    },
    {
      label: 'Nama Supir',
      value: '',
      isRequire: true,
      isError: false,
      type: 'dropdown',
      dropdown: {
        items: DRIVER_LIST,
        placeholder: 'Pilih Nama Driver',
        onChange: (value: any) => {
          customLog(value);
        },
      },
    },
  ];

  return (
    <View style={style.parent}>
      <View style={style.top}>
        <BVisitationCard
          item={{ name: 'PT. Guna Karya Mandiri', location: 'Jakarta Barat' }}
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
      </View>
      <View style={style.container}>
        <BForm noSpaceEnd titleBold="500" inputs={quantityInputs} />
        <BText style={style.quantity}>
          {'Maksimum kuantitas adalah ' + 14 + 'm³'}
        </BText>
        <BSpacer size={'extraSmall'} />
        <BForm titleBold="500" inputs={inputs} />
      </View>
      <BButtonPrimary title="Simpan" onPress={() => navigation.goBack()} />
    </View>
  );
};

const style = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
    paddingBottom: layout.pad.lg,
  },
  quantity: {
    color: colors.text.medium,
    fontSize: font.size.xs,
    fontFamily: font.family.montserrat[300],
    marginTop: layout.pad.sm,
  },
  top: {
    height: resScale(120),
    marginBottom: layout.pad.lg,
  },
  headerTwo: {
    borderColor: colors.border.default,
  },
  container: {
    flex: 1,
    marginTop: layout.pad.ml,
  },
});
export default CreateDO;
