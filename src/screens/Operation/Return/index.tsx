import crashlytics from "@react-native-firebase/crashlytics";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useMachine } from "@xstate/react";
import React from "react";
import { StyleSheet, SafeAreaView, DeviceEventEmitter } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors, layout } from "@/constants";
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import displayOperationListMachine from "@/machine/displayOperationListMachine";
import EntryType from "@/models/EnumModel";
import {
    CAMERA,
    SUBMIT_FORM,
    TAB_RETURN,
    TAB_WB_IN,
    securityReturnFileName,
    wbsOutFileName
} from "@/navigation/ScreenNames";
import {
    OperationProjectDetails,
    onChangeProjectDetails,
    setAllOperationPhoto
} from "@/redux/reducers/operationReducer";
import { AppDispatch, RootState } from "@/redux/store";
import { safetyCheck } from "@/utils/generalFunc";
import OperationList from "../element/OperationList";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingBottom: layout.pad.lg
    }
});

function Return() {
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
                tabActive: "right",
                selectedBP: selectedBatchingPlant
            });
            send("backToGetDO", {
                userType: userData?.type,
                tabActive: "right",
                selectedBP: selectedBatchingPlant
            });
        }, [send, userData?.type, selectedBatchingPlant])
    );

    React.useEffect(() => {
        crashlytics().log(EntryType.SECURITY ? TAB_RETURN : TAB_WB_IN);
        DeviceEventEmitter.addListener("Operation.refreshlist", () => {
            send("onRefreshList", {
                payload: userData?.type,
                tabActive: "right",
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
        if (projectDetails && projectDetails?.deliveryOrderId === item?.id) {
            navigation.navigate(SUBMIT_FORM, {
                operationType:
                    userData?.type === EntryType.SECURITY
                        ? EntryType.RETURN
                        : EntryType.IN
            });
        } else {
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
            } else {
                dispatch(
                    setAllOperationPhoto({
                        file: [
                            { file: null, attachType: wbsOutFileName[0] },
                            { file: null, attachType: wbsOutFileName[1] }
                        ]
                    })
                );
            }

            // dispatch(setAllOperationPhoto({ file: [{ file: null }] }));
            navigation.navigate(CAMERA, {
                photoTitle: "DO",
                navigateTo:
                    userData?.type === EntryType.SECURITY
                        ? EntryType.RETURN
                        : EntryType.IN,
                operationAddedStep: "DO"
            });
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
                onRefresh={() =>
                    send("onRefreshList", {
                        payload: userData?.type,
                        tabActive: "right",
                        selectedBP: selectedBatchingPlant
                    })
                }
                onRetry={() =>
                    send("retryGettingList", {
                        payload: userData?.type,
                        tabActive: "right"
                    })
                }
                userType={userData?.type}
                searchQuery={searchQuery}
                onSearch={(text: string) =>
                    send("onSearch", {
                        payload: userData?.type,
                        tabActive: "right",
                        searchKeyword: text,
                        selectedBP: selectedBatchingPlant
                    })
                }
            />
        </SafeAreaView>
    );
}

export default Return;
