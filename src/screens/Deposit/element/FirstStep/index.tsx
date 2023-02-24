import * as React from 'react';
import { BForm, BGallery } from '@/components';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { layout } from '@/constants';
import { Input } from '@/interfaces';
import { CreateDepositContext } from '@/context/CreateDepositContext';
import { CAMERA } from '@/navigation/ScreenNames';
import { useDispatch, useSelector } from 'react-redux';
import { deleteImage } from '@/redux/reducers/cameraReducer';
import { RootState } from '@/redux/store';
import moment from 'moment';

export default function FirstStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateDepositContext);
  const { stepOne: stateOne } = values;
  const { photoURLs } = useSelector((state: RootState) => state.camera);

  const { updateValueOnstep } = action;
  const dispatch = useDispatch();

  const { deposit, picts } = stateOne;

  const inputs: Input[] = [
    {
      label: 'Tanggal Bayar',
      isRequire: true,
      type: 'calendar',
      value: deposit?.createdAt,
      placeholder: 'Pilih tanggal bayar',
      isError: deposit?.createdAt ? false : true,
      customerErrorMsg: 'Tanggal bayar harus diisi',
      calendar: {
        onDayPress: (value: any) => {
          const date = moment(value.dateString).format('DD/MM/yyyy');
          onChange('createdAt')(date);
        },
      },
    },
    {
      label: 'Nominal',
      isRequire: true,
      type: 'price',
      value: deposit?.nominal,
      placeholder: '0',
      isError: deposit?.nominal ? false : true,
      customerErrorMsg: 'Nominal harus diisi',
      onChange: (value: any) => {
        onChange('nominal')(value);
      },
    },
  ];

  const onChange = (key: string) => (val: any) => {
    let modifyDeposit = {};
    if (deposit) modifyDeposit = deposit;
    if (key === 'createdAt')
      modifyDeposit = {
        ...modifyDeposit,
        createdAt: val,
      };
    if (key === 'nominal')
      modifyDeposit = {
        ...modifyDeposit,
        nominal: val.split('.').join(''),
      };

    updateValueOnstep('stepOne', 'deposit', modifyDeposit);
  };

  const removeImage = React.useCallback(
    (pos: number) => () => {
      dispatch(deleteImage({ pos }));
      updateValueOnstep('stepOne', 'picts', photoURLs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFocusEffect(
    React.useCallback(() => {
      updateValueOnstep('stepOne', 'picts', photoURLs);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photoURLs])
  );

  return (
    <SafeAreaView style={style.flexFull}>
      <View style={style.gallery}>
        <BGallery
          picts={picts}
          addMorePict={() =>
            navigation.dispatch(
              StackActions.push(CAMERA, {
                photoTitle: 'Bukti',
                closeButton: true,
              })
            )
          }
          removePict={removeImage}
        />
      </View>
      <ScrollView style={style.content}>
        <BForm titleBold="500" inputs={inputs} />
      </ScrollView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  flexFull: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: layout.pad.md,
  },
  gallery: {
    height: '25%',
  },
});
