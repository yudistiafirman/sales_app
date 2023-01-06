import { View, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import resScale from '@/utils/resScale';

import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type visitationType = {
  [key: string]: any;
  name: string;
};

type BTabScreenType = {
  data: visitationType[]; // array of data to render, must have name props for now
  renderItem: (item: visitationType) => JSX.Element; // item to render in flatlist
  isLoading?: boolean;
};

export default function BTabScreen({
  data,
  renderItem,
  isLoading,
}: BTabScreenType) {
  if (isLoading) {
    return (
      <View style={style.flatListLoading}>
        <ShimmerPlaceHolder style={style.flatListShimmer} />
      </View>
    );
  }
  return (
    <View style={style.container}>
      <FlatList
        style={style.flatListContainer}
        data={data}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => {
          return renderItem(item);
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    marginTop: resScale(10),
  },
  flatListLoading: {
    marginTop: resScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: resScale(320),
    height: resScale(60),
    borderRadius: resScale(8),
  },
});
