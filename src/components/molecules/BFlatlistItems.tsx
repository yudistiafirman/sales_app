import { View, FlatList, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import resScale from '@/utils/resScale';
import EmptyProduct from '../templates/Price/EmptyProduct';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { layout } from '@/constants';
import BSpacer from '../atoms/BSpacer';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type visitationType = {
  [key: string]: any;
  name: string;
};

type BTabScreenType = {
  data?: visitationType[]; // array of data to render, must have name props for now
  renderItem: (item: visitationType | any, query?: string) => JSX.Element; // item to render in flatlist
  isLoading?: boolean;
  searchQuery?: string;
  onEndReached?:
    | ((info: {
        distanceFromEnd: number;
        currentPage: number;
      }) => Promise<visitationType[] | undefined>)
    | null
    | undefined;
  refreshing?: boolean;
  initialFetch?: () => Promise<visitationType[] | undefined>;
};
function FlatListFooter(isLoading?: boolean) {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={style.flatListLoading}>
      <ShimmerPlaceHolder style={style.flatListShimmer} />
    </View>
  );
}
export default function BFlatlistItems({
  renderItem,
  // isLoading,
  searchQuery,
  onEndReached,
  refreshing,
  initialFetch,
}: BTabScreenType) {
  const [flatListDatas, setFlatListDatas] = useState<visitationType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialFetch) {
      (async () => {
        setIsLoading(true);
        const initialData = await initialFetch();
        setIsLoading(false);
        if (initialData) {
          setFlatListDatas(initialData);
        }
      })();
    }
    return () => {
      console.log('-----------flatlist cleanup?');
      setFlatListDatas([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const separator = useCallback(() => <BSpacer size={'small'} />, []);

  return (
    <View style={style.container}>
      <FlatList
        onEndReached={async (info) => {
          // console.log('onEndReached info comp', info);

          if (onEndReached && info.distanceFromEnd >= 1) {
            setIsLoading(true);
            const newData = await onEndReached({ ...info, currentPage });
            setIsLoading(false);
            setCurrentPage((current) => current + 1);
            //console.log(newData, 'newData'); //onEndReached
            // const fetchNewDataFunc = onEndReached(info);

            // const newData = await fetchNewDataFunc();
            if (newData) {
              setFlatListDatas((current) => {
                return current.concat(newData);
                // return [...current, ...newData];
              });
            }
          }
        }}
        onEndReachedThreshold={0.3}
        refreshing={refreshing}
        style={style.flatListContainer}
        data={flatListDatas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return renderItem(item);
        }}
        ListFooterComponent={() => FlatListFooter(isLoading)}
        ListEmptyComponent={() => {
          if (isLoading) {
            return null;
          }
          return EmptyProduct({ emptyProductName: searchQuery });
        }}
        ItemSeparatorComponent={separator}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    marginTop: layout.pad.md,
  },
  flatListLoading: {
    marginTop: layout.pad.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: resScale(330),
    height: resScale(60),
    borderRadius: resScale(8),
  },
});
