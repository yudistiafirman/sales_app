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
import TargetCard from "./elements/TargetCard";
import resScale from "@/utils/resScale";
import DateDaily from "./elements/DateDaily";
import BQuickAction from "@/components/organism/BQuickActionMenu";
import BottomSheet from "@gorhom/bottom-sheet";
import BVisitationCard from "@/components/molecules/BVisitationCard";
import moment from "moment";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import BuatKunjungan from "./elements/BuatKunjungan";
import {
    BSearchBar,
    BSpacer,
    BText,
    PopUpQuestion,
    BCommonSearchList,
    BBottomSheet
} from "@/components";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";
import { fonts, layout } from "@/constants";
import BottomSheetFlatlist from "./elements/BottomSheetFlatlist";
import {
    getAllVisitations,
    getVisitationTarget
} from "@/actions/ProductivityActions";
import debounce from "lodash.debounce";
import { Api } from "@/models";
import { visitationDataType } from "@/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { getOneVisitation } from "@/redux/async-thunks/productivityFlowThunks";
import useHeaderStyleChanged from "@/hooks/useHeaderStyleChanged";
import { useHeaderShow } from "@/hooks";
import {
    APPOINTMENT,
    CAMERA,
    CREATE_DEPOSIT,
    CREATE_SCHEDULE,
    CREATE_VISITATION,
    CUSTOMER_DETAIL_V1,
    PO,
    SEARCH_SO,
    SPH,
    TAB_HOME,
    HOME_MENU
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
import { bStorage } from "@/actions";
import { resetRegion } from "@/redux/reducers/locationReducer";
import { resetImageURLS } from "@/redux/reducers/cameraReducer";
import SelectCustomerTypeModal from "../PurchaseOrder/element/SelectCustomerTypeModal";
const { height, width } = Dimensions.get("window");

const Beranda = () => {
    const {
        force_update,
        enable_appointment,
        enable_signed_so,
        enable_create_schedule,
        enable_customer_detail,
        enable_deposit,
        enable_po,
        enable_sph,
        enable_visitation
    } = useSelector((state: RootState) => state.auth.remote_config);
    const poState = useSelector((state: RootState) => state.purchaseOrder);
    const { isModalContinuePo, poNumber, currentStep, customerType } =
        poState.currentState.context;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [currentVisit, setCurrentVisit] = React.useState<{
        current: number;
        target: number;
    }>({ current: 0, target: 10 }); //temporary setCurrentVisit
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [index, setIndex] = React.useState(0);
    const [isTargetLoading, setIsTargetLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false); // setIsLoading temporary  setIsLoading
    const [isRenderDateDaily, setIsRenderDateDaily] = React.useState(true); //setIsRenderDateDaily

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
    useHeaderStyleChanged({
        titleColor: colors.text.light,
        bgColor: colors.primary
    });

    // fetching data
    const [data, setData] = React.useState<Api.Response>({
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
        setData({ totalItems: 0, currentPage: 0, totalPage: 0, data: [] });
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

    const fetchTarget = React.useCallback(async () => {
        try {
            setIsTargetLoading(true);
            const { data: _data } = await getVisitationTarget();
            setCurrentVisit({
                current: _data.data.totalCompleted,
                target: _data.data.visitationTarget
            });
            setIsTargetLoading(false);
        } catch (err) {
            console.log("error catch 1:: ", err);
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
    }, []);

    const fetchVisitations = React.useCallback(
        async (date: moment.Moment, search?: string) => {
            setIsLoading(true);
            setIsError(false);
            try {
                const options = {
                    page,
                    search: search || searchQuery,
                    ...(!search &&
                        !searchQuery && {
                            date: date.valueOf()
                        })
                };
                const { data: _data } = await getAllVisitations(options);
                const displayData =
                    _data.data?.data?.map((el: any) => {
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
                            location: location ? location : "-",
                            time,
                            status,
                            pilStatus
                        };
                    }) || [];

                if (page > 1) {
                    setData({
                        ..._data.data,
                        data: data.data.concat(displayData)
                    });
                } else {
                    setData({
                        ..._data.data,
                        data: displayData
                    });
                }
                setIsLoading(false);
            } catch (error) {
                console.log("error catch 2:: ", error);
                setIsLoading(false);
                setIsError(true);
                setErrorMessage(error.message);
            }
        },
        [data.data, page, searchQuery]
    );

    useFocusEffect(
        React.useCallback(() => {
            fetchTarget();
            fetchVisitations(selectedDate);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [fetchTarget, selectedDate, isModalVisible])
    );

    const renderUpdateDialog = () => {
        return (
            <Portal>
                <Dialog
                    visible={isUpdateDialogVisible}
                    dismissable={!isForceUpdate(force_update)}
                    onDismiss={() =>
                        setUpdateDialogVisible(!isUpdateDialogVisible)
                    }
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
                                    setUpdateDialogVisible(
                                        !isUpdateDialogVisible
                                    )
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
    };

    const renderPoNumber = () => {
        return (
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
    };

    const renderContinueData = () => {
        return (
            <>
                <View style={style.popupSPHContent}>
                    {feature === "PO" ? (
                        renderPoNumber()
                    ) : (
                        <BVisitationCard
                            item={{
                                name: sphData?.selectedCompany?.name,
                                location:
                                    sphData?.selectedCompany?.locationAddress
                                        ?.line1
                            }}
                            isRenderIcon={false}
                        />
                    )}
                </View>
                <BSpacer size={"medium"} />
                <BText bold="300" sizeInNumber={14} style={style.popupSPHDesc}>
                    {`${feature} yang lama akan hilang kalau Anda buat ${feature} yang baru`}
                </BText>
                <BSpacer size={"small"} />
            </>
        );
    };

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
        setData({ totalItems: 0, currentPage: 0, totalPage: 0, data: [] });
        setSelectedDate(dateTime);
    }, []);

    const routes: { title: string; totalItems: number }[] =
        React.useMemo(() => {
            return [
                {
                    key: "first",
                    title: "Proyek",
                    totalItems: data.totalItems || 0,
                    chipPosition: "right"
                }
            ];
        }, [data]);

    const onEndReached = React.useCallback(() => {
        if (data.totalPage) {
            if (data.totalPage > 0 && page < data.totalPage) {
                setPage(page + 1);
            }
        }
    }, [data.totalPage, page]);

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
            }
        ];

        if (!enable_sph) {
            const filtered = buttons.filter((item) => {
                return item.title !== HOME_MENU.SPH;
            });
            buttons = filtered;
        }

        if (!enable_po) {
            const filtered = buttons.filter((item) => {
                return item.title !== HOME_MENU.PO;
            });
            buttons = filtered;
        }

        if (!enable_deposit) {
            const filtered = buttons.filter((item) => {
                return item.title !== HOME_MENU.DEPOSIT;
            });
            buttons = filtered;
        }

        if (!enable_create_schedule) {
            const filtered = buttons.filter((item) => {
                return item.title !== HOME_MENU.SCHEDULE;
            });
            buttons = filtered;
        }

        if (!enable_appointment) {
            const filtered = buttons.filter((item) => {
                return item.title !== HOME_MENU.APPOINTMENT;
            });
            buttons = filtered;
        }

        if (!enable_signed_so) {
            const filtered = buttons.filter((item) => {
                return item.title !== HOME_MENU.SIGN_SO;
            });
            buttons = filtered;
        }
        return buttons;
    };

    const todayMark = React.useMemo(() => {
        return [
            {
                date: moment(),
                lines: [
                    {
                        color: colors.primary
                    }
                ]
            }
        ];
    }, []);

    const onChangeSearch = (text: string) => {
        setSearchQuery(text);
        onChangeWithDebounce(text);
    };

    const reset = (text: string) => {
        setData({
            totalItems: 0,
            currentPage: 0,
            totalPage: 0,
            data: []
        });
        setPage(1);
        fetchVisitations(selectedDate, text);
    };

    const onChangeWithDebounce = React.useCallback(debounce(reset, 500), []);

    const onRetryFetchVisitation = () => {
        setPage(1);
        setData({
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
            const response = await dispatch(
                getOneVisitation({ visitationId: dataItem.id })
            ).unwrap();

            dispatch(closePopUp());
            if (status === "Belum Selesai") {
                navigation.navigate(CAMERA, {
                    photoTitle: "Kunjungan",
                    navigateTo: CREATE_VISITATION,
                    closeButton: true,
                    existingVisitation: response
                });
            } else {
                navigation.navigate(CUSTOMER_DETAIL_V1, {
                    existingVisitation: response
                });
            }
        } catch (error) {
            console.log("error catch 3:: ", error);
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
                hideModalContentWhileAnimating={true}
                coverScreen={false}
                onBackButtonPress={toggleModal("close")}
                onModalHide={() => {
                    fetchVisitations(selectedDate);
                }}
            >
                <View style={style.modalContent}>
                    <BSpacer size={"extraSmall"} />
                    <BCommonSearchList
                        placeholder="Cari PT / Proyek"
                        index={index}
                        onIndexChange={setIndex}
                        onPressMagnify={kunjunganAction}
                        onClearValue={() => {
                            if (searchQuery && searchQuery.trim() !== "") {
                                setSearchQuery("");
                            } else {
                                toggleModal("close")();
                            }
                        }}
                        autoFocus={true}
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
                        data={data.data}
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
                maxVisitation={currentVisit.target}
                currentVisitaion={currentVisit.current}
                isLoading={isTargetLoading}
            />

            <BSpacer size="small" />
            <BQuickAction buttonProps={getButtonsMenu()} />

            <BBottomSheet
                onChange={bottomSheetOnchange}
                percentSnapPoints={snapPoints}
                ref={bottomSheetRef}
                enableContentPanningGesture={true}
                handleIndicatorStyle={style.handleIndicator}
                style={style.BsheetStyle}
                footerComponent={(props: any) => {
                    if (!isRenderDateDaily) {
                        return null;
                    }

                    if (enable_visitation)
                        return BuatKunjungan(props, kunjunganAction);
                }}
            >
                <View style={style.posRelative}>
                    <TouchableOpacity
                        style={style.touchable}
                        onPress={() => {
                            toggleModal("open")();
                        }}
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
                <BSpacer size={"verySmall"} />
                <DateDaily
                    markedDatesArray={todayMark}
                    isRender={isRenderDateDaily}
                    onDateSelected={onDateSelected}
                    selectedDate={selectedDate}
                />
                <BSpacer size={"extraSmall"} />
                <BottomSheetFlatlist
                    isLoading={isLoading}
                    data={data.data}
                    onAction={onRetryFetchVisitation}
                    isError={isError}
                    errorMessage={errorMessage}
                    searchQuery={searchQuery}
                    onEndReached={onEndReached}
                    onPressItem={
                        enable_customer_detail ? visitationOnPress : undefined
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
                    cancelText={"Buat Baru"}
                    actionText={"Lanjutkan"}
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
};

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
export default Beranda;
