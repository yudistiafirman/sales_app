import crashlytics from "@react-native-firebase/crashlytics";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useMachine } from "@xstate/react";
import React from "react";
import {
    StyleSheet,
    SafeAreaView,
    DeviceEventEmitter,
    Linking,
    Platform
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import displayOperationListMachine from "@/machine/displayOperationListMachine";
import EntryType from "@/models/EnumModel";
import {
    CAMERA,
    LOCATION,
    OPERATION,
    SUBMIT_FORM,
    driversFileName,
    driversFileType
} from "@/navigation/ScreenNames";
import {
    OperationProjectDetails,
    onChangeInputValue,
    onChangeProjectDetails,
    setAllOperationPhoto,
    setAllOperationVideo,
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
import { colors, fonts } from "@/constants";
import OperationList from "./element/OperationList";

const style = StyleSheet.create({
    container: {
        flex: 1
    }
});

function Operation() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const [doListState, send] = useMachine(displayOperationListMachine);
    const [isUpdateDialogVisible, setUpdateDialogVisible] =
        React.useState(false);
    const {
        userData,
        selectedBatchingPlant,
        batchingPlants,
        remoteConfigData
    } = useSelector((state: RootState) => state.auth);
    const { projectDetails, photoFiles } = useSelector(
        (state: RootState) => state.operation
    );
    const {
        operationListData,
        isLoadMore,
        isLoading,
        isRefreshing,
        searchQuery
    } = doListState.context;

    /* eslint-disable @typescript-eslint/naming-convention */

    const { force_update } = remoteConfigData;

    useFocusEffect(
        React.useCallback(() => {
            send("assignUserData", {
                payload: userData?.type,
                selectedBP: selectedBatchingPlant
            });
            send("backToGetDO", {
                userType: userData?.type,
                selectedBP: selectedBatchingPlant
            });
        }, [send, selectedBatchingPlant])
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

    React.useEffect(() => {
        crashlytics().log(
            userData?.type ? userData?.type : "Operation Default"
        );
        DeviceEventEmitter.addListener("Operation.refreshlist", () => {
            send("onRefreshList", {
                payload: userData?.type,
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

    const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
        // NOTE: currently driver only

        dispatch(setExistingFiles({ files: item?.DeliveryOrderFile }));
        dispatch(
            onChangeInputValue({
                inputType: "recepientName",
                value: item?.recipientName
            })
        );
        dispatch(
            onChangeInputValue({
                inputType: "recepientPhoneNumber",
                value: item?.recipientNumber
            })
        );
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
            (it) => it?.type === driversFileType[0]
        );
        if (existingFirstPhoto && existingFirstPhoto?.length > 0) {
            const BEFiles = mapDOPhotoFromBE(
                item?.DeliveryOrderFile,
                userData?.type
            );
            dispatch(
                setAllOperationPhoto({
                    file: [
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[0]
                                )?.file || null,
                            attachType: driversFileName[0]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[1]
                                )?.file || null,
                            attachType: driversFileName[1]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[2]
                                )?.file || null,
                            attachType: driversFileName[2]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[3]
                                )?.file || null,
                            attachType: driversFileName[3]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[4]
                                )?.file || null,
                            attachType: driversFileName[4]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[5]
                                )?.file || null,
                            attachType: driversFileName[5]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[6]
                                )?.file || null,
                            attachType: driversFileName[6]
                        },
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[7]
                                )?.file || null,
                            attachType: driversFileName[7]
                        }
                    ]
                })
            );
            dispatch(
                setAllOperationVideo({
                    file: [
                        {
                            file:
                                BEFiles?.find(
                                    (it) =>
                                        it?.attachType === driversFileName[8]
                                )?.file || null,
                            attachType: driversFileName[8],
                            isVideo: true
                        },
                        {
                            file: null,
                            attachType: driversFileName[7],
                            isVideo: true
                        }
                    ]
                })
            );
            navigation.navigate(SUBMIT_FORM, {
                operationType: userData?.type
            });
        } else {
            dispatch(
                setAllOperationPhoto({
                    file: [
                        { file: null, attachType: driversFileName[0] },
                        { file: null, attachType: driversFileName[1] },
                        { file: null, attachType: driversFileName[2] },
                        { file: null, attachType: driversFileName[3] },
                        { file: null, attachType: driversFileName[4] },
                        { file: null, attachType: driversFileName[5] },
                        { file: null, attachType: driversFileName[6] },
                        { file: null, attachType: driversFileName[7] }
                    ]
                })
            );
            dispatch(
                setAllOperationVideo({
                    file: [
                        {
                            file: null,
                            attachType: driversFileName[8],
                            isVideo: true
                        },
                        {
                            file: null,
                            attachType: driversFileName[7],
                            isVideo: true
                        }
                    ]
                })
            );
            navigation.navigate(CAMERA, {
                photoTitle: driversFileName[0],
                closeButton: true,
                navigateTo: EntryType.DRIVER,
                operationAddedStep: driversFileName[0]
            });
        }
    };

    const onLocationPress = async (lonlat: {
        longitude: string;
        latitude: string;
    }) => {
        navigation.navigate(LOCATION, {
            coordinate: {
                longitude: safetyCheck(lonlat?.longitude)
                    ? Number(lonlat?.longitude)
                    : undefined,
                latitude: safetyCheck(lonlat?.latitude)
                    ? Number(lonlat?.latitude)
                    : undefined
            },
            isReadOnly: true,
            from: OPERATION
        });
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
                onLocationPress={(lonlat) => onLocationPress(lonlat)}
                onRefresh={() =>
                    send("onRefreshList", {
                        payload: userData?.type,
                        selectedBP: selectedBatchingPlant
                    })
                }
                onRetry={() =>
                    send("retryGettingList", {
                        payload: userData?.type
                    })
                }
                userType={userData?.type}
                searchQuery={searchQuery}
                onSearch={(text: string) =>
                    send("onSearch", {
                        payload: userData?.type,
                        searchKeyword: text,
                        selectedBP: selectedBatchingPlant
                    })
                }
            />

            {renderUpdateDialog()}
        </SafeAreaView>
    );
}

export default Operation;
