import PriceListCard from '@/components/templates/Price/PriceListCard';
import { layout } from '@/constants';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import EmptyProduct from './EmptyProduct';
import PriceListShimmer from './PriceListShimmer';

interface productsData {
  display_name?: string;
  calcPrice: number;
  properties: {
    fc: string;
    fs: string;
    sc: string;
    slump: number;
  };
  Category: {
    name?: string;
    Parent?: {
      name: string;
    };
  };
}

interface ProductListProps<ArrayOfObject> {
  products: ArrayOfObject[];
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
  refreshing?: boolean;
  emptyProductName?: string;
  isLoadMore?: boolean;
  loadProduct?: boolean;
  onRefresh?: () => void;
}

const ProductList = <ArrayOfObject extends productsData>({
  products,
  onEndReached,
  refreshing,
  emptyProductName,
  isLoadMore,
  onRefresh,
  loadProduct,
}: ProductListProps<ArrayOfObject>) => {
  const renderItem: ListRenderItem<productsData> = useCallback(({ item }) => {
    const fc =
      item?.properties?.fc?.length > 0 ? ` / FC${item.properties.fc}` : '';
    return (
      <PriceListCard
        productName={`${item?.display_name}${fc}`}
        productPrice={item?.calcPrice}
        categories={item?.Category?.Parent?.name}
        slump={item?.properties?.slump}
      />
    );
  }, []);
  return (
    <FlatList
      data={products}
      removeClippedSubviews={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      onRefresh={onRefresh}
      contentContainerStyle={{ marginHorizontal: layout.pad.lg }}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      refreshing={refreshing}
      ListFooterComponent={isLoadMore ? <PriceListShimmer /> : null}
      ListEmptyComponent={
        loadProduct ? (
          <PriceListShimmer />
        ) : (
          <EmptyProduct emptyProductName={emptyProductName} />
        )
      }
      renderItem={renderItem}
    />
  );
};

export default ProductList;
