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
    BTouchableText,
    BVisitationCard,
    BottomSheetAddPIC
} from "@/components";
import crashlytics from "@react-native-firebase/crashlytics";

import {
    useFocusEffect,
    useNavigation,
    useRoute
} from "@react-navigation/native";
import { getOneCustomer, updateCustomer } from "@/actions/CommonActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { PIC } from "@/interfaces";
import AntIcon from "react-native-vector-icons/AntDesign";
import FeatIcon from "react-native-vector-icons/Feather";
import { ICustomerDetail } from "@/models/Customer";
import {
    CUSTOMER_DETAIL,
    CUSTOMER_DOCUMENT,
    PROJECT_DETAIL
} from "@/navigation/ScreenNames";
import { showWarningDocument } from "@/utils/generalFunc";
import RemainingAmountBox from "./elements/RemainAmountBox";
import CustomerDetailLoader from "./elements/CustomerDetailLoader";
import UpdatedAddressWrapper from "./elements/UpdatedAddressWrapper";
import DocumentWarning from "./elements/DocumentWarning";
import BillingModal from "./elements/BillingModal";
import TotalDocumentChip from "../elements/TotalDocumentChip";

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
    touchableText: {
        color: colors.danger,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.vs,
        margin: 0
    },

    fontW300: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[300],
        fontSize: fonts.size.xs
    },
    fontW400: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.xs
    },
    fontW500: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.xs
    },
    billingStyle: {
        alignItems: "center"
    },

    loading: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    seeAllText: {
        color: colors.primary,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.sm
    },
    projectListContainer: {
        backgroundColor: colors.tertiary,
        borderTopStartRadius: layout.radius.lg,
        borderTopEndRadius: layout.radius.lg
    }
});

export default function CustomerDetail() {
    const route = useRoute<RootStackScreenProps>();
    const { id } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const [isBillingLocationVisible, setIsBillingLocationVisible] =
        useState(false);
    const [customerData, setCustomerData] = useState<ICustomerDetail>({});
    const [isVisibleModalPic, setIsVisibleModalPic] = useState(false);
    const [billingAddress, setFormattedBillingAddress] = useState("");
    const [updatedBilling, setUpdatedBilling] = useState(null);

    const dataNotLoadedYet = JSON.stringify(customerData) === "{}";

    const getCustomerDetail = useCallback(async () => {
        try {
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    outsideClickClosePopUp: false
                })
            );

            const response = await getOneCustomer(id);
            if (response.data.success) {
                dispatch(closePopUp());
                setCustomerData(response.data.data);
            } else {
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        highlightedText: "Error",
                        popUpText: "Error Saat Mengambil Data Customer detail",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    highlightedText: "Error",
                    popUpText: error?.message
                        ? error?.message
                        : "Error Saat Mengambil Data Customer detail",
                    outsideClickClosePopUp: true
                })
            );
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            crashlytics().log(CUSTOMER_DETAIL);
            getCustomerDetail();
        }, [])
    );

    useEffect(() => {
        DeviceEventEmitter.addListener(
            "getCoordinateFromCustomerDetail",
            (data) => {
                setUpdatedBilling(data.coordinate);
                setIsBillingLocationVisible(true);
            }
        );
    }, [setIsBillingLocationVisible]);

    const onChangePic = async (data: PIC) => {
        try {
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpText: "Update PIC",
                    outsideClickClosePopUp: false
                })
            );

            const payload = {};
            payload.pic = data;
            const response = await updateCustomer(id, payload);
            if (response?.data?.success && response?.data?.success !== false) {
                dispatch(
                    openPopUp({
                        popUpType: "success",
                        popUpText: "Berhasil Update PIC",
                        outsideClickClosePopUp: true
                    })
                );
                setIsVisibleModalPic(false);
                getCustomerDetail();
            } else {
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        highlightedText: "Error",
                        popUpText: "Error Saat Update Customer PIC",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    highlightedText: "Error",
                    popUpText:
                        error?.message || "Error Saat Update Customer PIC",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    const renderDocumentWarning = () =>
        showWarningDocument(
            customerData?.CustomerDocs?.cbd,
            customerData?.type
        ) && (
            <DocumentWarning
                customerType={customerData?.type}
                docs={customerData?.CustomerDocs}
                customerId={id}
            />
        );

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
                defaultState={customerData?.Pic}
                onClose={() => setIsVisibleModalPic(false)}
                addPic={onChangePic}
                modalTitle="Edit PIC"
                buttonTitle="Edit PIC"
            />
            {renderDocumentWarning()}
            <ScrollView showsVerticalScrollIndicator={false}>
                <BContainer>
                    <View style={styles.between}>
                        <Text style={styles.fontW400}>Nama</Text>
                        <Text style={styles.fontW500}>
                            {customerData?.displayName}
                        </Text>
                    </View>
                    <BSpacer size="middleSmall" />
                    <View style={styles.between}>
                        <Text style={styles.fontW400}>No. NPWP</Text>
                        <Text style={styles.fontW500}>
                            {customerData?.npwp}
                        </Text>
                    </View>
                    <BSpacer size="middleSmall" />
                    <View style={styles.between}>
                        <Text style={styles.fontW400}>No. KTP</Text>
                        <Text style={styles.fontW500}>{customerData?.nik}</Text>
                    </View>
                    <BSpacer size="middleSmall" />
                    <View style={styles.between}>
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={{
                                    ...styles.fontW400,
                                    marginRight: layout.pad.md
                                }}
                            >
                                Dokumen Legalitas
                            </Text>
                            <TotalDocumentChip
                                documents={customerData?.CustomerDocs}
                                customerType={customerData?.type}
                            />
                        </View>

                        <BTouchableText
                            onPress={() =>
                                navigation.navigate(CUSTOMER_DOCUMENT, {
                                    docs: customerData?.CustomerDocs,
                                    customerType: customerData?.type,
                                    customerId: id
                                })
                            }
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

                    <BSpacer size="middleSmall" />
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
                            title="Edit"
                        />
                    </View>

                    <BSpacer size="extraSmall" />
                    <BPic
                        name={customerData?.Pic?.name}
                        email={customerData?.Pic?.email}
                        phone={customerData?.Pic?.phone}
                        position={customerData?.Pic?.position}
                    />
                    <BSpacer size="middleSmall" />
                    <View style={styles.between}>
                        <Text style={styles.fontW400}>Alamat Penagihan</Text>
                        <BTouchableText
                            startIcon={
                                <FeatIcon
                                    name={
                                        customerData?.BillingAddress?.line1
                                            ? "edit"
                                            : "plus"
                                    }
                                    style={{ marginRight: layout.pad.xs }}
                                    color={colors.danger}
                                />
                            }
                            onPress={() => setIsBillingLocationVisible(true)}
                            textStyle={styles.touchableText}
                            title={
                                customerData?.BillingAddress?.line1
                                    ? "Edit"
                                    : "Tambah"
                            }
                        />
                    </View>
                    <BSpacer size="extraSmall" />
                    <View style={styles.billingStyle}>
                        <UpdatedAddressWrapper
                            address={
                                updatedBilling?.formattedAddress ||
                                customerData?.BillingAddress?.line1
                            }
                        />
                    </View>
                    <BSpacer size="middleSmall" />
                    <View style={styles.between}>
                        <Text style={styles.fontW400}>Dompet</Text>
                    </View>
                    <BSpacer size="extraSmall" />
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <RemainingAmountBox
                            title="Sisa Deposit"
                            firstAmount={customerData?.pendingBalance}
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
                                            locationTextColor={
                                                colors.text.lightGray
                                            }
                                            item={{
                                                name: v.name ? v.name : "",
                                                location: v?.ShippingAddress
                                                    ?.line1
                                                    ? v?.ShippingAddress?.line1
                                                    : v?.ShippingAddress?.line2
                                            }}
                                            onPress={() =>
                                                navigation.navigate(
                                                    PROJECT_DETAIL,
                                                    {
                                                        projectId: v.id,
                                                        isFromCustomerPage: true
                                                    }
                                                )
                                            }
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
