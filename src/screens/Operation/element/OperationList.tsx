import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import React, { useCallback } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { layout } from '@/constants';
import { BEmptyState, BSpacer, BVisitationCard } from '@/components';
import { useNavigation } from '@react-navigation/native';
import BCommonListShimmer from '@/components/templates/BCommonListShimmer'
import { ENTRY_TYPE } from '@/models/EnumModel';
import { CAMERA, CREATE_DO } from '@/navigation/ScreenNames';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);


type OperationListType = {
  data: {
    id: string;
    name: string;
    qty?: string;
    status?: string;
    addressID?: string;
  }[];
};

interface OperationListProps {
  data: OperationListType[];
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
  onLocationPress?: (id: string) => void
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

  const renderItem: ListRenderItem<OperationListType> = useCallback(({ item }) => {
    return (
      <BVisitationCard
        onPress={() => onPressList(item)}
        onLocationPress={item.project.Address.id && onLocationPress ? () => onLocationPress(item.project.Address.id) : null}
        item={{
          name: item.number,
          picOrCompanyName: item.project.projectName,
          unit: `${item.Schedule.SaleOrder.PoProduct.requestedQuantity} m³'`,
          pilStatus: item.status,
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
