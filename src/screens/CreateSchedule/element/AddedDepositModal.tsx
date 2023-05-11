import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { resScale } from '@/utils';
import { RootState } from '@/redux/store';
import { CAMERA, CREATE_SCHEDULE } from '@/navigation/ScreenNames';
import { Input } from '@/interfaces';
import { colors, fonts, layout } from '@/constants';
import { BContainer, BForm, BGallery, BSpacer, BButtonPrimary } from '@/components';

const style = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    justifyContent: 'space-between',
    height: resScale(400),
  },
  modalContent: {
    backgroundColor: 'white',
    height: resScale(450),
    borderTopLeftRadius: layout.radius.lg,
    borderTopRightRadius: layout.radius.lg,
  },
  modalHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[700],
    fontSize: fonts.size.lg,
  },
});

type AddedDepositModalType = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCompletedData: (data: any) => void;
};

export default function AddedDepositModal({
  isModalVisible,
  setIsModalVisible,
  setCompletedData,
}: AddedDepositModalType) {
  const [scrollOffSet, setScrollOffSet] = React.useState<number | undefined>(undefined);
  const navigation = useNavigation();
  const { createSchedulePhotoURLs } = useSelector((state: RootState) => state.camera);
  const [isVisibleCalendar, setVisibleCalendar] = React.useState(false);
  const [addedDeposit, setAddedDeposit] = React.useState<any>({});

  const inputs: Input[] = [
    {
      label: 'Tanggal Bayar',
      isRequire: true,
      type: 'calendar',
      value: addedDeposit?.createdAt,
      placeholder: 'Pilih tanggal bayar',
      isError: !addedDeposit?.createdAt,
      customerErrorMsg: 'Tanggal bayar harus diisi',
      calendar: {
        onDayPress: (value: any) => {
          const date = moment(value.dateString).format('DD/MM/yyyy');
          setAddedDeposit({ ...addedDeposit, createdAt: date });
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
      value: addedDeposit?.nominal,
      placeholder: '0',
      isError: !addedDeposit?.nominal,
      customerErrorMsg: 'Nominal harus diisi',
      onChange: (value: any) => {
        setAddedDeposit({
          ...addedDeposit,
          nominal: value.split('.').join(''),
        });
      },
    },
  ];

  const isButtonDisable = () => {
    if (addedDeposit && addedDeposit?.nominal && addedDeposit?.createdAt) {
      return false;
    }
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      setAddedDeposit({ ...addedDeposit, picts: createSchedulePhotoURLs });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createSchedulePhotoURLs])
  );

  return (
    <Modal
      hideModalContentWhileAnimating
      backdropOpacity={0.3}
      isVisible={isModalVisible}
      onBackButtonPress={() => {
        setIsModalVisible(curr => !curr);
      }}
      style={style.modal}
      scrollOffset={scrollOffSet}
      scrollOffsetMax={resScale(350) - resScale(190)}
      propagateSwipe>
      <View style={style.modalContent}>
        <BContainer>
          <View style={style.container}>
            <View>
              <View style={style.modalHeader}>
                <Text style={style.headerText}>Buat Deposit</Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(curr => !curr);
                  }}>
                  <MaterialCommunityIcons name="close" size={25} color="#000000" />
                </TouchableOpacity>
              </View>
              <BSpacer size="extraSmall" />
              <View style={{ height: resScale(340) }}>
                <ScrollView
                  onScroll={event => {
                    setScrollOffSet(event.nativeEvent.contentOffset.y);
                  }}>
                  <BGallery
                    picts={createSchedulePhotoURLs}
                    addMorePict={() => {
                      setIsModalVisible(curr => !curr);
                      navigation.dispatch(
                        StackActions.push(CAMERA, {
                          photoTitle: 'Bukti',
                          navigateTo: CREATE_SCHEDULE,
                          closeButton: true,
                        })
                      );
                    }}
                  />
                  <BSpacer size="extraSmall" />
                  <BForm titleBold="500" inputs={inputs} />
                </ScrollView>
              </View>

              <BButtonPrimary
                title="Simpan"
                disable={isButtonDisable()}
                onPress={() => {
                  setIsModalVisible(curr => !curr);
                  setCompletedData(addedDeposit);
                }}
              />
            </View>
          </View>
        </BContainer>
      </View>
    </Modal>
  );
}
