import * as React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Linking,
    Text,
    Platform
} from "react-native";
import colors from "@/constants/colors";
import resScale from "@/utils/resScale";
import BQuickAction from "@/components/organism/BQuickActionMenu";
import BottomSheet from "@gorhom/bottom-sheet";
import BVisitationCard from "@/components/molecules/BVisitationCard";
import moment from "moment";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import {
    BSearchBar,
    BSpacer,
    BText,
    PopUpQuestion,
    BCommonSearchList,
    BBottomSheet,
    BSelectedBPOptionMenu
} from "@/components";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { fonts, layout } from "@/constants";
import {
    getAllVisitations,
    getVisitationTarget,
    oneGetVisitation
} from "@/actions/ProductivityActions";
import debounce from "lodash.debounce";
import Api from "@/models";
import { visitationDataType } from "@/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import useHeaderStyleChanged from "@/hooks/useHeaderStyleChanged";
import { useHeaderShow } from "@/hooks";
import {
    APPOINTMENT,
    CAMERA,
    CREATE_DEPOSIT,
    CREATE_SCHEDULE,
    CREATE_VISITATION,
    PROJECT_DETAIL,
    PO,
    SEARCH_SO,
    SPH,
    TAB_HOME,
    HOME_MENU,
    INVOICE_LIST,
    TAB_HOME_TITLE
} from "@/navigation/ScreenNames";
import SvgNames from "@/components/atoms/BSvg/svgName";
import crashlytics from "@react-native-firebase/crashlytics";
import {
    getAppVersionName,
    getMinVersionUpdate,
    isDevelopment,
    isForceUpdate
} from "@/utils/generalFunc";
import { RootState } from "@/redux/store";
import {
    resetFocusedStepperFlag,
    resetSPHState
} from "@/redux/reducers/SphReducer";
import bStorage from "@/actions";
import { resetRegion } from "@/redux/reducers/locationReducer";
import { resetImageURLS } from "@/redux/reducers/cameraReducer";
import { resetInvoiceState } from "@/redux/reducers/invoiceReducer";
import { setSelectedBatchingPlant } from "@/redux/reducers/authReducer";
import { BatchingPlant } from "@/models/BatchingPlant";
import BottomSheetFlatlist from "./elements/BottomSheetFlatlist";
import BuatKunjungan from "./elements/BuatKunjungan";
import DateDaily from "./elements/DateDaily";
import TargetCard from "./elements/TargetCard";
import SelectCustomerTypeModal from "../PurchaseOrder/element/SelectCustomerTypeModal";

const { height, width } = Dimensions.get("window");

const style = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: "flex-start",
        backgroundColor: colors.primary
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        width: "100%"
    },
    itemContainer: {
        padding: layout.pad.sm,
        margin: layout.pad.sm,
        backgroundColor: "#eee"
    },
    BsheetStyle: {
        paddingLeft: layout.pad.lg,
        paddingRight: layout.pad.lg,
        justifyContent: "center"
    },
    flatListContainer: {},
    flatListLoading: {
        justifyContent: "center",
        alignItems: "center"
    },
    flatListShimmer: {
        height: resScale(60),
        borderRadius: layout.radius.md
    },
    modalContent: {
        flex: 1
    },
    posRelative: {
        position: "relative",
        marginBottom: layout.pad.md
    },
    touchable: {
        position: "absolute",
        width: "100%",
        borderRadius: layout.radius.sm,
        height: resScale(45),
        zIndex: 2
    },
    handleIndicator: {
        height: resScale(3),
        width: resScale(40),
        backgroundColor: colors.disabled
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

function Beranda() {
    const { remoteConfigData, selectedBatchingPlant, batchingPlants } =
        useSelector((state: RootState) => state.auth);
    /* eslint-disable @typescript-eslint/naming-convention */
    const {
        force_update,
        enable_appointment,
        enable_signed_so,
        enable_create_schedule,
        enable_customer_detail,
        enable_deposit,
        enable_po,
        enable_sph,
        enable_visitation,
        enable_invoice
    } = remoteConfigData;
    /* eslint-enable @typescript-eslint/naming-convention */

    const poState = useSelector((state: RootState) => state.purchaseOrder);
    const { isModalContinuePo, poNumber, currentStep, customerType } =
        poState.currentState.context;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [currentVisit, setCurrentVisit] = React.useState<{
        current: number;
        target: number;
    }>({ current: 0, target: 10 }); // temporary setCurrentVisit
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [searchIndex, setSearchIndex] = React.useState(0);
    const [isTargetLoading, setIsTargetLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false); // setIsLoading temporary  setIsLoading
    const [isRenderDateDaily, setIsRenderDateDaily] = React.useState(true); // setIsRenderDateDaily

    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isError, setIsError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [isModalVisible, setModalVisible] = React.useState(false);
    const [isUpdateDialogVisible, setUpdateDialogVisible] =
        React.useState(false);
    const sphData = useSelector((state: RootState) => state.sph);
    const [isPopupSPHVisible, setPopupSPHVisible] = React.useState(false);
    const [feature, setFeature] = React.useState<"PO" | "SPH">("SPH");
    const [localModalContinuePo, setLocalContinueModalPo] =
        React.useState(false);
    const [isVisibleSelectCustomerType, setIsVisibleSelectCustomerType] =
        React.useState(false);
    const visitationData = useSelector((state: RootState) => state.visitation);
    const initialSnapPoints =
        height > 890
            ? height - width + layout.pad.xxl
            : height - width + layout.pad.xxl + layout.pad.md;
    const snapPoints = React.useMemo(() => [initialSnapPoints, "100%"], []);

    useHeaderShow({
        isHeaderShown: !isModalVisible
    });

    // fetching data
    const [visitData, setVisitData] = React.useState<Api.Response>({
        totalItems: 0,
        currentPage: 0,
        totalPage: 0,
        data: []
    });
    const [page, setPage] = React.useState<number>(1);
    const [selectedDate, setSelectedDate] = React.useState<moment.Moment>(
        moment()
    );

    const toggleModal = (key: string) => () => {
        setVisitData({ totalItems: 0, currentPage: 0, totalPage: 0, data: [] });
        setModalVisible(!isModalVisible);
        if (key === "close") {
            setSearchQuery("");
        }
    };
    const bottomSheetOnchange = (index: number) => {
        if (index === 0 || index === 1) {
            //   setSnapPoints(['68%', '91%']);
            setIsRenderDateDaily(true);
        } else {
            setIsRenderDateDaily(false);
        }
        if (index === 0) {
            setIsExpanded(true);
        } else {
            setIsExpanded(false);
        }
    };

    const fetchTarget = React.useCallback(
        async (selectedBP?: BatchingPlant) => {
            try {
                setIsTargetLoading(true);
                const { data: assignData } = await getVisitationTarget(
                    selectedBP?.id || selectedBatchingPlant?.id
                );
                setCurrentVisit({
                    current: assignData?.data?.totalCompleted,
                    target: assignData?.data?.visitationTarget
                });
                setIsTargetLoading(false);
            } catch (err) {
                setIsTargetLoading(false);
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            err.message ||
                            "Terjadi error saat pengambilan data target harian kunjungan",
                        outsideClickClosePopUp: true
                    })
                );
            }
        },
        []
    );

    const fetchVisitations = React.useCallback(
        async (
            date: moment.Moment,
            selectedBP?: BatchingPlant,
            search?: string
        ) => {
            setIsLoading(true);
            setIsError(false);
            try {
                const options = {
                    page,
                    search: search || searchQuery,
                    ...(!search &&
                        !searchQuery && {
                            date: date.valueOf()
                        }),
                    batchingPlantId: selectedBP?.id || selectedBatchingPlant?.id
                };
                const { data: assignData } = await getAllVisitations(options);
                const displayData =
                    assignData?.data?.data?.map((el: any) => {
                        const status =
                            el.status === "VISIT"
                                ? `Visit ke ${el.order}`
                                : el.status;
                        const pilStatus = el.finishDate
                            ? "Selesai"
                            : "Belum Selesai";
                        const time = el.finishDate
                            ? moment(el.finishDate).format("hh:mm")
                            : null;
                        const location = el.project?.LocationAddress?.line1;
                        return {
                            id: el.id,
                            name: el.project?.displayName || "--",
                            location: location || "-",
                            time,
                            status,
                            pilStatus
                        };
                    }) || [];

                if (page > 1) {
                    setVisitData({
                        ...assignData?.data,
                        data: visitData.data.concat(displayData)
                    });
                } else {
                    setVisitData({
                        ...assignData?.data,
                        data: displayData
                    });
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setIsError(true);
                setErrorMessage(error?.message);
            }
        },
        [visitData.data, page, searchQuery]
    );

    useHeaderStyleChanged({
        titleColor: colors.text.light,
        bgColor: colors.primary,
        customHeader: (
            <BSelectedBPOptionMenu
                pageTitle={TAB_HOME_TITLE}
                color={colors.white}
                selectedBatchingPlant={selectedBatchingPlant}
                batchingPlants={batchingPlants}
                onPressOption={(item: BatchingPlant) => {
                    dispatch(setSelectedBatchingPlant(item));
                    fetchTarget(item);
                    fetchVisitations(selectedDate, item);
                }}
            />
        )
    });

    useFocusEffect(
        React.useCallback(() => {
            fetchTarget();
            fetchVisitations(selectedDate);
        }, [fetchTarget, selectedDate, isModalVisible])
    );

    const renderUpdateDialog = () => (
        <Portal>
            <Dialog
                visible={isUpdateDialogVisible}
                dismissable={!isForceUpdate(force_update)}
                onDismiss={() => setUpdateDialogVisible(!isUpdateDialogVisible)}
                style={{ backgroundColor: colors.white }}
            >
                <Dialog.Title
                    style={{
                        fontFamily: fonts.family.montserrat[500],
                        fontSize: fonts.size.lg
                    }}
                >
                    Update Aplikasi
                </Dialog.Title>
                <Dialog.Content>
                    <BText bold="300">
                        Aplikasi anda telah usang, silakan update sebelum
                        melanjutkan.
                    </BText>
                </Dialog.Content>
                <Dialog.Actions>
                    {!isForceUpdate(force_update) && (
                        <Button
                            onPress={() =>
                                setUpdateDialogVisible(!isUpdateDialogVisible)
                            }
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        onPress={() =>
                            Linking.openURL(
                                Platform.OS === "ios"
                                    ? "http://itunes.com/apps/bod"
                                    : "https://play.google.com/store/apps/details?id=bod.app"
                            )
                        }
                    >
                        Update
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );

    const renderPoNumber = () => (
        <View
            style={[
                style.poNumberWrapper,
                {
                    alignItems:
                        customerType === "COMPANY" ? "flex-start" : "center"
                }
            ]}
        >
            <Text style={style.poNumber}>
                {customerType === "COMPANY" ? poNumber : "-"}
            </Text>
        </View>
    );

    const renderContinueData = () => (
        <>
            <View style={style.popupSPHContent}>
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
            <BText bold="300" sizeInNumber={14} style={style.popupSPHDesc}>
                {`${feature} yang lama akan hilang kalau Anda buat ${feature} yang baru`}
            </BText>
            <BSpacer size="small" />
        </>
    );

    React.useEffect(() => {
        crashlytics().log(TAB_HOME);
        let currentVersionName = getAppVersionName();
        if (isDevelopment())
            currentVersionName = currentVersionName?.replace("(Dev)", "");
        setUpdateDialogVisible(
            currentVersionName?.split(".").join("") <
                getMinVersionUpdate(force_update)
        );
    }, [force_update]);

    const onDateSelected = React.useCallback((dateTime: moment.Moment) => {
        setPage(1);
        setVisitData({ totalItems: 0, currentPage: 0, totalPage: 0, data: [] });
        setSelectedDate(dateTime);
    }, []);

    const routes: { title: string; totalItems: number }[] = React.useMemo(
        () => [
            {
                key: "first",
                title: "Proyek",
                totalItems: visitData.totalItems || 0,
                chipPosition: "right"
            }
        ],
        [visitData]
    );

    const onEndReached = React.useCallback(() => {
        if (visitData.totalPage) {
            if (visitData.totalPage > 0 && page < visitData.totalPage) {
                setPage(page + 1);
            }
        }
    }, [visitData.totalPage, page]);

    const getButtonsMenu = () => {
        let buttons = [
            {
                icon: SvgNames.IC_SPH,
                title: HOME_MENU.SPH,
                action: () => {
                    setFeature("SPH");
                    if (sphData?.selectedCompany) setPopupSPHVisible(true);
                    else navigation.navigate(SPH, {});
                }
            },
            {
                icon: SvgNames.IC_PO,
                title: HOME_MENU.PO,
                action: () => {
                    setFeature("PO");
                    if (!isModalContinuePo) {
                        setIsVisibleSelectCustomerType(true);
                        setLocalContinueModalPo(false);
                    } else {
                        setLocalContinueModalPo(true);
                    }
                }
            },
            {
                icon: SvgNames.IC_DEPOSIT,
                title: HOME_MENU.DEPOSIT,
                action: () => {
                    navigation.navigate(CAMERA, {
                        photoTitle: "Bukti",
                        navigateTo: CREATE_DEPOSIT,
                        closeButton: true,
                        disabledDocPicker: false,
                        disabledGalleryPicker: false
                    });
                }
            },
            {
                icon: SvgNames.IC_MAKE_SCHEDULE,
                title: HOME_MENU.SCHEDULE,
                action: () => {
                    navigation.navigate(CREATE_SCHEDULE);
                }
            },
            {
                icon: SvgNames.IC_APPOINTMENT,
                title: HOME_MENU.APPOINTMENT,
                action: () => {
                    navigation.navigate(APPOINTMENT);
                }
            },
            {
                icon: SvgNames.IC_SIGN_SO,
                title: HOME_MENU.SIGN_SO,
                action: () => {
                    navigation.navigate(SEARCH_SO);
                }
            },
            {
                icon: SvgNames.IC_INVOICE,
                title: HOME_MENU.INVOICE,
                action: () => {
                    dispatch(resetInvoiceState());
                    navigation.navigate(INVOICE_LIST);
                }
            }
        ];

        if (!enable_sph) {
            const filtered = buttons.filter(
                (item) => item.title !== HOME_MENU.SPH
            );
            buttons = filtered;
        }

        if (!enable_po) {
            const filtered = buttons.filter(
                (item) => item.title !== HOME_MENU.PO
            );
            buttons = filtered;
        }

        if (!enable_deposit) {
            const filtered = buttons.filter(
                (item) => item.title !== HOME_MENU.DEPOSIT
            );
            buttons = filtered;
        }

        if (!enable_create_schedule) {
            const filtered = buttons.filter(
                (item) => item.title !== HOME_MENU.SCHEDULE
            );
            buttons = filtered;
        }

        if (!enable_appointment) {
            const filtered = buttons.filter(
                (item) => item.title !== HOME_MENU.APPOINTMENT
            );
            buttons = filtered;
        }

        if (!enable_signed_so) {
            const filtered = buttons.filter(
                (item) => item.title !== HOME_MENU.SIGN_SO
            );
            buttons = filtered;
        }

        if (!enable_invoice) {
            const filtered = buttons.filter(
                (item) => item.title !== HOME_MENU.INVOICE
            );
            buttons = filtered;
        }
        return buttons;
    };

    const todayMark = React.useMemo(
        () => [
            {
                date: moment(),
                lines: [
                    {
                        color: colors.primary
                    }
                ]
            }
        ],
        []
    );

    const reset = (text: string) => {
        setVisitData({
            totalItems: 0,
            currentPage: 0,
            totalPage: 0,
            data: []
        });
        setPage(1);
        fetchVisitations(selectedDate, undefined, text);
    };

    const onChangeWithDebounce = React.useCallback(debounce(reset, 500), []);

    const onChangeSearch = (text: string) => {
        setSearchQuery(text);
        onChangeWithDebounce(text);
    };

    const onRetryFetchVisitation = () => {
        setPage(1);
        setVisitData({
            totalItems: 0,
            currentPage: 0,
            totalPage: 0,
            data: []
        });
        fetchVisitations(selectedDate);
    };

    const kunjunganAction = () => {
        if (visitationData.images && visitationData.images.length > 1) {
            dispatch(resetFocusedStepperFlag());
            navigation.navigate(CREATE_VISITATION, {});
        } else {
            dispatch(resetImageURLS({ source: CREATE_VISITATION }));
            dispatch(resetRegion());
            navigation.navigate(CAMERA, {
                photoTitle: "Kunjungan",
                navigateTo: CREATE_VISITATION,
                closeButton: true
            });
        }
    };

    async function visitationOnPress(
        dataItem: visitationDataType
    ): Promise<void> {
        try {
            const status = dataItem.pilStatus;

            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpText: "Loading visitation Data...",
                    outsideClickClosePopUp: false
                })
            );
            const response = await oneGetVisitation({
                visitationId: dataItem.id
            }).catch((err) => Error(err));
            if (response?.data?.success && response?.data?.success !== false) {
                dispatch(closePopUp());
                if (status === "Belum Selesai") {
                    navigation.navigate(CAMERA, {
                        photoTitle: "Kunjungan",
                        navigateTo: CREATE_VISITATION,
                        closeButton: true,
                        existingVisitation: response?.data?.data
                    });
                } else {
                    navigation.navigate(PROJECT_DETAIL, {
                        projectId: response?.data?.data.project?.id,
                        isFromCustomerPage: false
                    });
                }
            } else {
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        highlightedText: "Error",
                        popUpText: "Error fetching visitation Data",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    highlightedText: "Error",
                    popUpText: "Error fetching visitation Data",
                    outsideClickClosePopUp: true
                })
            );
        }
    }

    const continuePopUpAction = () => {
        if (feature === "PO") {
            if (currentStep === 0) {
                dispatch({ type: "goToSecondStepFromSaved" });
                setLocalContinueModalPo(false);
            } else {
                dispatch({ type: "goToThirdStepFromSaved" });
                setLocalContinueModalPo(false);
            }
            navigation.navigate(PO);
        } else {
            setPopupSPHVisible(false);
            dispatch(resetFocusedStepperFlag());
            navigation.navigate(SPH, {});
        }
    };

    return (
        <View style={style.container}>
            <Modal
                isVisible={isModalVisible}
                backdropOpacity={1}
                backdropColor="white"
                hideModalContentWhileAnimating
                coverScreen={false}
                onBackButtonPress={toggleModal("close")}
                onModalHide={() => {
                    fetchVisitations(selectedDate);
                }}
            >
                <View style={style.modalContent}>
                    <BSpacer size="extraSmall" />
                    <BCommonSearchList
                        placeholder="Cari PT / Proyek"
                        index={searchIndex}
                        onIndexChange={setSearchIndex}
                        onPressMagnify={kunjunganAction}
                        onClearValue={() => {
                            if (searchQuery && searchQuery.trim() !== "") {
                                setSearchQuery("");
                            } else {
                                toggleModal("close")();
                            }
                        }}
                        autoFocus
                        searchQuery={searchQuery}
                        onChangeText={onChangeSearch}
                        routes={routes}
                        loadList={isLoading}
                        onPressList={
                            enable_customer_detail
                                ? (data) => {
                                      toggleModal("close")();
                                      visitationOnPress(data);
                                  }
                                : undefined
                        }
                        data={visitData.data}
                        onEndReached={onEndReached}
                        isError={isError}
                        errorMessage={errorMessage}
                        emptyText={`${searchQuery} tidak ditemukan!`}
                        onRetry={() => onChangeWithDebounce(searchQuery)}
                    />
                </View>
            </Modal>

            <TargetCard
                isExpanded={isExpanded}
                maxVisitation={currentVisit.target ? currentVisit.target : 0}
                currentVisitaion={
                    currentVisit.current ? currentVisit.current : 0
                }
                isLoading={isTargetLoading}
            />

            <BSpacer size="small" />
            <BQuickAction buttonProps={getButtonsMenu()} />

            <BBottomSheet
                onChange={bottomSheetOnchange}
                percentSnapPoints={snapPoints}
                ref={bottomSheetRef}
                enableContentPanningGesture
                handleIndicatorStyle={style.handleIndicator}
                style={style.BsheetStyle}
                footerComponent={(props: any) => {
                    if (!isRenderDateDaily) {
                        return null;
                    }

                    if (enable_visitation)
                        return BuatKunjungan(props, kunjunganAction);

                    return undefined;
                }}
            >
                <View style={style.posRelative}>
                    <TouchableOpacity
                        style={style.touchable}
                        onPress={() => toggleModal("open")()}
                    />
                    <BSearchBar
                        placeholder="Cari PT / Proyek"
                        activeOutlineColor="gray"
                        disabled
                        left={
                            <TextInput.Icon
                                forceTextInputFocus={false}
                                icon="magnify"
                            />
                        }
                        value={searchQuery}
                    />
                </View>
                <BSpacer size="verySmall" />
                <DateDaily
                    markedDatesArray={todayMark}
                    isRender={isRenderDateDaily}
                    onDateSelected={onDateSelected}
                    selectedDate={selectedDate}
                />
                <BSpacer size="extraSmall" />
                <BottomSheetFlatlist
                    isLoading={isLoading}
                    data={visitData.data}
                    onAction={onRetryFetchVisitation}
                    isError={isError}
                    errorMessage={errorMessage}
                    searchQuery={searchQuery}
                    onEndReached={onEndReached}
                    onPressItem={(data) =>
                        enable_customer_detail
                            ? visitationOnPress(data)
                            : undefined
                    }
                />
                <PopUpQuestion
                    isVisible={
                        feature === "SPH"
                            ? isPopupSPHVisible
                            : localModalContinuePo
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
            </BBottomSheet>
            {renderUpdateDialog()}
        </View>
    );
}

export default Beranda;
