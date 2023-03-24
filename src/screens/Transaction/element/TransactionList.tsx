import { BEmptyState } from '@/components';
import { layout } from '@/constants';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import TransactionListCard from './TransactionListCard';
import TransactionListShimmer from './TransactionListShimmer';

interface TransactionsData {
  id: string;
  number: string;
  expiredDate: string;
  projectName: string;
  status: string;
  QuotationLetter: any;
  PurchaseOrder: any;
  project?: any;
}

interface TransactionListProps<ArrayOfObject> {
  transactions: ArrayOfObject[];
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
  refreshing?: boolean;
  isLoadMore?: boolean;
  loadTransaction?: boolean;
  onRefresh?: () => void;
  onPress?: (data: any) => void;
  isError?: boolean;
  errorMessage?: string;
  onAction?: () => void;
  selectedType: string;
}

const TransactionList = <ArrayOfObject extends TransactionsData>({
  transactions,
  onEndReached,
  refreshing,
  isError,
  errorMessage,
  onAction,
  isLoadMore,
  onRefresh,
  loadTransaction,
  onPress = () => {},
  selectedType,
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
            number={item.number ? item.number : '-'}
            // TODO: handle from BE, ugly when use mapping in FE side
            projectName={
              item.projectName ? item.projectName : item.project?.name
            }
            status={item.status}
            // TODO: handle from BE, ugly when use mapping in FE side
            name={
              item.SaleOrder
                ? item.SaleOrder?.number
                : item.Schedule
                ? item.Schedule.number
                : item.PurchaseOrder
                ? item.PurchaseOrder?.number
                : item.QuotationLetter?.number
            }
            // TODO: handle from BE, ugly when use mapping in FE side
            nominal={
              (selectedType === 'Deposit' || selectedType === 'Jadwal' || selectedType === 'DO') &&
              item.value
                ? item.value
                : item.totalPrice
            }
            // TODO: handle from BE, ugly when use mapping in FE side
            useBEStatus={selectedType === 'SPH' ? false : true}
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
          <BEmptyState
            emptyText={`Data transaksi mu tidak tersedia, silakan buat ${selectedType} terlebih dahulu.`}
            isError={isError}
            onAction={onAction}
            errorMessage={errorMessage}
          />
        )
      }
      renderItem={renderItem}
    />
  );
};

export default TransactionList;
