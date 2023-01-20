import BSpinner from '@/components/atoms/BSpinner';
import PriceListCard from '@/components/templates/Price/PriceListCard';
import { layout } from '@/constants';
import resScale from '@/utils/resScale';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import EmptyProduct from './EmptyProduct';
import PriceListShimmer from './PriceListShimmer';

interface productsData {
  name?: string;
  Price?: {
    id: string;
    price: number;
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
  onPress?: (data: any) => void;
}

const ProductList = <ArrayOfObject extends productsData>({
  products,
  onEndReached,
  refreshing,
  emptyProductName,
  isLoadMore,
  onRefresh,
  loadProduct,
  onPress = () => {},
}: ProductListProps<ArrayOfObject>) => {
  const renderItem = useCallback(({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onPress(item);
        }}
      >
        <PriceListCard
          productName={item?.name}
          productPrice={item?.Price?.price}
          categories={item?.Category?.Parent?.name}
        />
      </TouchableOpacity>
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
