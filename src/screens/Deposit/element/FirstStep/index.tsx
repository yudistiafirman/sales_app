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
import {
  CAMERA,
  CREATE_DEPOSIT,
  GALLERY_DEPOSIT,
} from '@/navigation/ScreenNames';
import { useDispatch, useSelector } from 'react-redux';
import { deleteImage } from '@/redux/reducers/cameraReducer';
import { RootState } from '@/redux/store';
import moment from 'moment';

export default function FirstStep() {
  const navigation = useNavigation();
  const { values, action } = React.useContext(CreateDepositContext);
  const { stepOne: stateOne } = values;
  const { createDepositPhotoURLs } = useSelector(
    (state: RootState) => state.camera
  );
  const [isVisibleCalendar, setVisibleCalendar] = React.useState(false);

  const { updateValueOnstep } = action;
  const dispatch = useDispatch();

  const inputs: Input[] = [
    {
      label: 'Tanggal Bayar',
      isRequire: true,
      type: 'calendar',
      value: stateOne?.deposit?.createdAt,
      placeholder: 'Pilih tanggal bayar',
      isError: stateOne?.deposit?.createdAt ? false : true,
      customerErrorMsg: 'Tanggal bayar harus diisi',
      calendar: {
        onDayPress: (value: any) => {
          const date = moment(value.dateString).format('DD/MM/yyyy');
          onChange('createdAt')(date);
        },
        isCalendarVisible: isVisibleCalendar,
        setCalendarVisible: (flag: boolean) => {
          setVisibleCalendar(flag);
        },
      },
    },
    {
      label: 'Nominal',
      isRequire: true,
      type: 'price',
      value: stateOne?.deposit?.nominal,
      placeholder: '0',
      isError: stateOne?.deposit?.nominal ? false : true,
      customerErrorMsg: 'Nominal harus diisi',
      onChange: (value: any) => {
        onChange('nominal')(value.split('.').join(''));
      },
    },
  ];

  const onChange = (key: string) => (val: any) => {
    let modifyDeposit = {};
    if (stateOne?.deposit) modifyDeposit = stateOne?.deposit;
    if (key === 'createdAt')
      modifyDeposit = {
        ...modifyDeposit,
        createdAt: val,
      };
    if (key === 'nominal')
      modifyDeposit = {
        ...modifyDeposit,
        nominal: val,
      };

    updateValueOnstep('stepOne', 'deposit', modifyDeposit);
  };

  const removeImage = React.useCallback(
    (pos: number) => () => {
      dispatch(deleteImage({ pos, source: CREATE_DEPOSIT }));
      let modifyDeposit = {};
      if (stateOne?.deposit) modifyDeposit = stateOne?.deposit;
      modifyDeposit = {
        ...modifyDeposit,
        picts: createDepositPhotoURLs,
      };
      updateValueOnstep('stepOne', 'deposit', modifyDeposit);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFocusEffect(
    React.useCallback(() => {
      let modifyDeposit = {};
      if (stateOne?.deposit) modifyDeposit = stateOne?.deposit;
      modifyDeposit = {
        ...modifyDeposit,
        picts: createDepositPhotoURLs,
      };
      updateValueOnstep('stepOne', 'deposit', modifyDeposit);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createDepositPhotoURLs])
  );

  return (
    <SafeAreaView style={style.flexFull}>
      <View style={style.gallery}>
        <BGallery
          picts={stateOne?.deposit?.picts}
          addMorePict={() =>
            navigation.dispatch(
              StackActions.push(CAMERA, {
                photoTitle: 'Bukti',
                closeButton: true,
                navigateTo: GALLERY_DEPOSIT,
                disabledDocPicker: false,
                disabledGalleryPicker: false,
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
