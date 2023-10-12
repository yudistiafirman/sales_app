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
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import displayOperationListMachine from "@/machine/displayOperationListMachine";
import EntryType from "@/models/EnumModel";
import {
    CAMERA,
    LOCATION,
    OPERATION,
    SUBMIT_FORM,
    driversFileName,
    driversFileType,
    securityDispatchFileName,
    securityDispatchFileType,
    securityReturnFileName,
    securityReturnFileType
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
import LocalFileType from "@/interfaces/LocalFileType";
import OperationList from "./element/OperationList";
import ArriveAndDepartPopUp from "./ArrivalAndDeparturePopup";

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

    const setOperationValue = (item: OperationsDeliveryOrdersListResponse) => {
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
    };

    const goToCameraPage = (fileName: string, navigateTo: string) => {
        navigation.navigate(CAMERA, {
            photoTitle: fileName,
            closeButton: true,
            navigateTo,
            operationAddedStep: fileName
        });
    };

    const setDriverExistingPhoto = (files: LocalFileType[]) => {
        dispatch(
            setAllOperationPhoto({
                file: [
                    {
                        file:
                            files?.find(
                                (it) => it?.attachType === driversFileName[0]
                            )?.file || null,
                        attachType: driversFileName[0]
                    },
                    {
                        file:
                            files?.find(
                                (it) => it?.attachType === driversFileName[1]
                            )?.file || null,
                        attachType: driversFileName[1]
                    },
                    {
                        file:
                            files?.find(
                                (it) => it?.attachType === driversFileName[2]
                            )?.file || null,
                        attachType: driversFileName[2]
                    },
                    {
                        file:
                            files?.find(
                                (it) => it?.attachType === driversFileName[3]
                            )?.file || null,
                        attachType: driversFileName[3]
                    },
                    {
                        file:
                            files?.find(
                                (it) => it?.attachType === driversFileName[4]
                            )?.file || null,
                        attachType: driversFileName[4]
                    },
                    {
                        file:
                            files?.find(
                                (it) => it?.attachType === driversFileName[5]
                            )?.file || null,
                        attachType: driversFileName[5]
                    },
                    {
                        file:
                            files?.find(
                                (it) => it?.attachType === driversFileName[6]
                            )?.file || null,
                        attachType: driversFileName[6]
                    },
                    {
                        file:
                            files?.find(
                                (it) => it?.attachType === driversFileName[7]
                            )?.file || null,
                        attachType: driversFileName[7]
                    }
                ]
            })
        );
    };

    const setDriverExistingVideo = (files: LocalFileType[]) => {
        const addedFile: LocalFileType[] = [];
        files
            .sort((a, b) =>
                a.attachType! > b.attachType!
                    ? 1
                    : b.attachType! > a.attachType!
                    ? -1
                    : 0
            )
            .filter((it) => it.attachType?.toLowerCase()?.includes("video"))
            .forEach((it, index) => {
                addedFile.push({
                    file: it.file,
                    attachType: `Penuangan Ke-${index + 1}`,
                    isVideo: true,
                    isFromPicker: false
                });
            });
        const filteredFiles = addedFile.filter((it) => it.file != null).length;
        addedFile.push({
            file: null,
            isFromPicker: false,
            isVideo: true,
            type: "COVER",
            attachType: `Penuangan Ke-${filteredFiles + 1}`
        });
        dispatch(
            setAllOperationVideo({
                file: addedFile
            })
        );
    };

    const setSecurityReturnExistingPhoto = (files: LocalFileType[]) => {
        dispatch(
            setAllOperationPhoto({
                file: [
                    {
                        file:
                            files?.find(
                                (it) =>
                                    it?.attachType === securityReturnFileName[0]
                            )?.file || null,
                        attachType: securityReturnFileName[0]
                    },
                    {
                        file:
                            files?.find(
                                (it) =>
                                    it?.attachType === securityReturnFileName[1]
                            )?.file || null,
                        attachType: securityReturnFileName[1]
                    }
                ]
            })
        );
    };

    const setSecurityDispatchExistingPhoto = (files: LocalFileType[]) => {
        dispatch(
            setAllOperationPhoto({
                file: [
                    {
                        file:
                            files?.find(
                                (it) =>
                                    it?.attachType ===
                                    securityDispatchFileName[0]
                            )?.file || null,
                        attachType: securityDispatchFileName[0]
                    },
                    {
                        file:
                            files?.find(
                                (it) =>
                                    it?.attachType ===
                                    securityDispatchFileName[1]
                            )?.file || null,
                        attachType: securityDispatchFileName[1]
                    },
                    {
                        file:
                            files?.find(
                                (it) =>
                                    it?.attachType ===
                                    securityDispatchFileName[2]
                            )?.file || null,
                        attachType: securityDispatchFileName[2]
                    },
                    {
                        file:
                            files?.find(
                                (it) =>
                                    it?.attachType ===
                                    securityDispatchFileName[3]
                            )?.file || null,
                        attachType: securityDispatchFileName[3]
                    },
                    {
                        file:
                            files?.find(
                                (it) =>
                                    it?.attachType ===
                                    securityDispatchFileName[4]
                            )?.file || null,
                        attachType: securityDispatchFileName[4]
                    }
                ]
            })
        );
    };

    const setNewDriverPhoto = () => {
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
    };

    const setNewDriverVideo = () => {
        dispatch(
            setAllOperationVideo({
                file: [
                    {
                        file: null,
                        attachType: driversFileName[8],
                        isVideo: true
                    }
                ]
            })
        );
    };

    const setNewReturnPhoto = () => {
        dispatch(
            setAllOperationPhoto({
                file: [
                    {
                        file: null,
                        attachType: securityReturnFileName[0]
                    },
                    {
                        file: null,
                        attachType: securityReturnFileName[1]
                    }
                ]
            })
        );
    };

    const setNewDispatchPhoto = () => {
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
    };

    const onGoToSubmitForm = (
        item: OperationsDeliveryOrdersListResponse,
        entry: {
            type: EntryType.DISPATCH | EntryType.RETURN | EntryType.DRIVER;
        }
    ) => {
        setOperationValue(item);

        if (entry.type === EntryType.RETURN) {
            dispatch(
                onChangeInputValue({
                    inputType: "truckMixCondition",
                    value: item?.conditionTruck
                })
            );
        }

        let existingFirstPhoto;

        if (entry.type === EntryType.DRIVER) {
            existingFirstPhoto = item?.DeliveryOrderFile?.filter(
                (it) => it?.type === driversFileType[0]
            );
        } else if (entry.type === EntryType.RETURN) {
            existingFirstPhoto = item?.DeliveryOrderFile?.filter(
                (it) => it?.type === securityReturnFileType[0]
            );
        } else if (entry.type === EntryType.DISPATCH) {
            existingFirstPhoto = item?.DeliveryOrderFile?.filter(
                (it) => it?.type === securityDispatchFileType[0]
            );
        }

        if (existingFirstPhoto && existingFirstPhoto?.length > 0) {
            const files = mapDOPhotoFromBE(item?.DeliveryOrderFile, entry.type);
            if (entry.type === EntryType.DRIVER) {
                setDriverExistingPhoto(files);
                setDriverExistingVideo(files);
            } else if (entry.type === EntryType.RETURN) {
                setSecurityReturnExistingPhoto(files);
                setIsVisiblePopup(false);
            } else if (entry.type === EntryType.DISPATCH) {
                setSecurityDispatchExistingPhoto(files);
                setIsVisiblePopup(false);
            }

            navigation.navigate(SUBMIT_FORM, {
                operationType: entry.type
            });
        } else if (entry.type === EntryType.DRIVER) {
            setNewDriverPhoto();
            setNewDriverVideo();
            goToCameraPage(driversFileName[0], EntryType.DRIVER);
            setIsVisiblePopup(false);
        } else if (entry.type === EntryType.RETURN) {
            setNewReturnPhoto();
            setIsVisiblePopup(false);
            goToCameraPage(securityReturnFileName[0], EntryType.RETURN);
        } else if (entry.type === EntryType.DISPATCH) {
            setNewDispatchPhoto();
            setIsVisiblePopup(false);
            goToCameraPage(securityDispatchFileName[0], EntryType.DISPATCH);
        }
    };

    const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
        setDoItems(item);
        if (userData?.type === EntryType.SECURITY) {
            setIsVisiblePopup(true);
        } else {
            onGoToSubmitForm(item, { type: EntryType.DRIVER });
        }
    };

    const onClickArrivalOrDepature = (entry: {
        type: EntryType.DISPATCH | EntryType.RETURN;
    }) => {
        onGoToSubmitForm(doItem, entry);
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
            <ArriveAndDepartPopUp
                onClose={() => setIsVisiblePopup(false)}
                isVisible={isVisiblePopup}
                onPressArrival={onClickArrivalOrDepature}
                onPressDeparture={onClickArrivalOrDepature}
            />
        </SafeAreaView>
    );
}

export default Operation;
