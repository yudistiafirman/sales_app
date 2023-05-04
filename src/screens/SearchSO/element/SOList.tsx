import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { colors, layout } from '@/constants';
import { BDivider, BEmptyState, BSpacer, BText } from '@/components';
import BCommonListShimmer from '@/components/templates/BCommonListShimmer';
import { FlashList } from '@shopify/flash-list';

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
  onRetry,
}: SOListProps) {
  const renderItem = (item: any) => {
    let picOrCompanyName;
    if (item?.project?.Company?.displayName) {
      picOrCompanyName = item.project?.Company?.displayName;
    } else if (item?.project?.Pic?.name) {
      picOrCompanyName = item?.project?.Pic?.name;
    }
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row' }}
        onPress={() => onPressList(item)}
      >
        <BText style={{ flex: 1 }} bold="500" sizeInNumber={14}>
          {item?.brikNumber ? item?.brikNumber : '-'}
        </BText>
        <BText style={{ flex: 1 }} bold="400" sizeInNumber={14}>
          {picOrCompanyName ? picOrCompanyName : '-'}
        </BText>
      </TouchableOpacity>
    );
  };

  const isSearch = keyword && keyword.length > 2 ? false : true;
  return (
    <FlashList
      estimatedItemSize={10}
      onEndReachedThreshold={0.5}
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
            isError={isSearch && errorMessage}
            errorMessage={errorMessage}
            onAction={onRetry}
            emptyText={
              keyword
                ? `SO ${keyword} tidak ditemukan!`
                : 'Data SO tidak tersedia. Silakan buat terlebih dahulu.'
            }
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
      contentContainerStyle={{
        paddingBottom: layout.pad.md,
        paddingHorizontal: layout.pad.lg,
      }}
    />
  );
}

const style = StyleSheet.create({
  flatList: {
    flex: 1,
    width: '100%',
  },
});
