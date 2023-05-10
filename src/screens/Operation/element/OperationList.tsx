import { StyleSheet, FlatList } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { layout } from "@/constants";
import { BEmptyState, BSpacer, BVisitationCard } from "@/components";
import BCommonListShimmer from "@/components/templates/BCommonListShimmer";
import { OperationsDeliveryOrdersListResponse } from "@/interfaces/Operation";
import { ENTRY_TYPE } from "@/models/EnumModel";

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
  userType?: ENTRY_TYPE;
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
}: OperationListProps) {
  const renderItem = (item: OperationsDeliveryOrdersListResponse) => (
    <BVisitationCard
      onPress={() => onPressList(item)}
      onLocationPress={(lonlat) => onLocationPress(lonlat)}
      item={{
        name: item?.number,
        picOrCompanyName: item?.project?.projectName,
        unit: `${item?.quantity} m³`,
        pilStatus: undefined,
        lonlat:
          userType === ENTRY_TYPE.DRIVER
            ? {
                longitude: item.project?.ShippingAddress?.lon,
                latitude: item.project?.ShippingAddress?.lat,
              }
            : undefined,
      }}
    />
  );

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
      ItemSeparatorComponent={() => <BSpacer size="small" />}
      contentContainerStyle={style.flatList}
    />
  );
}

const style = StyleSheet.create({
  flatList: {
    paddingBottom: layout.pad.lg,
    paddingHorizontal: layout.pad.lg,
  },
});
