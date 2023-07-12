import crashlytics from "@react-native-firebase/crashlytics";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useMachine } from "@xstate/react";
import React from "react";
import { StyleSheet, SafeAreaView, DeviceEventEmitter } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { layout } from "@/constants";
import colors from "@/constants/colors";
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import displayOperationListMachine from "@/machine/displayOperationListMachine";
import EntryType from "@/models/EnumModel";
import {
    CAMERA,
    SUBMIT_FORM,
    TAB_DISPATCH,
    TAB_WB_OUT,
    securityDispatchFileName,
    securityDispatchFileType,
    wbsOutFileName,
    wbsOutFileType
} from "@/navigation/ScreenNames";
import {
    OperationProjectDetails,
    onChangeInputValue,
    onChangeProjectDetails,
    setAllOperationPhoto,
    setExistingFiles
} from "@/redux/reducers/operationReducer";
import { AppDispatch, RootState } from "@/redux/store";
import { mapDOPhotoFromBE, safetyCheck } from "@/utils/generalFunc";
import OperationList from "../element/OperationList";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingBottom: layout.pad.lg
    }
});

function Dispatch() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const [doListState, send] = useMachine(displayOperationListMachine);
    const { userData, selectedBatchingPlant, batchingPlants } = useSelector(
        (state: RootState) => state.auth
    );
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
        crashlytics().log(EntryType.SECURITY ? TAB_DISPATCH : TAB_WB_OUT);
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

    const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
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
        if (userData?.type === EntryType.SECURITY) {
            const existingFirstPhoto = item?.DeliveryOrderFile?.filter(
                (it) => it?.type === securityDispatchFileType[0]
            );
            if (existingFirstPhoto && existingFirstPhoto?.length > 0) {
                const BEFiles = mapDOPhotoFromBE(
                    item?.DeliveryOrderFile,
                    EntryType.DISPATCH
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
                    operationType: EntryType.DISPATCH
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
                    navigateTo: EntryType.DISPATCH,
                    operationAddedStep: securityDispatchFileName[0]
                });
            }
        } else {
            const weight = item?.Weight?.find(
                (it) => it?.type === wbsOutFileType[0]
            )?.weight;
            dispatch(
                onChangeInputValue({
                    inputType: "weightBridge",
                    value: weight !== undefined ? weight.toString() : undefined
                })
            );

            const existingFirstPhoto = item?.DeliveryOrderFile?.filter(
                (it) => it?.type === wbsOutFileType[0]
            );
            if (existingFirstPhoto && existingFirstPhoto?.length > 0) {
                const BEFiles = mapDOPhotoFromBE(
                    item?.DeliveryOrderFile,
                    EntryType.OUT
                );
                dispatch(
                    setAllOperationPhoto({
                        file: [
                            {
                                file:
                                    BEFiles?.find(
                                        (it) =>
                                            it?.attachType === wbsOutFileName[0]
                                    )?.file || null,
                                attachType: wbsOutFileName[0]
                            },
                            {
                                file:
                                    BEFiles?.find(
                                        (it) =>
                                            it?.attachType === wbsOutFileName[1]
                                    )?.file || null,
                                attachType: wbsOutFileName[1]
                            }
                        ]
                    })
                );
                navigation.navigate(SUBMIT_FORM, {
                    operationType: EntryType.OUT
                });
            } else {
                dispatch(
                    setAllOperationPhoto({
                        file: [
                            { file: null, attachType: wbsOutFileName[0] },
                            { file: null, attachType: wbsOutFileName[1] }
                        ]
                    })
                );
                navigation.navigate(CAMERA, {
                    photoTitle: wbsOutFileName[0],
                    closeButton: true,
                    navigateTo: EntryType.OUT,
                    operationAddedStep: wbsOutFileName[0]
                });
            }
        }
    };

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
        </SafeAreaView>
    );
}

export default Dispatch;
