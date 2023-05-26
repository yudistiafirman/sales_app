import { getAllInvoice } from "@/actions/FinanceActions";
import { BEmptyState, BSearchBar, BSpacer } from "@/components";
import BFilterSort from "@/components/molecules/BFilterSort";
import BInvoiceCard from "@/components/molecules/BInvoiceCard";
import BCommonListShimmer from "@/components/templates/BCommonListShimmer";
import { colors, layout } from "@/constants";
import { InvoiceListData } from "@/models/Invoice";
import {
    setErrorMessage,
    setInvoceData,
    setInvoiceSearchQuery,
    setLoadMore,
    setLoading,
    setPage,
    setRefreshing,
    setTotalPage
} from "@/redux/reducers/invoiceReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import { formatRawDateToMonthDateYear } from "@/utils/generalFunc";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderColor: colors.border.default,
        flex: 1
    },
    outlineSearchBar: {
        borderWidth: 1,
        borderRadius: layout.radius.md,
        borderColor: colors.border.default
    },
    headerComponent: {
        padding: layout.pad.lg,
        borderColor: colors.border.default
    },
    shimmer: {
        paddingHorizontal: layout.pad.lg
    }
});

function InvoiceList() {
    const invoiceData = useSelector((state: RootState) => state.invoice);
    const dispatch = useDispatch();

    const getAllInvoiceData = async () => {
        try {
            dispatch(setLoading({ isLoading: true }));
            const { page, size, searchQuery } = invoiceData;

            const response = await getAllInvoice(
                size.toString(),
                page.toString(),
                searchQuery
            );
            if (response?.data?.data?.data) {
                dispatch(setLoading({ isLoading: false }));
                dispatch(setLoadMore({ isLoadMore: false }));
                dispatch(setRefreshing({ refreshing: false }));
                dispatch(setErrorMessage({ message: "" }));
                const invoiceListData = [
                    ...invoiceData.invoiceData,
                    ...response.data.data.data
                ];
                dispatch(
                    setTotalPage({ totalPage: response.data.data.totalPages })
                );
                dispatch(setInvoceData({ data: invoiceListData }));
            } else {
                dispatch(setLoading({ isLoading: false }));
                dispatch(setLoadMore({ isLoadMore: false }));
                dispatch(setRefreshing({ refreshing: false }));
                dispatch(setInvoceData({ data: [] }));
                dispatch(
                    setErrorMessage({ message: "Data tidak terdefinisi" })
                );
            }
        } catch (error) {
            dispatch(setLoading({ isLoading: false }));
            dispatch(setRefreshing({ refreshing: false }));
            dispatch(setLoadMore({ isLoadMore: false }));
            const errorMesage = error?.message
                ? error?.message
                : "Gagal Mengambil data List Invoice";
            dispatch(setErrorMessage({ message: errorMesage }));
        }
    };

    const onRefresh = () => {
        dispatch(setRefreshing({ refreshing: true }));
        dispatch(setPage({ page: 0 }));
        dispatch(setInvoceData({ data: [] }));
    };

    const onEndReached = () => {
        const { page, totalPages } = invoiceData;
        if (page <= totalPages) {
            dispatch(setLoadMore({ isLoadMore: true }));
            dispatch(setPage({ page: page + 1 }));
        }
    };

    useEffect(() => {
        getAllInvoiceData();
    }, [
        invoiceData.isRefreshing,
        invoiceData.isLoadMore,
        invoiceData.page,
        invoiceData.searchQuery
    ]);

    const renderShimmerInvoiceList = () => (
        <View style={styles.shimmer}>
            <BCommonListShimmer />
        </View>
    );

    const onChangeText = (e: string) => {
        dispatch(setInvoiceSearchQuery({ queryValue: e }));
    };

    const renderInvoiceListHeader = () => (
        <>
            <BSearchBar
                outlineStyle={styles.outlineSearchBar}
                placeholder="Cari Invoice"
                onChangeText={onChangeText}
                value={invoiceData.searchQuery}
                textInputStyle={{ minHeight: resScale(42) }}
                left={
                    <TextInput.Icon
                        size={layout.pad.xl}
                        disabled
                        icon="magnify"
                    />
                }
            />
            <BSpacer size="small" />
            <BFilterSort
                onPressSort={() => console.log("sort pressed")}
                onPressFilter={() => console.log("filter pressed")}
            />
            <BSpacer size="verySmall" />
        </>
    );

    const renderInvoiceCard: ListRenderItem<InvoiceListData> = useCallback(
        ({ item, index }) => {
            const invoiceNo = item?.number ? item?.number : "-";
            const companyName = item?.Project?.Customer?.displayName
                ? item?.Project?.Customer?.displayName
                : "-";
            const amount = item?.total ? item?.total : 0;
            const paymentStatus = item?.status ? item?.status : "-";
            const paymentMethod = item?.Project?.Customer?.paymentType
                ? `Pembayaran ${item?.Project?.Customer?.paymentType}`
                : "-";
            const dueDateDays = "45";
            const billingDate = item?.issuedDate
                ? formatRawDateToMonthDateYear(item?.issuedDate)
                : "-";
            const pastDueDateDays = "45";
            const dueDate = "1 Jan 2023";
            return (
                <BInvoiceCard
                    invoiceNo={invoiceNo}
                    companyName={companyName}
                    amount={amount}
                    paymentStatus={paymentStatus}
                    paymentMethod={paymentMethod}
                    dueDateDays={dueDateDays}
                    billingDate={billingDate}
                    pastDueDateDays={pastDueDateDays}
                    dueDate={dueDate}
                />
            );
        },
        []
    );

    return (
        <View style={styles.container}>
            <FlashList
                data={invoiceData.invoiceData}
                refreshing={invoiceData.isRefreshing}
                renderItem={renderInvoiceCard}
                estimatedItemSize={200}
                onRefresh={onRefresh}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                ListHeaderComponent={renderInvoiceListHeader}
                ListHeaderComponentStyle={styles.headerComponent}
                ListFooterComponent={
                    invoiceData.isLoadMore ? renderShimmerInvoiceList() : null
                }
                ListEmptyComponent={
                    invoiceData.isLoading ? (
                        renderShimmerInvoiceList()
                    ) : (
                        <BEmptyState
                            errorMessage={invoiceData.errorMessage}
                            isError={invoiceData.length > 0}
                            // onAction={onRetry}
                            emptyText="Data Tidak Ditemukan"
                        />
                    )
                }
            />
        </View>
    );
}

export default InvoiceList;
