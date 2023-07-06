import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
    BEmptyState,
    BSearchBar,
    BSpacer,
    BVisitationCard
} from "@/components";
import BCommonListShimmer from "@/components/templates/BCommonListShimmer";
import { colors, layout } from "@/constants";
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import EntryType from "@/models/EnumModel";
import {
    DEFAULT_ESTIMATED_LIST_SIZE,
    DEFAULT_ON_END_REACHED_THREHOLD
} from "@/constants/general";
import {
    getColorStatusTrx,
    getStatusTrx,
    safetyCheck
} from "@/utils/generalFunc";
import { resScale } from "@/utils";
import { TextInput } from "react-native-paper";

const style = StyleSheet.create({
    flatList: {
        paddingBottom: layout.pad.lg,
        paddingHorizontal: layout.pad.lg
    },
    outlineSearchBar: {
        borderWidth: 1,
        borderRadius: layout.radius.md,
        borderColor: colors.border.default
    },
    headerComponent: {
        paddingStart: layout.pad.lg,
        paddingEnd: layout.pad.lg,
        paddingBottom: layout.pad.lg,
        borderColor: colors.border.default
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
    searchQuery?: string;
    onSearch?: (text: string) => void;
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
    userType,
    searchQuery,
    onSearch
}: OperationListProps) {
    const onLocationPressCheck = onLocationPress || null;
    const renderItem = (item: OperationsDeliveryOrdersListResponse) => {
        const statusFinal = getStatusTrx(item?.status);
        const { color, textColor } = getColorStatusTrx(statusFinal);
        return (
            <BVisitationCard
                disabled={item?.status === "FINISHED"}
                onPress={() => onPressList(item)}
                onLocationPress={(lonlat) =>
                    onLocationPressCheck !== null &&
                    onLocationPressCheck(lonlat)
                }
                item={{
                    name: item?.number,
                    picOrCompanyName: item?.project?.projectName,
                    unit: `${item?.quantity} m³`,
                    pilStatus: statusFinal,
                    lonlat:
                        userType === EntryType.DRIVER
                            ? {
                                  longitude: safetyCheck(
                                      item?.project?.ShippingAddress?.lon
                                  )
                                      ? item?.project?.ShippingAddress?.lon
                                      : undefined,
                                  latitude: safetyCheck(
                                      item?.project?.ShippingAddress?.lat
                                  )
                                      ? item?.project?.ShippingAddress?.lat
                                      : undefined
                              }
                            : undefined
                }}
                pilStatusColor={color}
                pilStatusTextColor={textColor}
            />
        );
    };

    const separatorRender = () => <BSpacer size="small" />;

    const renderDOListHeader = () => (
        <View style={style.headerComponent}>
            <BSearchBar
                outlineStyle={style.outlineSearchBar}
                placeholder="Cari DO"
                onChangeText={onSearch}
                value={searchQuery}
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
            <BSpacer size="verySmall" />
        </View>
    );

    return (
        <>
            {renderDOListHeader()}
            <FlashList
                estimatedItemSize={DEFAULT_ESTIMATED_LIST_SIZE}
                onEndReachedThreshold={DEFAULT_ON_END_REACHED_THREHOLD}
                data={data}
                onRefresh={onRefresh}
                keyExtractor={(item, index) => index?.toString()}
                refreshing={refreshing}
                onEndReached={onEndReached}
                renderItem={(item) => renderItem(item?.item)}
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
        </>
    );
}
