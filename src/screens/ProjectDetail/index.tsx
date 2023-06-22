import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    DeviceEventEmitter
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { colors, fonts, layout } from "@/constants";
import {
    BContainer,
    BPic,
    BSpacer,
    BSpinner,
    BTouchableText
} from "@/components";
import crashlytics from "@react-native-firebase/crashlytics";
import {
    CUSTOMER_DETAIL,
    PROJECT_DETAIL,
    VISIT_HISTORY
} from "@/navigation/ScreenNames";
import { useNavigation, useRoute } from "@react-navigation/native";
import { projectGetOneById } from "@/actions/CommonActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { resetRegion } from "@/redux/reducers/locationReducer";
import { ProjectDetail } from "@/interfaces";
import formatCurrency from "@/utils/formatCurrency";
import UpdatedAddressWrapper from "./elements/UpdatedAddressWrapper";
import AddNewAddressWrapper from "./elements/AddNewAddressWrapper";
import BillingModal from "./elements/BillingModal";
import ProjectBetween from "./elements/ProjectBetween";

const styles = StyleSheet.create({
    partText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[600],
        fontSize: fonts.size.md
    },
    between: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    fontW300: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[300],
        fontSize: fonts.size.md,
        flex: 1
    },
    fontW500: {
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.md,
        color: colors.text.darker,
        flex: 1
    },
    fontW400: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.md
    },
    billingStyle: {
        alignItems: "center"
    },
    loading: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
});

export default function ProjectDetailPage() {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const [isProjectLocationVisible, setIsProjectLocationVisible] =
        useState(false);
    const [customerData, setCustomerData] = useState<ProjectDetail>({});
    const [projectAddress, setFormattedProjectAddress] = useState("");
    const [project, setProject] = useState(null);
    const [projectExisting, setExistingProject] = useState(null);
    const dataNotLoadedYet = JSON.stringify(customerData) === "{}";
    const updateAddressProject = projectAddress?.length > 0;
    const { isFromCustomerPage, projectId } = route.params;

    const getProjectDetail = useCallback(
        async (projectIdData: string) => {
            try {
                const response = await projectGetOneById(projectIdData);
                setCustomerData(response.data.data);
                if (response.data.data) {
                    const regionProject: any = {
                        formattedAddress:
                            response.data.data.LocationAddress?.line1,
                        latitude: response.data.data.LocationAddress?.lat,
                        longitude: response.data.data.LocationAddress?.lon
                    };
                    setExistingProject(regionProject);
                    setFormattedProjectAddress(
                        response.data.data.LocationAddress?.line1
                    );
                }
            } catch (error) {
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        highlightedText: "Error",
                        popUpText: "Error fetching project detail",
                        outsideClickClosePopUp: true
                    })
                );
            }
        },
        [dispatch]
    );

    React.useEffect(() => {
        crashlytics().log(PROJECT_DETAIL);
        dispatch(resetRegion());
        getProjectDetail(projectId);
    }, [dispatch, getProjectDetail, route.params]);

    useEffect(() => {
        DeviceEventEmitter.addListener(
            "getCoordinateFromProjectDetail",
            (data) => {
                setProject(data.coordinate);
                setIsProjectLocationVisible(true);
            }
        );
    }, [setIsProjectLocationVisible]);

    if (dataNotLoadedYet) {
        return (
            <View style={styles.loading}>
                <BSpinner size="large" />
            </View>
        );
    }

    return (
        <>
            {isProjectLocationVisible && (
                <BillingModal
                    isBilling={false}
                    setFormattedAddress={setFormattedProjectAddress}
                    setIsModalVisible={setIsProjectLocationVisible}
                    isModalVisible={isProjectLocationVisible}
                    region={project || projectExisting}
                    isUpdate={
                        !!(
                            projectAddress !== undefined &&
                            projectAddress !== ""
                        )
                    }
                    setRegion={setProject}
                    projectId={customerData.id}
                />
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
                <BContainer>
                    <Text style={styles.partText}>Pelanggan</Text>
                    <BSpacer size="extraSmall" />
                    <View style={styles.between}>
                        <Text style={styles.fontW500}>
                            {customerData.Customer?.displayName &&
                            customerData.Customer?.displayName !== null
                                ? customerData.Customer?.displayName
                                : "-"}
                        </Text>
                        <Text
                            style={[
                                styles.fontW400,
                                { marginEnd: -layout.pad.lg + 1 }
                            ]}
                        >
                            <BTouchableText
                                title="Lihat Pelanggan"
                                textSize={fonts.size.xs}
                                disabled={
                                    !(
                                        customerData.Customer?.id &&
                                        customerData.Customer?.id !== null
                                    )
                                }
                                onPress={() =>
                                    isFromCustomerPage
                                        ? navigation.goBack()
                                        : navigation.navigate(CUSTOMER_DETAIL, {
                                              id: customerData.Customer?.id
                                          })
                                }
                            />
                        </Text>
                    </View>
                    <BSpacer size="small" />
                    <Text style={styles.partText}>Proyek</Text>
                    <BSpacer size="verySmall" />
                    <ProjectBetween
                        onPress={() => {
                            navigation.navigate(VISIT_HISTORY, {
                                projectId: customerData?.id,
                                projectName: customerData?.name
                            });
                        }}
                        projects={{
                            id: customerData?.id,
                            name: customerData?.name
                        }}
                    />
                    <BSpacer size="middleSmall" />
                    <View style={styles.between}>
                        <Text style={styles.partText}>Sisa Deposit</Text>
                        <Text style={styles.fontW400}>
                            {formatCurrency(
                                parseInt(
                                    customerData?.Account?.pendingBalance || 0,
                                    10
                                )
                            )}
                        </Text>
                    </View>
                    <BSpacer size="small" />
                    <View style={styles.between}>
                        <Text style={styles.partText}>PIC</Text>
                    </View>
                    <BSpacer size="extraSmall" />
                    <BPic
                        name={customerData?.Pic?.name}
                        email={customerData?.Pic?.email}
                        phone={customerData?.Pic?.phone}
                        position={customerData?.Pic?.position}
                    />
                    <BSpacer size="small" />
                    <Text style={styles.partText}>Alamat Proyek</Text>
                    <BSpacer size="extraSmall" />
                    <View style={styles.billingStyle}>
                        {updateAddressProject ? (
                            <UpdatedAddressWrapper
                                onPress={() =>
                                    setIsProjectLocationVisible(true)
                                }
                                address={projectAddress}
                            />
                        ) : (
                            <AddNewAddressWrapper
                                isBilling={false}
                                onPress={() =>
                                    setIsProjectLocationVisible(true)
                                }
                            />
                        )}
                    </View>
                </BContainer>
            </ScrollView>
        </>
    );
}
