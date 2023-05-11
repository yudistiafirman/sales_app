import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { BSpacer, BVisitationCard } from '@/components';
import EmptyState from '@/components/organism/BEmptyState';
import { layout } from '@/constants';
import { visitationDataType } from '@/interfaces';
import { resScale } from '@/utils';

const style = StyleSheet.create({
  flatListContainer: {},
  flatListLoading: {
    marginTop: layout.pad.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: '100%',
    height: resScale(60),
    borderRadius: layout.radius.md,
  },
});

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type FooterType = {
  isLoading?: boolean;
  onEndReached?: any;
};
// type visitationDataType = {
//   id?: number;
//   name: string;
//   location?: string;
//   time?: string;
//   status?: string;
//   pilNames?: string[];
//   pilStatus?: string;
// };
type BottomSheetFlatlistType = {
  data: visitationDataType[];
  searchQuery?: string;
  onPressItem?: (data: visitationDataType) => void;
  isError?: boolean;
  errorMessage?: string | unknown;
  onAction?: () => void;
};

function FooterLoading({ isLoading }: FooterType) {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={style.flatListLoading}>
      <ShimmerPlaceHolder style={style.flatListShimmer} />
    </View>
  );
}

export default function BottomSheetFlatlist({
  isLoading,
  data,
  searchQuery,
  onEndReached,
  onPressItem,
  isError,
  errorMessage,
  onAction,
}: FooterType & BottomSheetFlatlistType) {
  const footerComp = useCallback(() => <FooterLoading isLoading={isLoading} />, [isLoading]);
  const separator = useCallback(() => <BSpacer size="extraSmall" />, []);
  const renderEmptyComponent = () => {
    if (isLoading) {
      return null;
    }
    return (
      <EmptyState
        onAction={onAction}
        isError={isError}
        errorMessage={errorMessage}
        emptyText="Belum ada kunjungan di hari ini!"
      />
    );
  };

  return (
    <BottomSheetFlatList
      style={style.flatListContainer}
      data={data}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      renderItem={({ item }) => (
        <BVisitationCard
          item={item}
          searchQuery={searchQuery}
          onPress={() => {
            if (onPressItem) {
              onPressItem(item);
            }
          }}
        />
      )}
      ListFooterComponent={footerComp}
      ItemSeparatorComponent={separator}
      onEndReached={onEndReached}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
}
