import { getAllInvoice } from "@/actions/FinanceActions";
import { BEmptyState, BSearchBar, BSpacer } from "@/components";
import BFilterSort from "@/components/molecules/BFilterSort";
import BInvoiceCard from "@/components/molecules/BInvoiceCard";
import BCommonListShimmer from "@/components/templates/BCommonListShimmer";
import { colors, layout } from "@/constants";
import { DEBOUNCE_SEARCH } from "@/constants/const";
import { InvoiceListData } from "@/models/Invoice";
import { INVOICE_FILTER } from "@/navigation/ScreenNames";

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
import {
    formatRawDateToMonthDateYear,
    translatePaymentStatus
} from "@/utils/generalFunc";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import debounce from "lodash.debounce";
import React, { useCallback } from "react";
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
    const navigation = useNavigation();

    const getAllInvoiceData = debounce(async () => {
        try {
            dispatch(setLoading({ isLoading: true }));
            const {
                page,
                size,
                searchQuery,
                paymentMethod,
                paymentStatus,
                paymentDuration,
                startDateIssued,
                endDateIssued,
                dueDateDifference
            } = invoiceData;

            const paymentDurationCheck = paymentDuration
                ? parseInt(paymentDuration.toString(), 10)
                : undefined;

            const response = await getAllInvoice(
                size.toString(),
                page === 0 ? "1" : page.toString(),
                searchQuery,
                paymentMethod,
                paymentDurationCheck
                    ? paymentDurationCheck?.toString()
                    : undefined,
                paymentStatus.toString(),
                startDateIssued,
                endDateIssued,
                dueDateDifference.toString()
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
    }, DEBOUNCE_SEARCH);

    const onRefresh = () => {
        const { page } = invoiceData;
        dispatch(setErrorMessage({ message: "" }));
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

    useFocusEffect(
        React.useCallback(() => {
            getAllInvoiceData();
        }, [
            invoiceData.isLoadMore,
            invoiceData.page,
            invoiceData.searchQuery,
            invoiceData.paymentMethod,
            invoiceData.paymentDuration,
            invoiceData.paymentStatus,
            invoiceData.startDateIssued,
            invoiceData.endDateIssued,
            invoiceData.dueDateDifference
        ])
    );

    const renderShimmerInvoiceList = () => (
        <View style={styles.shimmer}>
            <BCommonListShimmer />
        </View>
    );

    const onChangeText = (e: string) => {
        if (invoiceData.searchQuery.length > 2) {
            dispatch(setLoading({ isLoading: true }));
            dispatch(setInvoceData({ data: [] }));
            dispatch(setPage({ page: 1 }));
            dispatch(setInvoiceSearchQuery({ queryValue: e }));
        } else {
            dispatch(setInvoiceSearchQuery({ queryValue: e }));
        }
    };

    const onRetry = () => {
        dispatch(setLoading({ isLoading: true }));
        dispatch(setInvoceData({ data: [] }));
        dispatch(setPage({ page: 1 }));
        dispatch(setInvoiceSearchQuery({ queryValue: "" }));
        getAllInvoiceData();
    };

    const renderInvoiceListHeader = () => (
        <View style={styles.headerComponent}>
            <BSearchBar
                outlineStyle={styles.outlineSearchBar}
                placeholder="Cari Invoice"
                onChangeText={onChangeText}
                value={invoiceData.searchQuery}
                autoFocus={false}
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
                onPressFilter={() => navigation.navigate(INVOICE_FILTER)}
            />
            <BSpacer size="verySmall" />
        </View>
    );

    const renderInvoiceCard: ListRenderItem<InvoiceListData> = useCallback(
        ({ item, index }) => {
            const invoiceNo = item?.number ? item?.number : "-";
            const companyName = item?.Project?.Customer?.displayName
                ? item?.Project?.Customer?.displayName
                : "-";
            const amount = item?.total ? item?.total : 0;
            const paymentStatus = item?.status
                ? translatePaymentStatus(item?.status)
                : "-";
            const paymentMethod = item?.Project?.Customer?.paymentType
                ? "Credit"
                : "Cash";
            const dueDateDays = item?.Project?.Customer?.paymentDuration
                ? `${item?.Project?.Customer?.paymentDuration} hari`
                : "-";
            const billingDate = item?.issuedDate
                ? formatRawDateToMonthDateYear(item?.issuedDate)
                : "-";
            const pastDueDateDays = () => {
                let defaultTextDays = "-";
                if (item?.dueDateDifference && item?.status !== "PAID") {
                    defaultTextDays = item?.dueDateDifference.toString();
                    defaultTextDays += " hari";
                }
                return defaultTextDays;
            };

            const renderPastDueDateDaysColor = () => {
                let color = colors.text.darker;
                if (item?.dueDateDifference && item?.status !== "PAID") {
                    if (item?.dueDateDifference < 0) {
                        color = colors.primary;
                    } else if (
                        item?.dueDateDifference >= 0 &&
                        item?.dueDateDifference < 7
                    ) {
                        color = colors.text.secYellow;
                    } else {
                        color = colors.greenLantern;
                    }
                }
                return color;
            };
            const dueDate = item?.dueDate
                ? formatRawDateToMonthDateYear(item?.dueDate)
                : "-";

            return (
                <BInvoiceCard
                    invoiceNo={invoiceNo}
                    companyName={companyName}
                    amount={amount}
                    bgColor={index % 2 ? colors.veryLightShadeGray : ""}
                    paymentStatus={paymentStatus}
                    paymentMethod={paymentMethod}
                    dueDateDays={dueDateDays}
                    billingDate={billingDate}
                    pastDueDateDaysColor={renderPastDueDateDaysColor()}
                    pastDueDateDays={pastDueDateDays()}
                    dueDate={dueDate}
                />
            );
        },
        []
    );

    return (
        <View style={styles.container}>
            {renderInvoiceListHeader()}
            <FlashList
                data={invoiceData.invoiceData}
                refreshing={invoiceData.isRefreshing}
                renderItem={renderInvoiceCard}
                estimatedItemSize={10}
                onRefresh={onRefresh}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                ListFooterComponent={
                    invoiceData.isLoadMore ? renderShimmerInvoiceList() : null
                }
                ListEmptyComponent={
                    invoiceData.isLoading ? (
                        renderShimmerInvoiceList()
                    ) : (
                        <BEmptyState
                            errorMessage={invoiceData.errorMessage}
                            isError={invoiceData?.errorMessage?.length > 0}
                            onAction={onRetry}
                            emptyText="Data Tidak Ditemukan"
                        />
                    )
                }
            />
        </View>
    );
}

export default InvoiceList;
