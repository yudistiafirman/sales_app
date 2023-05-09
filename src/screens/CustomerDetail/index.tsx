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
  getProjectIndivualDetail,
  projectGetOneById,
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
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatIcon from 'react-native-vector-icons/Feather';
import CustomerDetailLoader from './elements/CustomerDetailLoader';
import SvgNames from '@/components/atoms/BSvg/svgName';
import RemainingAmountBox from './elements/RemainAmountBox';

type CustomerDetailRoute = RouteProp<RootStackParamList['CUSTOMER_DETAIL']>;

export default function CustomerDetail() {
  const route = useRoute<CustomerDetailRoute>();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [isBillingLocationVisible, setIsBillingLocationVisible] =
    useState(false);
  const [isProjectLocationVisible, setIsProjectLocationVisible] =
    useState(false);
  const [customerData, setCustomerData] = useState<ProjectDetail>({});
  const [billingAddress, setFormattedBillingAddress] = useState('');
  const [projectAddress, setFormattedProjectAddress] = useState('');
  const [region, setRegion] = useState(null);
  const [project, setProject] = useState(null);
  const [regionExisting, setExistingRegion] = useState(null);
  const [projectExisting, setExistingProject] = useState(null);
  const [existedVisitation, setExistingVisitation] =
    useState<visitationListResponse>(null);
  const dataNotLoadedYet = JSON.stringify(customerData) === '{}';
  const documentsNotCompleted = customerData?.ProjectDocs?.length !== 8;
  const updatedAddressBilling = billingAddress?.length > 0;
  const updateAddressProject = projectAddress?.length > 0;
  const getProjectDetail = useCallback(
    async (projectId: string) => {
      try {
        const response = await projectGetOneById(projectId);
        setCustomerData(response.data.data);
        if (response.data.data) {
          let regionBilling: any = {
            formattedAddress: response.data.data.BillingAddress?.line1,
            latitude: response.data.data.BillingAddress?.lat,
            longitude: response.data.data.BillingAddress?.lon,
          };
          let regionProject: any = {
            formattedAddress: response.data.data.LocationAddress?.line1,
            latitude: response.data.data.LocationAddress?.lat,
            longitude: response.data.data.LocationAddress?.lon,
          };
          setExistingRegion(regionBilling);
          setExistingProject(regionProject);
          setFormattedBillingAddress(response.data.data.BillingAddress?.line1);
          setFormattedProjectAddress(response.data.data.LocationAddress?.line1);
        }
      } catch (error) {
        console.log(error.message);
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
        if (response.data) {
          let regionBilling: any = {
            formattedAddress: response.data.BillingAddress?.line1,
            latitude: response.data.BillingAddress?.lat,
            longitude: response.data.BillingAddress?.lon,
          };
          let regionProject: any = {
            formattedAddress: response.data.LocationAddress?.line1,
            latitude: response.data.LocationAddress?.lat,
            longitude: response.data.LocationAddress?.lon,
          };
          setExistingRegion(regionBilling);
          setExistingProject(regionProject);
          setFormattedBillingAddress(response.data.data.BillingAddress?.line1);
          setFormattedProjectAddress(response.data.data.LocationAddress?.line1);
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
      const { id } = existingVisitation.project;
      getProjectDetail(id);
    }
  }, [dispatch, getProjectDetail, getProjectIndividual, route.params]);

  useFocusEffect(
    useCallback(() => {
      if (existedVisitation !== null) {
        const { id } = existedVisitation?.project;
        getProjectDetail(id);
      }
    }, [existedVisitation, getProjectDetail, getProjectIndividual])
  );

  useEffect(() => {
    DeviceEventEmitter.addListener(
      'getCoordinateFromCustomerDetail',
      (data) => {
        if (data.sourceType === 'billing') {
          setRegion(data.coordinate);
          setIsBillingLocationVisible(true);
        } else {
          setProject(data.coordinate);
          setIsProjectLocationVisible(true);
        }
      }
    );
  }, [setIsBillingLocationVisible, setIsProjectLocationVisible]);

  const [filledDocsCount] = useMemo((): number[] => {
    let count = 0;
    let totalProperties = 8;

    for (const key in customerData?.ProjectDocs) {
      totalProperties++;
      if (Object.prototype.hasOwnProperty.call(customerData.ProjectDocs, key)) {
        if (customerData?.ProjectDocs[key]) {
          count++;
        }
      }
    }

    return [count, totalProperties];
  }, [customerData.ProjectDocs]);

  if (dataNotLoadedYet) {
    return <CustomerDetailLoader />;
  }

  return (
    <>
      {isBillingLocationVisible && (
        <BillingModal
          isBilling
          setFormattedAddress={setFormattedBillingAddress}
          setIsModalVisible={setIsBillingLocationVisible}
          isModalVisible={isBillingLocationVisible}
          region={region || regionExisting}
          isUpdate={
            billingAddress !== undefined && billingAddress !== '' ? true : false
          }
          setRegion={setRegion}
          projectId={customerData.id}
        />
      )}
      {isProjectLocationVisible && (
        <BillingModal
          isBilling={false}
          setFormattedAddress={setFormattedProjectAddress}
          setIsModalVisible={setIsProjectLocationVisible}
          isModalVisible={isProjectLocationVisible}
          region={project || projectExisting}
          isUpdate={
            projectAddress !== undefined && projectAddress !== '' ? true : false
          }
          setRegion={setProject}
          projectId={customerData.id}
        />
      )}

      <DocumentWarning docs={[]} projectId="123456" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <BContainer>
          <View style={styles.between}>
            <Text style={styles.fontW400}>Nama</Text>
            <Text style={styles.fontW500}>Pt.Coba</Text>
          </View>
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>No. NPWP</Text>
            <Text style={styles.fontW500}>09.223.828-3.119.000</Text>
          </View>
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>No. KTP</Text>
            <Text style={styles.fontW500}>09.223.828-3.119.000</Text>
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
            name="Ada"
            email="Jajang@gmail.com"
            phone="08122089655"
            position="Supervisor"
          />
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>Alamat Penagihan</Text>
            <BTouchableText
              startIcon={
                <FeatIcon
                  name="edit"
                  style={{ marginRight: layout.pad.xs }}
                  color={colors.danger}
                />
              }
              onPress={() => setIsBillingLocationVisible(true)}
              textStyle={styles.touchableText}
              title="Ubah"
            />
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={styles.billingStyle}>
            <UpdatedAddressWrapper address="Jalan Bendi Besar No.36" />
          </View>
          <BSpacer size={'middleSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW400}>Dompet</Text>
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <RemainingAmountBox title="Sisa Deposit" firstAmount={24000200} />
            <BSpacer size={'extraSmall'} />
            <RemainingAmountBox
              title="Sisa Deposit"
              firstAmount={32800200}
              secondAmount={150000000}
            />
          </View>
        </BContainer>
        <View style={styles.projectListContainer}>
          <BContainer>
            <Text style={styles.fontW400}>Proyek</Text>
            <BSpacer size="extraSmall" />
            <BVisitationCard
              nameSize={fonts.size.sm}
              locationTextColor={colors.text.lightGray}
              item={{
                name: 'Project Firman',
                location: 'jalan bendi besar no 36 A',
              }}
            />
            <BSpacer size="extraSmall" />
            <BVisitationCard
              nameSize={fonts.size.sm}
              locationTextColor={colors.text.lightGray}
              item={{
                name: 'Project Firman',
                location: 'jalan bendi besar no 36 A',
              }}
            />
          </BContainer>
        </View>
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
    fontSize: fonts.size.xs,
    margin: 0,
  },
  chipText: {
    fontSize: fonts.size.xs,
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
    fontSize: fonts.size.sm,
  },
  fontW500: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
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
