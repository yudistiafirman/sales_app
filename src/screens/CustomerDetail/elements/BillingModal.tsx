import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import Modal from 'react-native-modal';
import { resScale } from '@/utils';
import { colors, fonts, layout } from '@/constants';
import { BButtonPrimary, BContainer, BForm, BSpacer } from '@/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input } from '@/interfaces';
import { customLog } from '@/utils/generalFunc';

type BillingModalType = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BillingModal({
  isModalVisible,
  setIsModalVisible,
}: BillingModalType) {
  const [scrollOffSet, setScrollOffSet] = useState<number | undefined>(
    undefined
  );
  const [billingState, setBillingState] = useState({
    billingAddress: '',
    kelurahan: '',
    kecamatan: '',
    kabupaten: '', // kota
  });

  const inputsData: Input[] = useMemo(() => {
    return [
      {
        label: 'Alamat penagihan',
        isRequire: true,
        isError: true,
        type: 'area',
        placeholder: 'contoh: Jalan Kusumadinata no 5',
        onChange: (text: string) => {
          customLog(text, 'inputsData e');
        },
        value: billingState.billingAddress,
      },
      {
        label: 'Kelurahan',
        isRequire: false,
        type: 'textInput',
        placeholder: 'Masukkan kelurahan',
        onChange: (text: string) => {
          //   if (stateUpdate && sphState) {
          //     stateUpdate('billingAddress')({
          //       ...sphState?.billingAddress,
          //       name: text,
          //     });
          //   }
          customLog(text, 'kelurahan text');
        },
        value: billingState.kelurahan,
      },
      {
        label: 'Kecamatan',
        isRequire: false,
        type: 'textInput',
        placeholder: 'Masukkan kecamatan',
        onChange: (text: string) => {
          //   if (stateUpdate && sphState) {
          //     stateUpdate('billingAddress')({
          //       ...sphState?.billingAddress,
          //       name: text,
          //     });
          //   }
          customLog(text, 'kecamatan text');
        },
        value: billingState.kecamatan,
      },
      {
        label: 'Kota / Kabupaten',
        isRequire: false,
        type: 'textInput',
        placeholder: 'Masukkan kota',
        onChange: (text: string) => {
          //   if (stateUpdate && sphState) {
          //     stateUpdate('billingAddress')({
          //       ...sphState?.billingAddress,
          //       name: text,
          //     });
          //   }
          customLog(text, 'kota text');
        },
        value: billingState.kabupaten,
      },
    ];
  }, [billingState]);

  return (
    <Modal
      hideModalContentWhileAnimating={true}
      backdropOpacity={0.3}
      isVisible={isModalVisible}
      onBackButtonPress={() => {
        setIsModalVisible((curr) => !curr);
      }}
      scrollOffset={scrollOffSet}
      scrollOffsetMax={resScale(400) - resScale(190)}
      propagateSwipe={true}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <BContainer>
          <View style={styles.modalHeader}>
            <Text style={styles.headerText} numberOfLines={1}>
              Tambah Alamat Penagihan
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible((curr) => !curr)}
            >
              <MaterialCommunityIcons name="close" size={30} color="#000000" />
            </TouchableOpacity>
          </View>
          <BSpacer size={'extraSmall'} />
          <ScrollView
            onScroll={(event) => {
              setScrollOffSet(event.nativeEvent.contentOffset.y);
            }}
          >
            {/* <Text>BillingModal</Text> */}
            <BForm inputs={inputsData} />
          </ScrollView>
          <BButtonPrimary title="Tambah Alamat" />
        </BContainer>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    height: resScale(400),
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
