import { View, StyleSheet } from 'react-native';
import React, { useCallback } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { resScale } from '@/utils';
import { layout } from '@/constants';
import { BSpacer, BVisitationCard } from '@/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type FooterType = {
  isLoading?: boolean;
  onEndReached?: any;
};
type BottomSheetFlatlistType = {
  data: {
    [key: string]: any;
    name: string;
  }[];
  searchQuery?: string;
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
}: FooterType & BottomSheetFlatlistType) {
  const footerComp = useCallback(
    () => <FooterLoading isLoading={isLoading} />,
    [isLoading]
  );
  const separator = useCallback(() => <BSpacer size={'small'} />, []);

  return (
    <BottomSheetFlatList
      style={style.flatListContainer}
      data={data}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      renderItem={({ item }) => {
        return <BVisitationCard item={item} searchQuery={searchQuery} />;
      }}
      ListFooterComponent={footerComp}
      ItemSeparatorComponent={separator}
      onEndReached={onEndReached}
    />
  );
}

const style = StyleSheet.create({
  flatListContainer: {},
  flatListLoading: {
    marginTop: layout.pad.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: resScale(330),
    height: resScale(60),
    borderRadius: layout.radius.md,
  },
});
