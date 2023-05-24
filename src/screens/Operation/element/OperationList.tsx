import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { BEmptyState, BSpacer, BVisitationCard } from "@/components";
import BCommonListShimmer from "@/components/templates/BCommonListShimmer";
import { layout } from "@/constants";
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import EntryType from "@/models/EnumModel";

const style = StyleSheet.create({
    flatList: {
        paddingBottom: layout.pad.lg,
        paddingHorizontal: layout.pad.lg
    }
});

interface OperationListProps {
    data: OperationsDeliveryOrdersListResponse[];
    onEndReached?:
        | ((info: { distanceFromEnd: number }) => void)
        | null
        | undefined;
    refreshing?: boolean;
    loadList?: boolean;
    isLoadMore?: boolean;
    onRefresh?: () => void;
    onPressList: (data: any) => void;
    errorMessage?: any;
    isError?: boolean;
    onRetry?: () => void;
    onLocationPress?: (lonlat: { longitude: string; latitude: string }) => void;
    userType?: EntryType;
}

export default function OperationList({
    data,
    onEndReached,
    refreshing,
    loadList,
    isLoadMore,
    onRefresh,
    onPressList,
    errorMessage,
    isError,
    onRetry,
    onLocationPress,
    userType
}: OperationListProps) {
    const onLocationPressCheck = onLocationPress || null;
    const renderItem = (item: OperationsDeliveryOrdersListResponse) => (
        <BVisitationCard
            onPress={() => onPressList(item)}
            onLocationPress={(lonlat) =>
                onLocationPressCheck !== null && onLocationPressCheck(lonlat)
            }
            item={{
                name: item?.number,
                picOrCompanyName: item?.project?.projectName,
                unit: `${item?.quantity} m³`,
                pilStatus: undefined,
                lonlat:
                    userType === EntryType.DRIVER
                        ? {
                              longitude: item.project?.ShippingAddress?.lon,
                              latitude: item.project?.ShippingAddress?.lat
                          }
                        : undefined
            }}
        />
    );

    const separatorRender = () => {
        return <BSpacer size="small" />;
    };

    return (
        <FlashList
            estimatedItemSize={10}
            onEndReachedThreshold={0.5}
            data={data}
            // removeClippedSubviews={false}
            // initialNumToRender={10}
            // maxToRenderPerBatch={10}
            onRefresh={onRefresh}
            keyExtractor={(item, index) => index.toString()}
            refreshing={refreshing}
            onEndReached={onEndReached}
            renderItem={(item) => renderItem(item.item)}
            ListEmptyComponent={
                loadList || refreshing ? (
                    <BCommonListShimmer />
                ) : (
                    <BEmptyState
                        errorMessage={errorMessage}
                        isError={isError}
                        onAction={onRetry}
                        emptyText="Data mu tidak tersedia. Silakan buat DO terlebih dahulu."
                    />
                )
            }
            ListFooterComponent={isLoadMore ? <BCommonListShimmer /> : null}
            ItemSeparatorComponent={separatorRender}
            contentContainerStyle={style.flatList}
        />
    );
}
