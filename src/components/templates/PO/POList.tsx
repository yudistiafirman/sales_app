import { layout } from '@/constants';
import * as React from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import EmptyPO from './EmptyPO';
import POListCard from './POListCard';
import POListShimmer from './POListShimmer';

interface POData {
  companyName: string;
  locationName: string;
  sphs: any[];
  id: string;
}

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

const POList = <ArrayOfObject extends POData>({
  poDatas,
  onEndReached,
  refreshing,
  emptyPOName,
  isLoadMore,
  onRefresh,
  loadPO,
  colorStatus,
  onPress,
}: POListProps<ArrayOfObject>) => {
  const renderItem: ListRenderItem<POData> = React.useCallback(
    ({ item }) => {
      return (
        <POListCard
          key={item.id}
          companyName={item.companyName}
          locationName={item.locationName}
          onPress={() => onPress(item)}
          sphs={item.sphs}
          color={colorStatus}
        />
      );
    },
    [onPress, colorStatus]
  );
  return (
    <FlatList
      data={poDatas}
      removeClippedSubviews={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      onRefresh={onRefresh}
      contentContainerStyle={{ marginHorizontal: layout.pad.lg }}
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
