import BVisitationCard from '@/components/molecules/BVisitationCard';
import { layout,colors } from '@/constants';
import * as React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import EmptyPO from './EmptyPO';
import POListShimmer from './POListShimmer';
import { visitationDataType } from '@/interfaces';
import BSpacer from '@/components/atoms/BSpacer';
import { CreatedSPHListResponse } from '@/interfaces/CreatePurchaseOrder';

type POData = {
  companyName: string;
  locationName: string;
  sphs: any[];
  id: string;
};

type ListRenderItemData = POData & CreatedSPHListResponse;

interface POListProps<ArrayOfObject> {
  poDatas: ArrayOfObject[];
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

const POList = <ArrayOfObject extends ListRenderItemData>({
  poDatas,
  onEndReached,
  refreshing,
  emptyPOName,
  isLoadMore,
  onRefresh,
  loadPO,
  onPress,
}: POListProps<ArrayOfObject>) => {
  const renderItem: ListRenderItem<ListRenderItemData> = React.useCallback(
    ({ item, index }) => {
      const constructVisitationData: visitationDataType = {
        id: index,
        name: item.companyName || item.name,
        location: item.locationName || item.ShippingAddress.Postal.City.name,
        pilNames:
          item?.sphs?.map((it) => it.name) ||
          item?.QuotationRequest?.map((val) => val.QuotationLetter.number),
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
