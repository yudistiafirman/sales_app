import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { ListRenderItem } from "react-native";
import { BEmptyState, BSpacer } from "@/components";
import { layout } from "@/constants";
import {
    DEFAULT_ESTIMATED_LIST_SIZE,
    DEFAULT_ON_END_REACHED_THREHOLD
} from "@/constants/general";
import TransactionListCard from "./TransactionListCard";
import TransactionListShimmer from "./TransactionListShimmer";

interface TransactionsData {
    id: string;
    number: string;
    expiredDate: string;
    projectName: string;
    status: string;
    QuotationLetter: any;
    PurchaseOrder: any;
    project?: any;
}

interface TransactionListProps<ArrayOfObject> {
    transactions: ArrayOfObject[];
    onEndReached?:
        | ((info: { distanceFromEnd: number }) => void)
        | null
        | undefined;
    refreshing?: boolean;
    isLoadMore?: boolean;
    loadTransaction?: boolean;
    onRefresh?: () => void;
    onPress?: (data: any) => void;
    isError?: boolean;
    errorMessage?: string;
    onAction?: () => void;
    selectedType: string;
}

function TransactionList<ArrayOfObject extends TransactionsData>({
    transactions,
    onEndReached,
    refreshing,
    isError,
    errorMessage,
    onAction,
    isLoadMore,
    onRefresh,
    loadTransaction,
    onPress = () => {},
    selectedType
}: TransactionListProps<ArrayOfObject>) {
    const renderItem: ListRenderItem<TransactionsData> = useCallback(
        ({ item }) => (
            <TouchableOpacity onPress={() => onPress(item)}>
                <TransactionListCard
                    number={item.number ? item.number : "-"}
                    // TODO: handle from BE, ugly when use mapping in FE side
                    projectName={
                        item.QuotationRequest?.Project
                            ? item.QuotationRequest?.Project.projectName
                            : item.project?.projectName
                            ? item.project?.projectName
                            : item.Account?.Project?.name
                            ? item.Account?.Project?.name
                            : "-"
                    }
                    status={item.status}
                    // TODO: handle from BE, ugly when use mapping in FE side
                    name={
                        item.SaleOrder
                            ? item.SaleOrder?.number
                            : item.Schedule
                            ? item.Schedule.number
                            : item.PurchaseOrder
                            ? item.PurchaseOrder?.number
                            : item.QuotationLetter?.number
                            ? item.QuotationLetter?.number
                            : item.Payment?.SaleOrder?.number
                            ? item.Payment?.SaleOrder?.number
                            : selectedType !== "SPH"
                            ? "-"
                            : undefined
                    }
                    // TODO: handle from BE, ugly when use mapping in FE side
                    nominal={
                        (selectedType === "Deposit" ||
                            selectedType === "Jadwal" ||
                            selectedType === "DO") &&
                        item.value
                            ? item.value
                            : item.totalPrice
                            ? item.totalPrice
                            : item.amount
                    }
                    // TODO: handle from BE, ugly when use mapping in FE side
                    useBEStatus={selectedType !== "SPH"}
                />
            </TouchableOpacity>
        ),
        [onPress]
    );

    const renderSeparator = () => <BSpacer size={layout.pad.md} />;

    return (
        <FlashList
            estimatedItemSize={DEFAULT_ESTIMATED_LIST_SIZE}
            onEndReachedThreshold={DEFAULT_ON_END_REACHED_THREHOLD}
            data={transactions}
            onRefresh={onRefresh}
            contentContainerStyle={{
                paddingTop: layout.pad.lg,
                paddingHorizontal: layout.pad.lg
            }}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={onEndReached}
            refreshing={refreshing}
            ListFooterComponent={isLoadMore ? <TransactionListShimmer /> : null}
            ItemSeparatorComponent={renderSeparator}
            ListEmptyComponent={
                loadTransaction ? (
                    <TransactionListShimmer />
                ) : (
                    <BEmptyState
                        emptyText={`Data transaksi mu tidak tersedia, silakan buat ${selectedType} terlebih dahulu.`}
                        isError={isError}
                        onAction={onAction}
                        errorMessage={errorMessage}
                    />
                )
            }
            renderItem={renderItem}
        />
    );
}

export default TransactionList;
