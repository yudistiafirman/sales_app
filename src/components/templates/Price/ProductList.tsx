import BSpinner from '@/components/atoms/BSpinner';
import PriceListCard from '@/components/templates/Price/PriceListCard';
import resScale from '@/utils/resScale';
import React from 'react';
import { FlatList } from 'react-native';
import EmptyProduct from './EmptyProduct';

interface productsData {
  name?: string;
  price?: {
    id: string;
    price: number;
  };
  category: {
    name?: string;
    parent?: {
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
}

const ProductList = <ArrayOfObject extends productsData>({
  products,
  onEndReached,
  refreshing,
  emptyProductName,
  isLoadMore,
}: ProductListProps<ArrayOfObject>) => {
  return (
    <FlatList
      data={products}
      contentContainerStyle={{ marginHorizontal: resScale(16) }}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={onEndReached}
      refreshing={refreshing}
      ListFooterComponent={isLoadMore ? <BSpinner /> : null}
      ListEmptyComponent={<EmptyProduct emptyProductName={emptyProductName} />}
      renderItem={({ item }) => (
        <PriceListCard
          productName={item.name}
          productPrice={item.price.price}
          categories={item.category.parent.name}
        />
      )}
    />
  );
};

export default ProductList;
