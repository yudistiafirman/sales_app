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
        console.log('inii diaaa', data)
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
    return (
      <View style={styles.loading}>
        <BSpinner size="large" />
      </View>
    );
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

      {documentsNotCompleted && (
        <DocumentWarning
          docs={customerData.ProjectDocs}
          projectId={customerData.id}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <BContainer>
          <Text style={styles.partText}>Pelanggan</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW300}>Nama</Text>
            <Text style={styles.fontW400}>{customerData?.displayName}</Text>
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
            name={customerData?.Pic?.name}
            email={customerData?.Pic?.email}
            phone={customerData?.Pic?.phone}
            position={customerData?.Pic?.position}
          />
          <BSpacer size={'extraSmall'} />
          <Text style={styles.partText}>Alamat Penagihan</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.billingStyle}>
            {updatedAddressBilling ? (
              <UpdatedAddressWrapper
                onPress={() => setIsBillingLocationVisible(true)}
                address={billingAddress}
              />
            ) : (
              <AddNewAddressWrapper
                isBilling
                onPress={() => setIsBillingLocationVisible(true)}
              />
            )}
          </View>
          <BSpacer size={'small'} />
          <Text style={styles.partText}>Alamat Proyek</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.billingStyle}>
            {updateAddressProject ? (
              <UpdatedAddressWrapper
                onPress={() => setIsProjectLocationVisible(true)}
                address={projectAddress}
              />
            ) : (
              <AddNewAddressWrapper
                isBilling={false}
                onPress={() => setIsProjectLocationVisible(true)}
              />
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
                  docs: customerData.ProjectDocs,
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
            >{`${customerData?.ProjectDocs?.length}/8`}</Text>
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
