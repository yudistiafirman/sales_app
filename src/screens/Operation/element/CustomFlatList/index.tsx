import { View, StyleSheet, FlatList } from 'react-native';
import React, { useCallback } from 'react';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { resScale } from '@/utils';
import { layout } from '@/constants';
import { BSpacer, BOperationCard } from '@/components';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type FooterType = {
  isLoading?: boolean;
};
type CustomFlatlistType = {
  data: {
    [key: string]: any;
    name: string;
  }[];
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

export default function CustomFlatlist({
  isLoading,
  data,
}: FooterType & CustomFlatlistType) {
  const footerComp = useCallback(
    () => <FooterLoading isLoading={isLoading} />,
    [isLoading]
  );
  const separator = useCallback(() => <BSpacer size={'small'} />, []);

  return (
    <FlatList
      style={style.flatListContainer}
      data={data}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      renderItem={({ item }) => {
        return <BOperationCard item={item} />;
      }}
      ListFooterComponent={footerComp}
      ItemSeparatorComponent={separator}
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
