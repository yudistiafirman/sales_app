import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import React, { useCallback } from 'react';
import { layout } from '@/constants';
import { BEmptyState, BSpacer, BVisitationCard } from '@/components';
import BCommonListShimmer from '@/components/templates/BCommonListShimmer';
import { OperationsDeliveryOrdersListResponse } from '@/interfaces/Operation';
import { ENTRY_TYPE } from '@/models/EnumModel';

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
  const separator = useCallback(() => <BSpacer size={'small'} />, []);

  const renderItem: ListRenderItem<OperationsDeliveryOrdersListResponse> =
    useCallback(({ item }) => {
      return (
        <BVisitationCard
          onPress={() => onPressList(item)}
          onLocationPress={(lonlat) => onLocationPress(lonlat)}
          item={{
            name: item?.number,
            picOrCompanyName: item?.project?.projectName,
            unit: `${item?.Schedule?.SaleOrder?.PoProduct?.requestedQuantity} m³`,
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
    }, []);

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
            emptyText={
              'Data mu tidak tersedia. Silakan buat DO terlebih dahulu.'
            }
          />
        )
      }
      ListFooterComponent={isLoadMore ? <BCommonListShimmer /> : null}
      ItemSeparatorComponent={separator}
      style={style.flatList}
    />
  );
}

const style = StyleSheet.create({
  flatList: {
    flex: 1,
    width: '100%',
    paddingBottom: layout.pad.lg,
    paddingHorizontal: layout.pad.lg,
  },
});
