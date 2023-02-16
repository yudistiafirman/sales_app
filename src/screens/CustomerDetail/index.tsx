import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { colors, fonts, layout } from '@/constants';
import { BContainer, BPic, BSpacer, BSpinner, BText } from '@/components';
import { resScale } from '@/utils';
import ProjectBetween from './elements/ProjectBetween';
import Octicons from 'react-native-vector-icons/Octicons';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import BillingModal from './elements/BillingModal';
import crashlytics from '@react-native-firebase/crashlytics';
import { CUSTOMER_DETAIL, DOCUMENTS } from '@/navigation/ScreenNames';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  getProjectDetail,
  getProjectIndivualDetail,
} from '@/actions/CommonActions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { openPopUp } from '@/redux/reducers/modalReducer';
import { resetRegion, updateRegion } from '@/redux/reducers/locationReducer';
import font from '@/constants/fonts';

export default function CustomerDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [isBillingVisible, setIsBillingVisible] = useState(false);
  const [isCompany, setCompany] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setFormattedAddress] = useState('');
  const [region, setRegion] = useState(null);
  const [existingVisitation, setExistingVisitation] = useState(null);
  const projectDocs = isCompany ? customerData[0]?.docs : customerData.docs;

  React.useEffect(() => {
    crashlytics().log(CUSTOMER_DETAIL);
    dispatch(resetRegion());
    if (route?.params) {
      const { existingVisitation } = route.params;
      setExistingVisitation(existingVisitation);
      if (existingVisitation.project.company !== null) {
        const { id } = existingVisitation.project.company;
        setCompany(true);
        getCompanyDetail(id);
      } else {
        const { id } = existingVisitation.project;
        getProjectIndividual(id);
      }
    }
  }, [getCompanyDetail, getProjectIndividual, route.params]);

  useFocusEffect(
    useCallback(() => {
      if (existingVisitation !== null) {
        if (existingVisitation.project.company !== null) {
          const { id } = existingVisitation?.project.company;
          getCompanyDetail(id);
        } else {
          const { id } = existingVisitation?.project;
          getProjectIndividual(id);
        }
      }
    }, [existingVisitation, getCompanyDetail, getProjectIndividual])
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

  const getCompanyDetail = useCallback(
    async (companyId?: string) => {
      try {
        setLoading(true);
        const response = await getProjectDetail(companyId);
        setCustomerData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
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

  const getProjectIndividual = useCallback(
    async (projectId: string) => {
      try {
        setLoading(true);
        const response = await getProjectIndivualDetail(projectId);
        setCustomerData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
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
  const [filledDocsCount, totalDocsCount] = useMemo((): number[] => {
    let count = 0;
    let totalProperties = 8;

    for (const key in projectDocs) {
      totalProperties++;
      if (Object.prototype.hasOwnProperty.call(projectDocs, key)) {
        if (projectDocs[key]) {
          count++;
        }
      }
    }

    return [count, totalProperties];
  }, [projectDocs]);
  if (customerData.length === 0) {
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
          region={region}
          setRegion={setRegion}
          projectId={
            isCompany ? customerData[0].projectId : customerData.projectId
          }
        />
      )}

      {projectDocs.lenght !== 8 && (
        <View style={styles.labelWarning}>
          <Text style={styles.labelText}>
            Ada dokumen pelanggan yang belum dilengkapi.
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(DOCUMENTS, {
                docs: projectDocs,
                projectId: isCompany
                  ? customerData[0].projectId
                  : customerData.projectId,
              })
            }
            style={styles.outlineButton}
          >
            <Text style={styles.buttonText}>Lengkapi Dokumen</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <BContainer>
          <Text style={styles.partText}>Pelanggan</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW300}>Nama</Text>
            <Text style={styles.fontW400}>
              {isCompany
                ? customerData[0]?.company.name
                : customerData?.mainPic?.name}
            </Text>
          </View>
          <BSpacer size={'small'} />
          <Text style={styles.partText}>Proyek</Text>
          <BSpacer size={'extraSmall'} />
          <ProjectBetween
            projects={{
              id: isCompany
                ? customerData[0]?.projectId
                : customerData?.projectId,
              name: isCompany
                ? customerData[0]?.projectName
                : customerData?.projectName,
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
            name={
              isCompany
                ? customerData[0]?.mainPic?.name
                : customerData?.mainPic?.name
            }
            email={
              isCompany
                ? customerData[0]?.mainPic?.email
                : customerData?.mainPic?.email
            }
            phone={
              isCompany
                ? customerData[0]?.mainPic?.phone
                : customerData?.mainPic?.phone
            }
            position={
              isCompany
                ? customerData[0]?.mainPic?.position
                : customerData?.mainPic?.position
            }
          />
          <BSpacer size={'extraSmall'} />
          <Text style={styles.partText}>Alamat Penagihan</Text>
          <BSpacer size={'extraSmall'} />
          <View style={styles.billingStyle}>
            {address.length > 0 ? (
              <View
                style={{
                  height: resScale(93),
                  backgroundColor: colors.tertiary,
                  borderRadius: layout.radius.md,
                  width: '100%',
                }}
              >
                <View
                  style={{
                    flex: 1,
                    marginVertical: layout.pad.ml,
                    marginLeft: layout.pad.lg,
                  }}
                >
                  <BText
                    numberOfLines={1}
                    style={{
                      fontFamily: font.family.montserrat['500'],
                      fontSize: font.size.md,
                      color: colors.text.darker,
                      marginBottom: layout.pad.sm,
                    }}
                  >
                    {address.split(',')[0]}
                  </BText>
                  <BText
                    numberOfLines={1}
                    style={{
                      fontFamily: font.family.montserrat['300'],
                      fontSize: font.size.xs,
                      color: colors.text.darker,
                      marginBottom: layout.pad.md,
                    }}
                  >
                    {address}
                  </BText>
                  <TouchableOpacity
                    onPress={() => setIsBillingVisible(true)}
                    style={{
                      width: resScale(104),
                      height: resScale(24),
                      borderWidth: 1,
                      borderColor: colors.textInput.placeHolder,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: layout.radius.sm,
                    }}
                  >
                    <BText
                      style={{
                        fontFamily: font.family.montserrat['400'],
                        fontSize: font.size.sm,
                        color: colors.text.medium,
                      }}
                    >
                      Ubah Alamat
                    </BText>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addBilling}
                onPress={() => {
                  setIsBillingVisible((curr) => !curr);
                }}
              >
                <Octicons
                  name="plus"
                  color={colors.primary}
                  size={fonts.size.xs}
                  style={styles.plusStyle}
                />
                <Text style={styles.seeAllText}>Tambah Alamat Penagihan</Text>
              </TouchableOpacity>
            )}
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.partText}>Dokumen</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(DOCUMENTS, {
                  docs: projectDocs,
                  projectId: isCompany
                    ? customerData[0].projectId
                    : customerData.projectId,
                })
              }
            >
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <BSpacer size={'extraSmall'} />
          <View style={styles.between}>
            <Text style={styles.fontW300}>Kelengkapan Dokumen</Text>
            <Text style={styles.fontW300}>{`${projectDocs.length}/8`}</Text>
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
  labelWarning: {
    backgroundColor: colors.status.offYellow,
    paddingHorizontal: layout.pad.lg,
    paddingVertical: layout.pad.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    color: colors.text.secYellow,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.xs,
    flex: 0.9,
  },
  outlineButton: {
    borderColor: colors.primary,
    borderWidth: resScale(1),
    borderRadius: layout.radius.md,
    paddingVertical: layout.pad.sm,
    paddingHorizontal: layout.pad.md,
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.primary,
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.xs,
  },
  partText: {
    color: colors.text.darker,
    fontFamily: fonts.family.montserrat[600],
    fontSize: fonts.size.md,
  },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seeAllText: {
    color: colors.primary,
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.sm,
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
  addBilling: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusStyle: {
    marginRight: layout.pad.sm,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
