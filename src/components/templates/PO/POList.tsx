import BVisitationCard from '@/components/molecules/BVisitationCard';
import * as React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import EmptyPO from './EmptyPO';
import POListShimmer from './POListShimmer';
import { visitationDataType } from '@/interfaces';
import BSpacer from '@/components/atoms/BSpacer';
import { CreatedSPHListResponse } from '@/interfaces/createPurchaseOrder';
import { colors } from '@/constants';

interface POListProps {
  poDatas: CreatedSPHListResponse[];
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
  refreshing?: boolean;
  emptyPOName?: string;
  isLoadMore?: boolean;
  loadPO?: boolean;
  onRefresh?: () => void;
  onPress?: (data: any) => void;
  colorStatus?: string;
}

const POList = ({
  poDatas,
  onEndReached,
  refreshing,
  emptyPOName,
  isLoadMore,
  onRefresh,
  loadPO,
  onPress,
}: POListProps) => {
  const renderItem: ListRenderItem<CreatedSPHListResponse> = React.useCallback(
    ({ item, index }) => {
      const constructVisitationData: visitationDataType = {
        id: index,
        name: item.name,
        location: item.ShippingAddress.Postal.City.name,
        pilNames: item.QuotationLetters.map((it) => it.number),
      };
      return (
        <>
          <BSpacer size={'small'} />
          <BVisitationCard
            item={constructVisitationData}
            key={item.id}
            onPress={onPress ? () => onPress(item) : undefined}
            isRenderIcon
            pillColor={colors.status.orange}
          />
        </>
      );
    },
    [onPress]
  );
  return (
    <FlatList
      data={poDatas}
      removeClippedSubviews={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      onRefresh={onRefresh}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      refreshing={refreshing}
      ListFooterComponent={isLoadMore ? <POListShimmer /> : null}
      ListEmptyComponent={
        loadPO ? <POListShimmer /> : <EmptyPO emptyPOName={emptyPOName} />
      }
      renderItem={renderItem}
    />
  );
};

export default POList;
