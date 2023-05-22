import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useMemo, useState } from 'react';
import Modal from 'react-native-modal';
import { resScale } from '@/utils';
import { colors, fonts, layout } from '@/constants';
import {
  BButtonPrimary,
  BContainer,
  BForm,
  BLabel,
  BSpacer,
  BText,
} from '@/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Address, Input } from '@/interfaces';
import { SEARCH_AREA, CUSTOMER_DETAIL_V1 } from '@/navigation/ScreenNames';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import Icons from 'react-native-vector-icons/Feather';
import { updateCustomerBillingAddress } from '@/actions/CommonActions';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';

type BillingModalType = {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFormattedAddress: React.Dispatch<React.SetStateAction<any>>;
  setRegion: React.Dispatch<React.SetStateAction<any>>;
  region: any;
  customerId: string | undefined;
  isUpdate?: boolean;
};

const { height } = Dimensions.get('window');

export default function BillingModal({
  isModalVisible,
  setIsModalVisible,
  setFormattedAddress,
  customerId,
  region,
  setRegion,
  isUpdate = false,
}: BillingModalType) {
  const [scrollOffSet, setScrollOffSet] = useState<number | undefined>(
    undefined
  );
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
    const address = region?.formattedAddress
      ? region?.formattedAddress
      : region?.line1;
    const idx = address && address.split(',');
    if (idx?.length >= 1) {
      return idx?.[0];
    }

    return 'Nama Alamat';
  }, [region?.line1]);

  const inputsData: Input[] = useMemo(() => {
    return [
      {
        label: 'Kelurahan',
        isRequire: false,
        type: 'textInput',
        placeholder: 'Masukkan kelurahan',
        onChange: (text: string) => {
          setBillingState((prevState) => ({
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
          setBillingState((prevState) => ({
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
          setBillingState((prevState) => ({
            ...prevState,
            kabupaten: text.nativeEvent.text,
          }));
        },
        value: billingState.kabupaten,
      },
    ];
  }, [billingState]);

  const onPressAddAddress = async () => {
    try {
      let body: Address = {};
      let popUpLoadingText = isUpdate
        ? 'Mengubah Alamat'
        : 'Menambahkan Alamat';
      dispatch(
        openPopUp({
          popUpType: 'loading',
          popUpText: popUpLoadingText,
          outsideClickClosePopUp: false,
        })
      );

      if (region?.postalId) {
        body.postalId = region.postalId;
      } else {
        body.postalId = region.Postal;
      }
      if (region?.longitude) {
        body.lon = region.longitude;
      } else {
        body.lon = region.lon;
      }
      if (region?.latitude) {
        body.lat = region.latitude;
      } else {
        body.lat = region.lat;
      }
      if (region?.formattedAddress) {
        body.line1 = region?.formattedAddress;
      } else {
        body.line1 = region?.line1;
      }

      if (billingState.kelurahan) {
        body.line2 =
          body.line2 !== undefined
            ? body.line2 + ' ' + billingState.kelurahan
            : billingState.kelurahan;
      }

      if (billingState.kecamatan) {
        body.line2 =
          body.line2 !== undefined
            ? body.line2 + ' ' + billingState.kecamatan
            : billingState.kecamatan;
      }
      if (billingState.kabupaten) {
        body.line2 =
          body.line2 !== undefined
            ? body.line2 + ' ' + billingState.kabupaten
            : billingState.kabupaten;
      }
      const response = await updateCustomerBillingAddress(customerId, body);
      if (response?.data?.success) {
        setFormattedAddress(region.formattedAddress);
        setRegion(region);
        setIsModalVisible((curr) => !curr);
        dispatch(closePopUp());
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpText: 'Update alamat penagihan berhasil',
            outsideClickClosePopUp: true,
          })
        );
      }
    } catch (error) {
      setIsModalVisible(false);
      dispatch(closePopUp());
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText:
            error.message || 'Terjadi error saat update alamat ' + 'Pembayaran',
          outsideClickClosePopUp: true,
        })
      );
    }
  };

  const onCloseModal = () => {
    setRegion(null);
    setIsModalVisible(false);
  };

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
              {(isUpdate ? 'Edit' : 'Tambah') + ' Alamat Penagihan'}
            </Text>
            <TouchableOpacity onPress={onCloseModal}>
              <MaterialCommunityIcons name="close" size={30} color="#000000" />
            </TouchableOpacity>
          </View>
          <BSpacer size={'extraSmall'} />
          <ScrollView
            onScroll={(event) => {
              setScrollOffSet(event.nativeEvent.contentOffset.y);
            }}
          >
            <BLabel bold="500" label="Alamat Penagihan" isRequired />
            <BSpacer size="verySmall" />
            <TouchableOpacity
              style={styles.searchAddress}
              onPress={() => {
                setIsModalVisible(false);
                navigation.navigate(SEARCH_AREA, {
                  from: CUSTOMER_DETAIL_V1,
                  eventKey: 'getCoordinateFromCustomerDetail',
                  sourceType: 'billing',
                });
              }}
            >
              <View>
                <Icons
                  name="map-pin"
                  size={resScale(20)}
                  color={colors.primary}
                />
              </View>
              <View style={styles.selectedAddress}>
                <>
                  <BLabel bold="500" label={nameAddress!} />
                  <BSpacer size="verySmall" />
                  <BText bold="300">
                    {region?.line1
                      ? region?.line1
                      : region?.formattedAddress
                      ? region?.formattedAddress
                      : 'Detail Alamat'}
                  </BText>
                </>
              </View>
            </TouchableOpacity>
            <BSpacer size="extraSmall" />
            <BForm titleBold="500" inputs={inputsData} />
          </ScrollView>
          <BButtonPrimary
            disable={!isUpdate && region?.longitude === null}
            onPress={onPressAddAddress}
            title={(isUpdate ? 'Edit' : 'Tambah') + ' Alamat'}
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
