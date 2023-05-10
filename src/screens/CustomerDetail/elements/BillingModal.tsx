import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import Icons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { updateBillingAddress, updateLocationAddress } from '@/actions/CommonActions';
import { BButtonPrimary, BContainer, BForm, BLabel, BSpacer, BText } from '@/components';
import { colors, fonts, layout } from '@/constants';
import { Address, Input } from '@/interfaces';
import { SEARCH_AREA, CUSTOMER_DETAIL } from '@/navigation/ScreenNames';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { AppDispatch } from '@/redux/store';
import { resScale } from '@/utils';

type BillingModalType = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFormattedAddress: React.Dispatch<React.SetStateAction<any>>;
  setRegion: React.Dispatch<React.SetStateAction<any>>;
  region: any;
  projectId: string | undefined;
  isUpdate?: boolean;
  isBilling?: boolean;
};

const { height } = Dimensions.get('window');

export default function BillingModal({
  isModalVisible,
  setIsModalVisible,
  setFormattedAddress,
  projectId,
  region,
  setRegion,
  isUpdate = false,
  isBilling = false,
}: BillingModalType) {
  const [scrollOffSet, setScrollOffSet] = useState<number | undefined>(undefined);
  const [billingState, setBillingState] = useState({
    billingAddress: '',
    errorBilling: '',
    kelurahan: '',
    errorKelurahan: '',
    kecamatan: '',
    errorKecamatan: '',
    kabupaten: '', // kota
  });

  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const nameAddress = React.useMemo(() => {
    const idx = region?.formattedAddress?.split(',');
    if (idx?.length > 1) {
      return idx?.[0];
    }

    return 'Nama Alamat';
  }, [region?.formattedAddress]);

  const inputsData: Input[] = useMemo(
    () => [
      {
        label: 'Kelurahan',
        isRequire: false,
        type: 'textInput',
        placeholder: 'Masukkan kelurahan',
        onChange: (text: string) => {
          setBillingState(prevState => ({
            ...prevState,
            kelurahan: text.nativeEvent.text,
          }));
        },
        value: billingState.kelurahan,
      },
      {
        label: 'Kecamatan',
        isRequire: false,
        type: 'textInput',
        placeholder: 'Masukkan kecamatan',
        onChange: (text: string) => {
          setBillingState(prevState => ({
            ...prevState,
            kecamatan: text.nativeEvent.text,
          }));
        },
        value: billingState.kecamatan,
      },
      {
        label: 'Kota / Kabupaten',
        isRequire: false,
        type: 'textInput',
        placeholder: 'Masukkan kota',
        onChange: (text: string) => {
          setBillingState(prevState => ({
            ...prevState,
            kabupaten: text.nativeEvent.text,
          }));
        },
        value: billingState.kabupaten,
      },
    ],
    [billingState]
  );

  const onPressAddAddress = async () => {
    const body: Address = {};

    if (region?.postalId) {
      body.postalid = region.postalId;
    }
    if (region?.longitude) {
      body.lon = region.longitude;
    }
    if (region?.latitude) {
      body.lat = region.latitude;
    }
    if (region?.formattedAddress) {
      body.line1 = region?.formattedAddress;
    }

    if (billingState.kelurahan) {
      body.line2 =
        body.line2 !== undefined
          ? `${body.line2} ${billingState.kelurahan}`
          : billingState.kelurahan;
    }

    if (billingState.kecamatan) {
      body.line2 =
        body.line2 !== undefined
          ? `${body.line2} ${billingState.kecamatan}`
          : billingState.kecamatan;
    }
    if (billingState.kabupaten) {
      body.line2 =
        body.line2 !== undefined
          ? `${body.line2} ${billingState.kabupaten}`
          : billingState.kabupaten;
    }
    try {
      let response;
      if (isBilling) {
        response = await updateBillingAddress(projectId, body);
      } else {
        response = await updateLocationAddress(projectId, body);
      }
      if (response?.data?.success) {
        setFormattedAddress(region.formattedAddress);
        setRegion(region);
        setIsModalVisible(curr => !curr);
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpText: 'Update alamat berhasil',
            outsideClickClosePopUp: true,
          })
        );
      }
    } catch (error) {
      setIsModalVisible(false);
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText:
            error.message ||
            `Terjadi error saat update alamat ${isBilling ? 'pembayaran' : 'proyek'}`,
          outsideClickClosePopUp: true,
        })
      );
    }
  };

  return (
    <Modal
      hideModalContentWhileAnimating
      backdropOpacity={0.3}
      isVisible={isModalVisible}
      onBackButtonPress={() => {
        setIsModalVisible(curr => !curr);
      }}
      scrollOffset={scrollOffSet}
      scrollOffsetMax={resScale(400) - resScale(190)}
      propagateSwipe
      style={styles.modal}>
      <View style={styles.modalContent}>
        <BContainer>
          <View style={styles.modalHeader}>
            <Text style={styles.headerText} numberOfLines={1}>
              {(isUpdate ? 'Ubah' : 'Tambah') +
                (isBilling ? ' Alamat Penagihan' : ' Alamat Proyek')}
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(curr => !curr)}>
              <MaterialCommunityIcons name="close" size={30} color="#000000" />
            </TouchableOpacity>
          </View>
          <BSpacer size="extraSmall" />
          <ScrollView
            onScroll={event => {
              setScrollOffSet(event.nativeEvent.contentOffset.y);
            }}>
            <BLabel
              bold="500"
              label={isBilling ? 'Alamat Penagihan' : 'Alamat Proyek'}
              isRequired
            />
            <BSpacer size="verySmall" />
            <TouchableOpacity
              style={styles.searchAddress}
              onPress={() => {
                setIsModalVisible(false);
                navigation.navigate(SEARCH_AREA, {
                  from: CUSTOMER_DETAIL,
                  eventKey: 'getCoordinateFromCustomerDetail',
                  sourceType: isBilling ? 'billing' : 'project',
                });
              }}>
              <View>
                <Icons name="map-pin" size={resScale(20)} color={colors.primary} />
              </View>
              <View style={styles.selectedAddress}>
                <>
                  <BLabel bold="500" label={nameAddress} />
                  <BSpacer size="verySmall" />
                  <BText bold="300">{region?.formattedAddress || 'Detail Alamat'}</BText>
                </>
              </View>
            </TouchableOpacity>
            <BSpacer size="extraSmall" />
            <BForm titleBold="500" inputs={inputsData} />
          </ScrollView>
          <BButtonPrimary
            disable={region === null}
            onPress={onPressAddAddress}
            title={`${isUpdate ? 'Ubah' : 'Tambah'} Alamat`}
          />
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
    height: height / 1.6,
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
  searchAddress: {
    flexDirection: 'row',
    paddingVertical: layout.pad.md,
    backgroundColor: colors.border.disabled,
    borderRadius: layout.radius.sm,
    paddingHorizontal: layout.pad.ml,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedAddress: { paddingStart: layout.pad.ml, flex: 1 },
});
