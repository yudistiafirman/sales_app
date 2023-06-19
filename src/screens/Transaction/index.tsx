import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import BTabSections from "@/components/organism/TabSections";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
    BEmptyState,
    BSpacer,
    BText,
    BTouchableText,
    BVisitationCard,
    PopUpQuestion
} from "@/components";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";
import { useMachine } from "@xstate/react";
import { colors, fonts, layout } from "@/constants";
import { resScale } from "@/utils";
import transactionMachine from "@/machine/transactionMachine";
import useCustomHeaderRight from "@/hooks/useCustomHeaderRight";
import {
    CAMERA,
    CREATE_DEPOSIT,
    CREATE_SCHEDULE,
    PO,
    SPH,
    TAB_TRANSACTION,
    TRANSACTION_DETAIL
} from "@/navigation/ScreenNames";
import {
    getDeliveryOrderByID,
    getPurchaseOrderByID,
    getScheduleByID,
    getVisitationOrderByID
} from "@/actions/OrderActions";
import crashlytics from "@react-native-firebase/crashlytics";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
    resetFocusedStepperFlag,
    resetSPHState
} from "@/redux/reducers/SphReducer";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { getDrivers, getVehicles } from "@/actions/InventoryActions";
import bStorage from "@/actions";
import { getPaymentByID } from "@/actions/FinanceActions";
import SelectCustomerTypeModal from "../PurchaseOrder/element/SelectCustomerTypeModal";
import TransactionList from "./element/TransactionList";

const styles = StyleSheet.create({
    parent: {
        flex: 1
    },
    shimmer: {
        marginHorizontal: layout.pad.lg,
        height: layout.pad.lg,
        width: "92%"
    },
    tabIndicator: {
        backgroundColor: colors.primary,
        marginLeft: layout.pad.lg
    },
    tabStyle: {
        width: "auto",
        paddingHorizontal: layout.pad.lg
    },
    tabBarStyle: {
        backgroundColor: colors.white,
        paddingHorizontal: layout.pad.lg
    },
    popupSPHContent: { height: resScale(78), paddingHorizontal: layout.pad.lg },
    popupSPHDesc: {
        alignSelf: "center",
        textAlign: "center",
        paddingHorizontal: layout.pad.xl
    },
    poNumber: {
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.md,
        color: colors.text.darker,
        padding: layout.pad.xs + layout.pad.md
    },
    poNumberWrapper: {
        backgroundColor: colors.tertiary,
        height: resScale(37),
        alignItems: "flex-start",
        justifyContent: "center",
        width: resScale(277),
        alignSelf: "center",
        borderRadius: layout.radius.md
    }
});

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
function Transaction() {
    const navigation = useNavigation();
    const [index, setIndex] = React.useState(0);
    const [trxState, send] = useMachine(transactionMachine);
    const [isPopupSPHVisible, setPopupSPHVisible] = React.useState(false);
    const sphData = useSelector((rootState: RootState) => rootState.sph);
    const dispatch = useDispatch();
    const [feature, setFeature] = React.useState<"PO" | "SPH">("SPH");
    const [localModalContinuePo, setLocalContinueModalPo] =
        React.useState(false);
    const poState = useSelector((state: RootState) => state.purchaseOrder);
    const { selectedBatchingPlant } = useSelector(
        (state: RootState) => state.auth
    );
    const { isModalContinuePo, poNumber, currentStep, customerType } =
        poState.currentState.context;
    const [isVisibleSelectCustomerType, setIsVisibleSelectCustomerType] =
        React.useState(false);
    const {
        routes,
        isLoadMore,
        refreshing,
        transactionData,
        loadTransaction,
        loadTab,
        selectedType,
        errorMessage,
        isErrorData: isError
    } = trxState.context;

    const onTabPress = (title: string) => {
        if (isError) send("retryGettingTransactions", { payload: title });
        else
            send("onChangeType", {
                payload: title,
                selectedBP: selectedBatchingPlant
            });
    };

    useCustomHeaderRight({
        customHeaderRight:
            selectedType === "DO" ||
            selectedType === "SO" ||
            (selectedType === "SPH" && loadTab) ? undefined : (
                <BTouchableText
                    onPress={() => {
                        if (selectedType === "PO") {
                            setFeature("PO");
                            if (!isModalContinuePo) {
                                setIsVisibleSelectCustomerType(true);
                                setLocalContinueModalPo(false);
                            } else {
                                setLocalContinueModalPo(true);
                            }
                        } else if (selectedType === "Deposit") {
                            navigation.navigate(CAMERA, {
                                photoTitle: "Bukti",
                                navigateTo: CREATE_DEPOSIT,
                                closeButton: true,
                                disabledDocPicker: false,
                                disabledGalleryPicker: false
                            });
                        } else if (selectedType === "Jadwal") {
                            navigation.navigate(CREATE_SCHEDULE);
                        } else {
                            setFeature("SPH");
                            if (sphData?.selectedCompany)
                                setPopupSPHVisible(true);
                            else navigation.navigate(SPH, {});
                        }
                    }}
                    title={`Buat ${selectedType}`}
                />
            )
    });

    useFocusEffect(
        React.useCallback(() => {
            send("backToGetTransactions");
        }, [send])
    );

    React.useEffect(() => {
        crashlytics().log(TAB_TRANSACTION);
    }, []);

    const getOneOrder = async (id: string) => {
        try {
            let data;
            let driverName;
            let vehicleName;
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpText: `Mendapatkan data ${selectedType}`,
                    highlightedText: "detail",
                    outsideClickClosePopUp: false
                })
            );
            if (selectedType === "SPH") {
                data = await getVisitationOrderByID(id);
                data = data.data.data;
            } else if (selectedType === "PO" || selectedType === "SO") {
                data = await getPurchaseOrderByID(id);
                data = data.data.data;

                // TODO: handle from BE, ugly when use mapping in FE side
                data = {
                    ...data,
                    mainPic: data.QuotationLetter?.QuotationRequest?.mainPic,
                    paymentType:
                        data.QuotationLetter?.QuotationRequest?.paymentType,
                    deposit: data.DepositPurchaseOrders,
                    DepositPurchaseOrders: undefined,
                    address: data.project.Address,
                    products: data.PoProducts,
                    project: {
                        ...data.project,
                        Address: undefined
                    },
                    QuotationLetter: {
                        ...data.QuotationLetter,
                        QuotationRequest: {
                            ...data.QuotationLetter.QuotationRequest,
                            mainPic: undefined,
                            paymentType: undefined,
                            products: undefined
                        }
                    }
                };
            } else if (selectedType === "Deposit") {
                data = await getPaymentByID(id);
                data = data.data.data;

                // TODO: handle from BE, ugly when use mapping in FE side
                data = {
                    ...data,
                    mainPic: data.Account?.Project?.mainPic,
                    Account: {
                        ...data.Account,
                        Project: {
                            ...data.Account.Project,
                            mainPic: undefined
                        }
                    }
                };
            } else if (selectedType === "Jadwal") {
                data = await getScheduleByID(id);
                data = data.data.data;

                // TODO: handle from BE, ugly when use mapping in FE side
                data = {
                    ...data,
                    mainPic: data.QuotationLetter?.QuotationRequest?.mainPic,
                    products: data.QuotationLetter?.QuotationRequest?.products,
                    QuotationLetter: {
                        ...data.QuotationLetter,
                        QuotationRequest: {
                            ...data.QuotationLetter.QuotationRequest,
                            mainPic: undefined,
                            products: undefined
                        }
                    }
                };
            } else if (selectedType === "DO") {
                data = await getDeliveryOrderByID(id);
                driverName = "-";
                vehicleName = "-";
                data = data.data.data;

                const dataDrivers = await getDrivers();
                const dataVehicles = await getVehicles();

                dataDrivers?.data?.data.forEach((it) => {
                    if (it.id === data?.driverId) driverName = it?.name;
                });
                dataVehicles?.data?.data.forEach((it) => {
                    if (it.id === data?.vehicleId)
                        vehicleName = `${
                            it?.internal_id ? it?.internal_id : "-"
                        } / ${it?.plate_number ? it?.plate_number : "-"}`;
                });

                // TODO: handle from BE, ugly when use mapping in FE side
                const products: any[] = [];
                products.push(data.Schedule?.SaleOrder?.PoProduct);
                data = {
                    ...data,
                    mainPic: data.project?.mainPic,
                    address: data.project.Address,
                    products,
                    project: {
                        ...data.project,
                        mainPic: undefined,
                        Address: undefined
                    },
                    Schedule: {
                        ...data.Schedule
                    }
                };
            }
            dispatch(closePopUp());
            navigation.navigate(TRANSACTION_DETAIL, {
                title: data ? data.number : "N/A",
                data,
                type: selectedType,
                driverName,
                vehicleName
            });
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        `Terjadi error saat pengambilan ${selectedType} data  `,
                    outsideClickClosePopUp: true
                })
            );
        }
    };
    const renderPoNumber = () => (
        <View
            style={[
                styles.poNumberWrapper,
                {
                    alignItems:
                        customerType === "COMPANY" ? "flex-start" : "center"
                }
            ]}
        >
            <Text style={styles.poNumber}>
                {customerType === "COMPANY" ? poNumber : "-"}
            </Text>
        </View>
    );

    const renderContinueData = () => (
        <>
            <View style={styles.popupSPHContent}>
                {feature === "PO" ? (
                    renderPoNumber()
                ) : (
                    <BVisitationCard
                        item={{
                            name: sphData?.selectedCompany?.name,
                            location:
                                sphData?.selectedCompany?.locationAddress?.line1
                        }}
                        isRenderIcon={false}
                    />
                )}
            </View>
            <BSpacer size="medium" />
            <BText bold="300" sizeInNumber={14} style={styles.popupSPHDesc}>
                {`${feature} yang lama akan hilang kalau Anda buat ${feature} yang baru`}
            </BText>
            <BSpacer size="small" />
        </>
    );

    const continuePopUpAction = () => {
        if (feature === "PO") {
            if (currentStep === 0) {
                dispatch({ type: "goToSecondStepFromSaved" });
            } else {
                dispatch({ type: "goToThirdStepFromSaved" });
            }
            navigation.navigate(PO);
        } else {
            setPopupSPHVisible(false);
            dispatch(resetFocusedStepperFlag());
            navigation.navigate(SPH, {});
        }
    };

    return (
        <SafeAreaView style={styles.parent}>
            {loadTab && <ShimmerPlaceholder style={styles.shimmer} />}
            <BSpacer size="extraSmall" />
            {trxState.matches(
                "getTransaction.errorGettingTypeTransactions"
            ) && (
                <BEmptyState
                    onAction={() => send("retryGettingTypeTransactions")}
                    isError
                    errorMessage={errorMessage}
                />
            )}
            {routes.length > 0 && (
                <BTabSections
                    swipeEnabled={false}
                    navigationState={{ index, routes }}
                    renderScene={() => (
                        <TransactionList
                            onEndReached={() => send("onEndReached")}
                            transactions={transactionData}
                            isLoadMore={isLoadMore}
                            loadTransaction={loadTransaction}
                            refreshing={refreshing}
                            isError={trxState.matches(
                                "getTransaction.typeLoaded.errorGettingTransactions"
                            )}
                            errorMessage={errorMessage}
                            onAction={() =>
                                send("retryGettingTransactions", {
                                    payload: selectedType
                                })
                            }
                            onRefresh={() => send("refreshingList")}
                            onPress={(data: any) => getOneOrder(data.id)}
                            selectedType={selectedType}
                        />
                    )}
                    onTabPress={(data) => {
                        onTabPress(data?.route?.title);
                    }}
                    onIndexChange={setIndex}
                    tabStyle={styles.tabStyle}
                    tabBarStyle={styles.tabBarStyle}
                    indicatorStyle={styles.tabIndicator}
                    // minTabHeaderWidth={80}
                />
            )}
            <PopUpQuestion
                isVisible={
                    feature === "SPH" ? isPopupSPHVisible : localModalContinuePo
                }
                setIsPopupVisible={() => {
                    if (feature === "SPH") {
                        setPopupSPHVisible(false);
                        dispatch(resetSPHState());
                        navigation.navigate(SPH, {});
                    } else {
                        bStorage.deleteItem(PO);
                        setLocalContinueModalPo(false);
                        dispatch({ type: "createNewPo" });
                        setIsVisibleSelectCustomerType(true);
                    }
                }}
                actionButton={continuePopUpAction}
                descContent={renderContinueData()}
                cancelText="Buat Baru"
                actionText="Lanjutkan"
                text={`Apakah Anda Ingin Melanjutkan Pembuatan ${
                    feature === "PO" ? "PO" : "SPH"
                } Sebelumnya?`}
            />
            <SelectCustomerTypeModal
                isVisible={isVisibleSelectCustomerType}
                onClose={() => setIsVisibleSelectCustomerType(false)}
                onSelect={(selectedCustomerType) => {
                    dispatch({
                        type: "openingCamera",
                        value: selectedCustomerType
                    });
                    setIsVisibleSelectCustomerType(false);
                    navigation.navigate(PO);
                }}
            />
        </SafeAreaView>
    );
}

export default Transaction;
