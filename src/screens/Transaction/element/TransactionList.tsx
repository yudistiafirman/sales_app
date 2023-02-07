import { layout } from '@/constants';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import TransactionEmpty from './TransactionEmpty';
import TransactionListCard from './TransactionListCard';
import TransactionListShimmer from './TransactionListShimmer';

interface TransactionsData {
  title: string;
  name?: string;
  desc: string;
  status: string;
}

interface TransactionListProps<ArrayOfObject> {
  transactions: ArrayOfObject[];
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
  refreshing?: boolean;
  emptyTransactionName?: string;
  isLoadMore?: boolean;
  loadTransaction?: boolean;
  onRefresh?: () => void;
  onPress?: (data: any) => void;
}

const TransactionList = <ArrayOfObject extends TransactionsData>({
  transactions,
  onEndReached,
  refreshing,
  emptyTransactionName,
  isLoadMore,
  onRefresh,
  loadTransaction,
  onPress = () => {},
}: TransactionListProps<ArrayOfObject>) => {
  const renderItem: ListRenderItem<TransactionsData> = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            onPress(item);
          }}
        >
          <TransactionListCard
            title={item.title}
            name={item.name}
            desc={item.desc}
            status={item.status}
          />
        </TouchableOpacity>
      );
    },
    [onPress]
  );
  return (
    <FlatList
      data={transactions}
      removeClippedSubviews={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      onRefresh={onRefresh}
      contentContainerStyle={{
        marginHorizontal: layout.pad.lg,
        paddingBottom: layout.pad.lg,
      }}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      refreshing={refreshing}
      ListFooterComponent={isLoadMore ? <TransactionListShimmer /> : null}
      ListEmptyComponent={
        loadTransaction ? (
          <TransactionListShimmer />
        ) : (
          <TransactionEmpty emptyTransactionName={emptyTransactionName} />
        )
      }
      renderItem={renderItem}
    />
  );
};

export default TransactionList;
