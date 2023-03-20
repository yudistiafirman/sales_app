import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import React, { useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { layout } from '@/constants';
import { BEmptyState, BSpacer, BVisitationCard } from '@/components';
import BCommonListShimmer from '@/components/templates/BCommonListShimmer'
import { OperationsDeliveryOrdersListResponse } from '@/interfaces/Operation';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

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
  onLocationPress: (lonlat: { longitude: string, latitude: string }) => void
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
  onLocationPress
}: OperationListProps) {

  const separator = useCallback(() => <BSpacer size={'small'} />, []);

  const renderItem: ListRenderItem<OperationsDeliveryOrdersListResponse> = useCallback(({ item }) => {
    return (
      <BVisitationCard
        onPress={() => onPressList(item)}
        onLocationPress={(lonlat) => onLocationPress(lonlat)}
        item={{
          name: item?.number,
          picOrCompanyName: item?.project?.projectName,
          unit: `${item?.Schedule?.SaleOrder?.PoProduct?.requestedQuantity} m³`,
          pilStatus: item?.status,
          lonlat: { longitude: item.project?.Address?.lon!, latitude: item.project?.Address?.lat! }

        }}
      />
    )
  }, [])

  return (
    <FlatList
      data={data}
      removeClippedSubviews={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      onRefresh={onRefresh}
      keyExtractor={(item, index) => index.toString()}
      refreshing={refreshing}
      onEndReached={onEndReached}
      renderItem={renderItem}
      ListEmptyComponent={
        loadList || refreshing ? (
          <BCommonListShimmer />
        ) : (
          <BEmptyState
            errorMessage={errorMessage}
            isError={isError}
            onAction={onRetry}
          />
        )
      }
      ListFooterComponent={
        isLoadMore ? (
          <BCommonListShimmer />
        ) : null
      }
      ItemSeparatorComponent={separator}
    />
  );
}

const style = StyleSheet.create({
  flatList: {
    flex: 1,
    paddingBottom: layout.pad.lg,
    paddingHorizontal: layout.pad.lg,
    borderWidth: 1
  },
});
