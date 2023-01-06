import React, { useState, useMemo, useEffect } from 'react';
import BTabScreen from '../molecules/BScreenTab';
import { SceneMap } from 'react-native-tab-view';
import TabSections from '@/components/organism/TabSections';
import colors from '@/constants/colors';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import resScale from '@/utils/resScale';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type BTabViewScreenType = {
  dataToRender: {
    /* data name/ category can be anything, example is -> semua,perusahaan, proyek, PIC etc*/
    [key: string]: {
      [key: string]: any;
      name: string;
    }[];
  };
  renderItem: (item: any) => JSX.Element;
  isLoading?: boolean;
};

type AccumulatorReduceType = { [key: string]: () => JSX.Element };

export default function BTabViewScreen({
  dataToRender,
  renderItem,
  isLoading,
}: BTabViewScreenType) {
  const [indexRoute, setIndexRoute] = useState(0);

  useEffect(() => {
    console.log('====================================');
    console.log(indexRoute, 'indexRoute');
    console.log('====================================');
  }, [indexRoute]);

  const [routes, sceneData] = useMemo(() => {
    const routeKeys = Object.keys(dataToRender);
    const routesArray = routeKeys.map((key) => {
      return {
        key: key,
        title: key, //uppercase the first letter .charAt(0).toUpperCase() + key.slice(1)
        totalItems: dataToRender[key].length,
        chipPosition: 'right',
      };
    });
    const sceneMapData: { [key: string]: () => JSX.Element } = routeKeys.reduce(
      (acc: AccumulatorReduceType, curr: string) => {
        acc[curr] = () =>
          BTabScreen({
            data: dataToRender[curr],
            renderItem: renderItem,
          });
        return acc;
      },
      {}
    );
    return [routesArray, sceneMapData];
  }, [dataToRender, renderItem]);

  const renderScene = SceneMap(sceneData);

  if (isLoading) {
    return (
      <View style={style.loadingContainer}>
        <ShimmerPlaceHolder style={style.loading} />
      </View>
    );
  }
  return (
    <TabSections
      navigationState={{ index: indexRoute, routes }}
      renderScene={renderScene}
      onIndexChange={setIndexRoute}
      indicatorStyle={{
        backgroundColor: colors.primary,
      }}
    />
  );
}

const style = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: resScale(10),
  },
  loading: {
    width: resScale(320),
    height: resScale(60),
    borderRadius: resScale(8),
  },
});
