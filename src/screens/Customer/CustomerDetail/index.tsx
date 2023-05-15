import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { colors, fonts, layout } from '@/constants';
import {
  BChip,
  BContainer,
  BPic,
  BSpacer,
  BSpinner,
  BSvg,
  BTouchableText,
  BVisitationCard,
  BottomSheetAddPIC,
} from '@/components';
import ProjectBetween from './elements/ProjectBetween';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import BillingModal from './elements/BillingModal';
import crashlytics from '@react-native-firebase/crashlytics';

import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { getOneCustomer, updateCustomer } from '@/actions/CommonActions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { resetRegion } from '@/redux/reducers/locationReducer';
import { RootStackParamList } from '@/navigation/CustomStateComponent';
import { PIC, ProjectDetail, visitationListResponse } from '@/interfaces';
import DocumentWarning from './elements/DocumentWarning';
import UpdatedAddressWrapper from './elements/UpdatedAddressWrapper';
import AddNewAddressWrapper from './elements/AddNewAddressWrapper';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatIcon from 'react-native-vector-icons/Feather';
import CustomerDetailLoader from './elements/CustomerDetailLoader';
import SvgNames from '@/components/atoms/BSvg/svgName';
import RemainingAmountBox from './elements/RemainAmountBox';
import { ICustomerDetail } from '@/models/Customer';

type CustomerDetailRoute = RouteProp<
  RootStackParamList['CUSTOMER_CUSTOMER_DETAIL']
>;

export default function CustomerDetail() {
  const route = useRoute<CustomerDetailRoute>();
  const { id } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [isBillingLocationVisible, setIsBillingLocationVisible] =
    useState(false);
  const [isProjectLocationVisible, setIsProjectLocationVisible] =
    useState(false);
  const [customerData, setCustomerData] = useState<ICustomerDetail>({});
  const [isVisibleModalPic, setIsVisibleModalPic] = useState(false);
  const [billingAddress, setFormattedBillingAddress] = useState('');
  const [projectAddress, setFormattedProjectAddress] = useState('');
  const [region, setRegion] = useState(null);
  const [updatedBilling, setUpdatedBilling] = useState(null);
  const [regionExisting, setExistingRegion] = useState(null);

  const dataNotLoadedYet = JSON.stringify(customerData) === '{}';
  const updatedAddressBilling = billingAddress?.length > 0;

  const getCustomerDetail = useCallback(async () => {
    try {
      const response = await getOneCustomer(id);
      setCustomerData(response.data.data);
    } catch (error) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          highlightedText: 'Error',
          popUpText: error.message
            ? error.message
            : 'Error Saat Mengambil Data Customer detail',
          outsideClickClosePopUp: true,
        })
      );
    }
  }, []);

  useEffect(() => {
    getCustomerDetail();
  }, []);

  useEffect(() => {
    DeviceEventEmitter.addListener(
      'getCoordinateFromCustomerDetail',
      (data) => {
        setUpdatedBilling(data.coordinate);
        setIsBillingLocationVisible(true);
      }
    );
  }, [setIsBillingLocationVisible, setIsProjectLocationVisible]);

  const onChangePic = async (data: PIC) => {
    try {
      dispatch(
        openPopUp({
          popUpType: 'loading',
          popUpText: 'Update PIC',
          outsideClickClosePopUp: false,
        })
      );

      const payload = {};
      payload.pic = data;
      const response = await updateCustomer(id, payload);
      if (response.data.success) {
        dispatch(
          openPopUp({
            popUpType: 'success',
            popUpText: 'Berhasil Update PIC',
            outsideClickClosePopUp: true,
          })
        );
        setIsVisibleModalPic(false);
        getCustomerDetail();
      }
    } catch (error) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          highlightedText: 'Error',
          popUpText: error.message
            ? error.message
            : 'Error Saat Update Customer PIC',
          outsideClickClosePopUp: true,
        })
      );
    }
  };

  if (dataNotLoadedYet) {
    return <CustomerDetailLoader />;
  }

  return (
    <>
      <BillingModal
        setFormattedAddress={setFormattedBillingAddress}
        setIsModalVisible={setIsBillingLocationVisible}
        isModalVisible={isBillingLocationVisible}
        region={updatedBilling || customerData?.BillingAddress}
        isUpdate={customerData?.BillingAddress?.line1 !== null}
        setRegion={setUpdatedBilling}
        customerId={id}
      />
      <BottomSheetAddPIC
        isVisible={isVisibleModalPic}
        onClose={() => setIsVisibleModalPic(false)}
        addPic={onChangePic}
        modalTitle="Ubah PIC"
        buttonTitle="Ubah PIC"
      />

      <DocumentWarning docs={[]} projectId="123456" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <BContainer>
          <View style={styles.between}>
            <Text style={styles.fontW400}>Nama</Text>
            <Text style={styles.fontW500}>{customerData?.displayName}</Text>
          </View>
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>No. NPWP</Text>
            <Text style={styles.fontW500}>{customerData?.npwp}</Text>
          </View>
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>No. KTP</Text>
            <Text style={styles.fontW500}>{customerData?.nik}</Text>
          </View>
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ ...styles.fontW400, marginRight: layout.pad.md }}>
                Dokumen Legalitas
              </Text>
              <BChip
                endIcon={
                  <BSvg
                    svgName={SvgNames.IC_EXCLA_CERT}
                    width={layout.pad.ml}
                    height={layout.pad.ml}
                    style={{ marginLeft: layout.pad.sm }}
                    type="fill"
                    color={colors.white}
                  />
                }
                backgroundColor={colors.danger}
              >
                <Text style={styles.chipText}>0/1</Text>
              </BChip>
              <BChip
                endIcon={
                  <BSvg
                    svgName={SvgNames.IC_CHECK_CERT}
                    width={layout.pad.ml}
                    style={{ marginLeft: layout.pad.sm }}
                    height={layout.pad.ml}
                    type="fill"
                    color={colors.white}
                  />
                }
                backgroundColor={colors.greenLantern}
              >
                <Text style={styles.chipText}>0/1</Text>
              </BChip>
            </View>

            <BTouchableText
              startIcon={
                <AntIcon
                  name="search1"
                  style={{ marginRight: layout.pad.xs }}
                  color={colors.danger}
                />
              }
              textStyle={styles.touchableText}
              title="Lihat Semua"
            />
          </View>

          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>PIC Penagihan</Text>
            <BTouchableText
              onPress={() => setIsVisibleModalPic(true)}
              startIcon={
                <FeatIcon
                  name="edit"
                  style={{ marginRight: layout.pad.xs }}
                  color={colors.danger}
                />
              }
              textStyle={styles.touchableText}
              title="Ubah"
            />
          </View>

          <BSpacer size={'extraSmall'} />
          <BPic
            name={customerData?.Pic?.name}
            email={customerData?.Pic?.email}
            phone={customerData?.Pic?.phone}
            position={customerData?.Pic?.position}
          />
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>Alamat Penagihan</Text>
            <BTouchableText
              startIcon={
                <FeatIcon
                  name={customerData?.BillingAddress?.line1 ? 'edit' : 'plus'}
                  style={{ marginRight: layout.pad.xs }}
                  color={colors.danger}
                />
              }
              onPress={() => setIsBillingLocationVisible(true)}
              textStyle={styles.touchableText}
              title={customerData?.BillingAddress?.line1 ? 'Ubah' : 'Tambah'}
            />
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={styles.billingStyle}>
            <UpdatedAddressWrapper
              address={customerData?.BillingAddress?.line1}
            />
          </View>
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>Dompet</Text>
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <RemainingAmountBox
              title="Sisa Deposit"
              firstAmount={customerData?.CustomerDeposit?.availableDeposit}
            />
          </View>
        </BContainer>
        {customerData?.Projects.length > 0 && (
          <View style={styles.projectListContainer}>
            <BContainer>
              <Text style={styles.fontW400}>Proyek</Text>
              <BSpacer size="extraSmall" />
              {customerData?.Projects.map((v, i) => {
                const name = v.displayName;
                const location = v.locationAddress?.line1;
                return (
                  <React.Fragment key={v.id}>
                    <BVisitationCard
                      isRenderIcon={false}
                      nameSize={fonts.size.xs}
                      locationTextColor={colors.text.lightGray}
                      item={{
                        name: v.name ? v.name : '',
                        location: v?.ShippingAddress?.line1
                          ? v?.ShippingAddress?.line1
                          : v?.ShippingAddress?.line2,
                      }}
                    />
                    <BSpacer size="extraSmall" />
                  </React.Fragment>
                );
              })}
            </BContainer>
          </View>
        )}
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchableText: {
    color: colors.danger,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.vs,
    margin: 0,
  },
  chipText: {
    fontSize: fonts.size.vs,
    color: colors.offWhite,
    fontFamily: fonts.family.montserrat[400],
  },

  fontW300: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.xs,
  },
  fontW400: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.xs,
  },
  fontW500: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.xs,
  },
  billingStyle: {
    alignItems: 'center',
  },

  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  seeAllText: {
    color: colors.primary,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
  },
  projectListContainer: {
    backgroundColor: colors.tertiary,
    borderTopStartRadius: layout.radius.lg,
    borderTopEndRadius: layout.radius.lg,
  },
});
