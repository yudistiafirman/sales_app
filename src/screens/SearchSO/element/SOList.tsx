import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, layout } from '@/constants';
import { BDivider, BEmptyState, BSpacer, BText } from '@/components';
import BCommonListShimmer from '@/components/templates/BCommonListShimmer';

interface SOListProps {
  data: any[];
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
  refreshing?: boolean;
  loadList?: boolean;
  isLoadMore?: boolean;
  onRefresh?: () => void;
  onPressList: (data: any) => void;
  keyword: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export default function SOList({
  data,
  onEndReached,
  refreshing,
  loadList,
  isLoadMore,
  onRefresh,
  onPressList,
  keyword,
  errorMessage,
  onRetry
}: SOListProps) {
  const renderItem = (item: any) => {
    let picOrCompanyName;
    if (item?.Company?.name) {
      picOrCompanyName = item.Company?.name;
    } else if (item?.mainPic?.name) {
      picOrCompanyName = item?.mainPic?.name;
    }
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() => onPressList(item)}
      >
        <BText style={{ flex: 1 }} bold="500" sizeInNumber={14}>
          {item?.PurchaseOrders && item?.PurchaseOrders.length > 0
            ? item?.PurchaseOrders[0].brikNumber
            : '-'}
        </BText>
        <BText style={{ flex: 1 }} bold="400" sizeInNumber={14}>
          {picOrCompanyName ? picOrCompanyName : '-'}
        </BText>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
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
            isError={keyword && keyword.length > 2 ? false : true}
            errorMessage={errorMessage}
            onAction={onRetry}
            emptyText={`SO ${keyword} tidak ditemukan!`}
          />
        )
      }
      ListFooterComponent={isLoadMore ? <BCommonListShimmer /> : null}
      ItemSeparatorComponent={() => (
        <>
          <BSpacer size={'verySmall'} />
          <BDivider borderColor={colors.border.disabled} />
          <BSpacer size={'verySmall'} />
        </>
      )}
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
