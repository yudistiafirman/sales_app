import crashlytics from "@react-native-firebase/crashlytics";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useMachine } from "@xstate/react";
import React, { useState } from "react";
import {
    StyleSheet,
    SafeAreaView,
    DeviceEventEmitter,
    Linking,
    Platform
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fonts, layout } from "@/constants";
import colors from "@/constants/colors";
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import displayOperationListMachine from "@/machine/displayOperationListMachine";
import EntryType from "@/models/EnumModel";
import {
    CAMERA,
    SUBMIT_FORM,
    securityDispatchFileName,
    securityDispatchFileType
} from "@/navigation/ScreenNames";
import {
    OperationProjectDetails,
    onChangeProjectDetails,
    setAllOperationPhoto,
    setExistingFiles
} from "@/redux/reducers/operationReducer";
import { AppDispatch, RootState } from "@/redux/store";
import {
    getAppVersionName,
    getMinVersionUpdate,
    isDevelopment,
    isForceUpdate,
    mapDOPhotoFromBE,
    safetyCheck
} from "@/utils/generalFunc";
import { Button, Dialog, Portal } from "react-native-paper";
import { BText } from "@/components";
import OperationList from "../element/OperationList";
import ArriveAndDepartPopUp from "./Popup";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingBottom: layout.pad.lg
    }
});

function Security() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const [doListState, send] = useMachine(displayOperationListMachine);
    const {
        userData,
        selectedBatchingPlant,
        batchingPlants,
        remoteConfigData
    } = useSelector((state: RootState) => state.auth);
    const { projectDetails, photoFiles } = useSelector(
        (state: RootState) => state.operation
    );
    const [isUpdateDialogVisible, setUpdateDialogVisible] =
        React.useState(false);
    const {
        operationListData,
        isLoadMore,
        isLoading,
        isRefreshing,
        searchQuery
    } = doListState.context;
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const [doItem, setDoItems] = useState<
        OperationsDeliveryOrdersListResponse | undefined
    >();

    /* eslint-disable @typescript-eslint/naming-convention */

    const { force_update } = remoteConfigData;

    useFocusEffect(
        React.useCallback(() => {
            send("assignUserData", {
                payload: userData?.type,
                tabActive: "left",
                selectedBP: selectedBatchingPlant
            });
            send("backToGetDO", {
                userType: userData?.type,
                tabActive: "left",
                selectedBP: selectedBatchingPlant
            });
        }, [send, userData?.type, selectedBatchingPlant])
    );

    React.useEffect(() => {
        crashlytics().log(EntryType.SECURITY);
        DeviceEventEmitter.addListener("Operation.refreshlist", () => {
            send("onRefreshList", {
                payload: userData?.type,
                tabActive: "left",
                selectedBP: selectedBatchingPlant
            });
        });

        return () => {
            DeviceEventEmitter.removeAllListeners("Operation.refreshlist");
        };
    }, [
        send,
        userData?.type,
        projectDetails,
        operationListData,
        selectedBatchingPlant
    ]);

    const onGoToSubmitForm = (
        item: OperationsDeliveryOrdersListResponse,
        entry: { type: EntryType.DISPATCH | EntryType.RETURN }
    ) => {
        dispatch(setExistingFiles({ files: item.DeliveryOrderFile }));
        const dataToDeliver: OperationProjectDetails = {
            deliveryOrderId: item?.id ? item?.id : "",
            doNumber: item?.number ? item?.number : "",
            projectName: item?.project?.projectName
                ? item.project.projectName
                : "",
            address: item?.project?.ShippingAddress?.line1
                ? item.project.ShippingAddress.line1
                : "",
            lonlat: {
                longitude: safetyCheck(item?.project?.ShippingAddress?.lon)
                    ? Number(item.project.ShippingAddress.lon)
                    : 0,
                latitude: safetyCheck(item?.project?.ShippingAddress?.lat)
                    ? Number(item.project.ShippingAddress.lat)
                    : 0
            },
            requestedQuantity: item?.quantity ? item?.quantity : 0,
            deliveryTime: item?.date ? item?.date : ""
        };
        dispatch(onChangeProjectDetails({ projectDetails: dataToDeliver }));

        const existingFirstPhoto = item?.DeliveryOrderFile?.filter(
            (it) => it?.type === securityDispatchFileType[0]
        );
        if (existingFirstPhoto && existingFirstPhoto?.length > 0) {
            const BEFiles = mapDOPhotoFromBE(
                item?.DeliveryOrderFile,
                entry.type
            );
            dispatch(
                setAllOperationPhoto({
                    file: [
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType ===
                                        securityDispatchFileName[0]
                                )?.file || null,
                            attachType: securityDispatchFileName[0]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType ===
                                        securityDispatchFileName[1]
                                )?.file || null,
                            attachType: securityDispatchFileName[1]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType ===
                                        securityDispatchFileName[2]
                                )?.file || null,
                            attachType: securityDispatchFileName[2]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType ===
                                        securityDispatchFileName[3]
                                )?.file || null,
                            attachType: securityDispatchFileName[3]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType ===
                                        securityDispatchFileName[4]
                                )?.file || null,
                            attachType: securityDispatchFileName[4]
                        }
                    ]
                })
            );
            navigation.navigate(SUBMIT_FORM, {
                operationType: entry.type
            });
        } else {
            dispatch(
                setAllOperationPhoto({
                    file: [
                        {
                            file: null,
                            attachType: securityDispatchFileName[0]
                        },
                        {
                            file: null,
                            attachType: securityDispatchFileName[1]
                        },
                        {
                            file: null,
                            attachType: securityDispatchFileName[2]
                        },
                        {
                            file: null,
                            attachType: securityDispatchFileName[3]
                        },
                        {
                            file: null,
                            attachType: securityDispatchFileName[4]
                        }
                    ]
                })
            );
            navigation.navigate(CAMERA, {
                photoTitle: securityDispatchFileName[0],
                closeButton: true,
                navigateTo: entry.type,
                operationAddedStep: securityDispatchFileName[0]
            });
        }
        setIsVisiblePopup(false);
    };

    const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
        setDoItems(item);
        setIsVisiblePopup(true);
    };

    const onClickArrivalOrDepature = (entry: {
        type: EntryType.DISPATCH | EntryType.RETURN;
    }) => {
        onGoToSubmitForm(doItem, entry);
    };

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

    React.useEffect(() => {
        let currentVersionName = getAppVersionName();
        if (isDevelopment())
            currentVersionName = currentVersionName?.replace("(Dev)", "");
        setUpdateDialogVisible(
            currentVersionName?.split(".")?.join("") <
                getMinVersionUpdate(force_update)
        );
    }, [force_update]);

    return (
        <SafeAreaView style={style.container}>
            <OperationList
                data={operationListData}
                loadList={isLoading}
                isLoadMore={isLoadMore}
                isError={doListState.matches("errorGettingList")}
                refreshing={isRefreshing}
                onEndReached={() => send("onEndReached")}
                onPressList={(item) => onPressItem(item)}
                onRefresh={() => {
                    send("onRefreshList", {
                        payload: userData?.type,
                        tabActive: "left",
                        selectedBP: selectedBatchingPlant
                    });
                }}
                onRetry={() =>
                    send("retryGettingList", {
                        payload: userData?.type,
                        tabActive: "left"
                    })
                }
                userType={userData?.type}
                searchQuery={searchQuery}
                onSearch={(text: string) =>
                    send("onSearch", {
                        payload: userData?.type,
                        tabActive: "left",
                        searchKeyword: text,
                        selectedBP: selectedBatchingPlant
                    })
                }
            />
            {renderUpdateDialog()}
            <ArriveAndDepartPopUp
                isVisible={isVisiblePopup}
                onPressArrival={onClickArrivalOrDepature}
                onPressDeparture={onClickArrivalOrDepature}
            />
        </SafeAreaView>
    );
}

export default Security;
