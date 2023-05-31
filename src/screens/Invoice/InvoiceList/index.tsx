import { getAllInvoice } from "@/actions/FinanceActions";
import { BEmptyState, BSearchBar, BSpacer } from "@/components";
import BFilterSort from "@/components/molecules/BFilterSort";
import BInvoiceCard from "@/components/molecules/BInvoiceCard";
import BCommonListShimmer from "@/components/templates/BCommonListShimmer";
import { colors, layout } from "@/constants";
import {
    DEBOUNCE_SEARCH,
    DEFAULT_ESTIMATED_LIST_SIZE,
    DEFAULT_ON_END_REACHED_THREHOLD
} from "@/constants/general";
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
            const { search, size, filter } = invoiceData;

            const paymentDurationCheck = filter?.paymentDuration
                ? parseInt(filter?.paymentDuration.toString(), 10)
                : undefined;

            const response = await getAllInvoice(
                size.toString(),
                search?.page === 0 ? "1" : search?.page.toString(),
                search?.searchQuery,
                filter?.paymentMethod,
                paymentDurationCheck
                    ? paymentDurationCheck?.toString()
                    : undefined,
                filter?.paymentStatus.toString(),
                filter?.startDateIssued,
                filter?.endDateIssued,
                filter?.dueDateDifference.toString()
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
                : "Gagal Mengambil data Tagihan";
            dispatch(setErrorMessage({ message: errorMesage }));
        }
    }, DEBOUNCE_SEARCH);

    const onRefresh = () => {
        dispatch(setErrorMessage({ message: "" }));
        dispatch(setRefreshing({ refreshing: true }));
        dispatch(setPage({ page: 1 }));
        dispatch(setInvoiceSearchQuery({ queryValue: "" }));
        dispatch(setInvoceData({ data: [] }));
    };

    const onEndReached = () => {
        const { search, totalPages } = invoiceData;
        if (search?.page <= totalPages) {
            dispatch(setLoadMore({ isLoadMore: true }));
            dispatch(setPage({ page: search.page + 1 }));
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            if (invoiceData?.search?.searchQuery.length > 2) {
                dispatch(setLoading({ isLoading: true }));
                dispatch(setInvoceData({ data: [] }));
                getAllInvoiceData();
            }

            if (invoiceData?.search?.searchQuery.length === 0) {
                getAllInvoiceData();
            }
        }, [invoiceData.search, invoiceData.filter])
    );

    const renderShimmerInvoiceList = () => (
        <View style={styles.shimmer}>
            <BCommonListShimmer />
        </View>
    );

    const onChangeText = (e: string) => {
        dispatch(setPage({ page: 1 }));
        dispatch(setInvoiceSearchQuery({ queryValue: e }));
    };

    const onRetry = () => {
        dispatch(setPage({ page: 1 }));
        dispatch(setInvoiceSearchQuery({ queryValue: "" }));
    };

    const selectedFilterButton = () => {
        let hide = false;
        if (invoiceData?.filter?.paymentMethod !== "") hide = true;
        if (
            invoiceData?.filter?.paymentDuration &&
            parseInt(invoiceData?.filter?.paymentDuration.toString(), 10) > 0
        )
            hide = true;
        if (invoiceData?.filter?.paymentStatus !== "") hide = true;
        if (
            invoiceData?.filter?.startDateIssued !== "" &&
            invoiceData?.filter?.endDateIssued !== ""
        )
            hide = true;
        if (
            invoiceData?.filter?.dueDateDifference &&
            parseInt(invoiceData?.filter?.dueDateDifference.toString(), 10) > 0
        )
            hide = true;

        return hide;
    };

    const renderInvoiceListHeader = () => (
        <View style={styles.headerComponent}>
            <BSearchBar
                outlineStyle={styles.outlineSearchBar}
                placeholder="Cari Tagihan"
                onChangeText={onChangeText}
                value={invoiceData?.search?.searchQuery}
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
                isSortHidden
                isSelectedFilter={selectedFilterButton()}
                onPressSort={() => console.log("sort pressed")}
                onPressFilter={() => navigation.navigate(INVOICE_FILTER)}
            />
            <BSpacer size="verySmall" />
        </View>
    );

    const renderInvoiceCard: ListRenderItem<InvoiceListData> = useCallback(
        ({ item, index }) => {
            const invoiceNo = item?.number ? item?.number : "-";
            const projectName = item?.Project?.displayName
                ? item?.Project?.displayName
                : "-";
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
                    projectName={projectName}
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
                estimatedItemSize={DEFAULT_ESTIMATED_LIST_SIZE}
                onRefresh={onRefresh}
                onEndReachedThreshold={DEFAULT_ON_END_REACHED_THREHOLD}
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
