import { BButtonPrimary, BDivider, BForm, BOperationCard } from '@/components';
import { colors, layout } from '@/constants';
import { DRIVER_LIST, VEHICLE_LIST } from '@/constants/dropdown';
import useHeaderTitleChanged from '@/hooks/useHeaderTitleChanged';
import { Input } from '@/interfaces';
import { resScale } from '@/utils';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { SCHEDULE } from '@/navigation/ScreenNames';

const Schedule = () => {
  useHeaderTitleChanged({ title: 'Tugaskan DO' });
  const navigation = useNavigation();

  React.useEffect(() => {
    crashlytics().log(SCHEDULE);
  }, []);

  const inputs: Input[] = React.useMemo(() => {
    const baseInput: Input[] = [
      {
        label: 'Kuantitas',
        value: '',
        isRequire: true,
        isError: false,
        type: 'quantity',
        placeholder: '0',
      },
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
            console.log(value);
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
            console.log(value);
          },
        },
      },
    ];
    return baseInput;
  }, []);

  return (
    <View style={style.parent}>
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
        <BDivider />
      </View>
      <View style={style.container}>
        <BForm inputs={inputs} />
      </View>
      <BButtonPrimary title="Simpan" onPress={() => navigation.goBack()} />
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
  container: {
    flex: 1,
    marginTop: layout.pad.lg,
  },
});
export default Schedule;
