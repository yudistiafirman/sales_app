import { View, StyleSheet, Text } from 'react-native';
import React, { useCallback } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { resScale } from '@/utils';
import { layout } from '@/constants';
import { BSpacer, BVisitationCard } from '@/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { visitationDataType } from '@/interfaces';
import EmptyProduct from '@/components/templates/Price/EmptyProduct';
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
};

const FooterLoading = ({ isLoading }: FooterType) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={style.flatListLoading}>
      <ShimmerPlaceHolder style={style.flatListShimmer} />
    </View>
  );
};

export default function BottomSheetFlatlist({
  isLoading,
  data,
  searchQuery,
  onEndReached,
  onPressItem,
}: FooterType & BottomSheetFlatlistType) {
  const footerComp = useCallback(
    () => <FooterLoading isLoading={isLoading} />,
    [isLoading]
  );
  const separator = useCallback(() => <BSpacer size={'extraSmall'} />, []);

  return (
    <BottomSheetFlatList
      style={style.flatListContainer}
      data={data}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      renderItem={({ item }) => {
        return (
          <BVisitationCard
            item={item}
            searchQuery={searchQuery}
            onPress={() => {
              if (onPressItem) {
                onPressItem(item);
              }
            }}
          />
        );
      }}
      ListFooterComponent={footerComp}
      ItemSeparatorComponent={separator}
      onEndReached={onEndReached}
      ListEmptyComponent={() => {
        if (isLoading) {
          return null;
        }
        return (
          <EmptyProduct emptyText="Tidak ada data kunjungan, silakan ganti tanggal kunjungan!" />
        );
      }}
    />
  );
}

const style = StyleSheet.create({
  flatListContainer: {
  },
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
