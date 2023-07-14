import * as React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { BCommonSearchList } from "@/components";
import { useMachine } from "@xstate/react";
import searchPOMachine from "@/machine/searchPOMachine";
import { QuotationRequests } from "@/interfaces/CreatePurchaseOrder";
import { PurchaseOrdersData } from "@/interfaces/SelectConfirmedPO";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { openPopUp } from "@/redux/reducers/modalReducer";
import SelectedPOModal from "./element/SelectedPOModal";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    }
});

interface IProps {
    dataToGet: "SPHDATA" | "DEPOSITDATA" | "SCHEDULEDATA";
    filterSphDataBy?: "INDIVIDU" | "COMPANY";
    onSubmitData: ({ parentData, data }) => void;
    onDismiss?: () => void;
}

function SelectPurchaseOrderData({
    dataToGet,
    onSubmitData,
    onDismiss,
    filterSphDataBy
}: IProps) {
    const [index, setIndex] = React.useState(0);
    const [state, send] = useMachine(searchPOMachine);
    const [searchQuery, setSearchQuery] = React.useState("");
    const {
        routes,
        poData,
        loadData,
        isModalVisible,
        sphData,
        choosenDataFromList,
        isRefreshing,
        loadMoreData,
        errorGettingListMessage,
        searchValue,
        availableDeposit,
        paymentType
    } = state.context;
    const { selectedBatchingPlant } = useSelector(
        (globalState: RootState) => globalState.auth
    );

    const dispatch = useDispatch();

    React.useEffect(() => {
        send("setDataType", {
            value: dataToGet,
            filterBy: filterSphDataBy,
            selectedBP: selectedBatchingPlant
        });
    }, [dataToGet]);

    const getDataToDisplayInsideModal = () => {
        const companyName = choosenDataFromList?.name;
        const projectId = choosenDataFromList?.id;
        let locationName;
        let listData;
        if (dataToGet === "SPHDATA") {
            locationName =
                choosenDataFromList?.ShippingAddress !== null
                    ? choosenDataFromList?.ShippingAddress?.Postal?.City?.name
                    : "";
            listData = choosenDataFromList?.QuotationRequests;
        } else {
            locationName =
                choosenDataFromList?.address?.line1 !== null
                    ? choosenDataFromList?.address?.line1
                    : "";
            listData = choosenDataFromList?.PurchaseOrders;
        }
        return { companyName, locationName, listData, projectId };
    };

    const getDataToDisplay = () => {
        if (dataToGet === "DEPOSITDATA" || dataToGet === "SCHEDULEDATA") {
            return poData;
        }
        return sphData;
    };

    const { companyName, locationName, listData, projectId } =
        getDataToDisplayInsideModal();

    const onChangeText = (text: string) => {
        setSearchQuery(text);
        send("searching", { value: text, selectedBP: selectedBatchingPlant });
    };

    const onClearValue = () => {
        const checkDismiss = onDismiss || null;
        if (searchValue && searchValue?.trim() !== "") {
            setSearchQuery("");
            send("clearInput");
        } else if (checkDismiss !== null) checkDismiss();
    };

    const onCloseModal = (
        productData: PurchaseOrdersData | QuotationRequests
    ) => {
        const parentData = {
            companyName,
            locationName,
            projectId,
            availableDeposit,
            paymentType
        };
        onSubmitData({ parentData, data: productData });
        send("onCloseModal");
    };

    const onPressList = (data: any) => {
        if (dataToGet === "DEPOSITDATA" || dataToGet === "SCHEDULEDATA") {
            if (data?.PurchaseOrders && data?.PurchaseOrders?.length > 0) {
                send("openingModal", { value: data });
            } else {
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            "Proyek yang di pilih belum memiliki Purchase Order",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } else {
            send("openingModal", { value: data });
        }
    };

    const getPlaceholderName = () => {
        if (dataToGet === "DEPOSITDATA" || dataToGet === "SCHEDULEDATA") {
            return "Cari Pelanggan / Proyek";
        }
        return "Cari Proyek";
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <SelectedPOModal
                isModalVisible={isModalVisible}
                onCloseModal={() => send("onCloseModal")}
                poData={{ companyName, locationName, listData }}
                onPressCompleted={(data) => onCloseModal(data)}
                modalTitle={dataToGet === "SPHDATA" ? "Pilih SPH" : "Pilih PO"}
                isDeposit={dataToGet === "DEPOSITDATA"}
                dataToGet={dataToGet}
                availableDeposit={availableDeposit}
                paymentType={paymentType}
            />
            <BCommonSearchList
                searchQuery={searchQuery}
                onChangeText={onChangeText}
                placeholder={getPlaceholderName()}
                onClearValue={onClearValue}
                index={index}
                routes={routes}
                autoFocus
                emptyText={`${searchQuery} tidak ditemukan!`}
                onIndexChange={setIndex}
                data={getDataToDisplay()}
                loadList={loadData}
                isLoadMore={loadMoreData}
                refreshing={isRefreshing}
                errorMessage={errorGettingListMessage}
                hidePicName
                isError={state.matches("errorGettingList")}
                onRetry={() => send("retryGettingList")}
                onRefresh={() => send("onRefresh")}
                onPressList={onPressList}
            />
        </SafeAreaView>
    );
}

export default SelectPurchaseOrderData;
