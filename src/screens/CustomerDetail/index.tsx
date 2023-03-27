import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { colors, fonts } from '@/constants';
import {
  BContainer,
  BPic,
  BSpacer,
  BSpinner,
  BTouchableText,
} from '@/components';
import ProjectBetween from './elements/ProjectBetween';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import BillingModal from './elements/BillingModal';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  CUSTOMER_DETAIL,
  DOCUMENTS,
  VISIT_HISTORY,
} from '@/navigation/ScreenNames';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  getProjectDetail,
  getProjectIndivualDetail,
} from '@/actions/CommonActions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { resetRegion } from '@/redux/reducers/locationReducer';
import { RootStackParamList } from '@/navigation/CustomStateComponent';
import { ProjectDetail, visitationListResponse } from '@/interfaces';
import DocumentWarning from './elements/DocumentWarning';
import UpdatedAddressWrapper from './elements/UpdatedAddressWrapper';
import AddNewAddressWrapper from './elements/AddNewAddressWrapper';

type CustomerDetailRoute = RouteProp<RootStackParamList['CUSTOMER_DETAIL']>;

export default function CustomerDetail() {
  const route = useRoute<CustomerDetailRoute>();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [isBillingVisible, setIsBillingVisible] = useState(false);
  const [isCompany, setCompany] = useState(false);
  const [customerData, setCustomerData] = useState<ProjectDetail>({});
  const [address, setFormattedAddress] = useState('');
  const [region, setRegion] = useState(null);
  const [regionExisting, setExistingRegion] = useState(null);
  const [existedVisitation, setExistingVisitation] =
    useState<visitationListResponse>(null);
  const dataNotLoadedYet = JSON.stringify(customerData) === '{}';
  const documentsNotCompleted = customerData?.docs?.length !== 8;
  const updatedAddress = address?.length > 0;
  const getCompanyDetail = useCallback(
    async (companyId?: string) => {
      try {
        const response = await getProjectDetail(companyId);
        setCustomerData(response.data[0]);
        console.log('iniii diaaa 1: ', JSON.stringify(response.data[0]));
        if (response.data && response.data.length > 0) {
          let region: any = {
            formattedAddress: response.data[0].billingAddress?.line1,
            latitude: response.data[0].billingAddress?.lat,
            longitude: response.data[0].billingAddress?.lon,
          };
          setExistingRegion(region);
          setFormattedAddress(response.data[0].billingAddres?.line1);
        }
      } catch (error) {
        dispatch(
          openPopUp({
            popUpType: 'error',
            highlightedText: 'Error',
            popUpText: 'Error fetching project detail',
            outsideClickClosePopUp: true,
          })
        );
      }
    },
    [dispatch]
  );

  const getProjectIndividual = useCallback(
    async (projectId: string) => {
      try {
        const response = await getProjectIndivualDetail(projectId);
        setCustomerData(response.data);
        console.log('iniii diaaa 2: ', JSON.stringify(response.data));
        if (response.data) {
          let region: any = {
            formattedAddress: response.data.billingAddress?.line1,
            latitude: response.data.billingAddress?.lat,
            longitude: response.data.billingAddress?.lon,
          };
          setExistingRegion(region);
          setFormattedAddress(response.data.billingAddress?.line1);
        }
      } catch (error) {
        dispatch(
          openPopUp({
            popUpType: 'error',
            highlightedText: 'Error',
            popUpText: 'Error fetching visitation Data',
            outsideClickClosePopUp: true,
          })
        );
      }
    },
    [dispatch]
  );
  React.useEffect(() => {
    crashlytics().log(CUSTOMER_DETAIL);
    dispatch(resetRegion());
    if (route?.params) {
      const { existingVisitation } = route.params;
      setExistingVisitation(existingVisitation);
      if (existingVisitation.project.companyId !== null) {
        const { id } = existingVisitation.project.companyId;
        setCompany(true);
        getCompanyDetail(id);
      } else {
        const { id } = existingVisitation.project;
        setCompany(false);
        getProjectIndividual(id);
      }
    }
  }, [dispatch, getCompanyDetail, getProjectIndividual, route.params]);

  useFocusEffect(
    useCallback(() => {
      if (existedVisitation !== null) {
        if (existedVisitation.project.company !== null) {
          const id = existedVisitation?.project?.company?.id;
          getCompanyDetail(id);
        } else {
          const id = existedVisitation?.project?.id;
          getProjectIndividual(id);
        }
      }
    }, [existedVisitation, getCompanyDetail, getProjectIndividual])
  );

  useEffect(() => {
    DeviceEventEmitter.addListener(
      'getCoordinateFromCustomerDetail',
      (data) => {
        setRegion(data.coordinate);
        setIsBillingVisible(true);
      }
    );
  }, [setIsBillingVisible]);

  const [filledDocsCount] = useMemo((): number[] => {
    let count = 0;
    let totalProperties = 8;

    for (const key in customerData.docs) {
      totalProperties++;
      if (Object.prototype.hasOwnProperty.call(customerData.docs, key)) {
        if (customerData.docs[key]) {
          count++;
        }
      }
    }

    return [count, totalProperties];
  }, [customerData.docs]);

  if (dataNotLoadedYet) {
    return (
      <View style={styles.loading}>
        <BSpinner size="large" />
      </View>
    );
  }

  return (
    <>
      {isBillingVisible && (
        <BillingModal
          setFormattedAddress={setFormattedAddress}
          setIsModalVisible={setIsBillingVisible}
          isModalVisible={isBillingVisible}
          region={region || regionExisting}
          isUpdate={address !== undefined && address !== '' ? true : false}
          setRegion={setRegion}
          projectId={customerData.id}
        />
      )}

      {documentsNotCompleted && (
        <DocumentWarning docs={customerData.docs} projectId={customerData.id} />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <BContainer>
          <Text style={styles.partText}>Pelanggan</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW300}>Nama</Text>
            <Text style={styles.fontW400}>
              {isCompany
                ? customerData?.Company?.name
                : customerData?.mainPic?.name}
            </Text>
          </View>
          <BSpacer size={'small'} />
          <Text style={styles.partText}>Proyek</Text>
          <BSpacer size={'extraSmall'} />
          <ProjectBetween
            onPress={() => {
              navigation.navigate(VISIT_HISTORY, {
                projectId: customerData?.id,
                projectName: customerData?.name,
              });
            }}
            projects={{
              id: customerData?.id,
              name: customerData?.name,
            }}
          />
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.partText}>PIC</Text>
            {/* <TouchableOpacity>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity> */}
          </View>
          <BSpacer size={'extraSmall'} />
          <BPic
            name={customerData?.mainPic?.name}
            email={customerData?.mainPic?.email}
            phone={customerData?.mainPic?.phone}
            position={customerData?.mainPic?.position}
          />
          <BSpacer size={'extraSmall'} />
          <Text style={styles.partText}>Alamat Penagihan</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.billingStyle}>
            {updatedAddress ? (
              <UpdatedAddressWrapper
                onPress={() => setIsBillingVisible(true)}
                address={address}
              />
            ) : (
              <AddNewAddressWrapper onPress={() => setIsBillingVisible(true)} />
            )}
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.partText}>Dokumen</Text>
            <BTouchableText
              title="Lihat Semua"
              textStyle={styles.seeAllText}
              onPress={() =>
                navigation.navigate(DOCUMENTS, {
                  docs: customerData.docs,
                  projectId: customerData.id,
                })
              }
            />
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW300}>Kelengkapan Dokumen</Text>
            <Text
              style={styles.fontW300}
            >{`${customerData?.docs?.length}/8`}</Text>
          </View>
          <ProgressBar
            styleAttr="Horizontal"
            indeterminate={false}
            progress={filledDocsCount / 8 ? filledDocsCount / 8 : 0}
            color={colors.primary}
          />
        </BContainer>
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

  fontW300: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[300],
    fontSize: fonts.size.md,
  },
  fontW400: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
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
});
