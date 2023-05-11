import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { SceneMap } from 'react-native-tab-view';
import resScale from '@/utils/resScale';
import colors from '@/constants/colors';
import { layout } from '@/constants';
import BTabSections from './TabSections';

const style = StyleSheet.create({
  loadingContainer: {
    // flex: 1,
    alignItems: 'center',
    marginTop: layout.pad.md,
  },
  tabLoading: {
    marginTop: layout.pad.xs,
    width: resScale(325),
    height: resScale(30),
    borderRadius: layout.radius.md,
  },
  listLoading: {
    marginTop: layout.pad.lg,
    width: resScale(325),
    height: resScale(60),
    borderRadius: layout.radius.md,
  },
});

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type BTabViewScreenType = {
  searchQuery?: string;
  // renderItem: (item: any) => JSX.Element;
  screenToRender: (key: string) => JSX.Element | null;
  isLoading?: boolean;
  tabToRender: {
    tabTitle: string;
    totalItems: number;
  }[];
};

type AccumulatorReduceType = { [key: string]: () => JSX.Element | null };

export default function BTabViewScreen({
  isLoading,
  tabToRender = [],

  screenToRender,
}: BTabViewScreenType) {
  const [indexRoute, setIndexRoute] = useState(0);

  const [routes] = useMemo(() => {
    const routesArray = tabToRender.map(key => ({
      key: key.tabTitle,
      title: key.tabTitle, // uppercase the first letter .charAt(0).toUpperCase() + key.slice(1)
      totalItems: key.totalItems,
      chipPosition: 'right',
    }));
    return [routesArray];
  }, [tabToRender]);

  const sceneData = useMemo(() => {
    const sceneMapData: { [key: string]: () => JSX.Element | null } = tabToRender.reduce(
      (acc: AccumulatorReduceType, curr) => {
        acc[curr.tabTitle] = () => {
          if (!screenToRender) {
            return null;
          }
          return screenToRender(curr.tabTitle);
        };
        return acc;
      },
      {}
    );
    return sceneMapData;
  }, [screenToRender, tabToRender]);

  const renderScene = SceneMap(sceneData);

  return (
    <View style={{ flex: 1 }}>
      <BTabSections
        navigationState={{ index: indexRoute, routes }}
        renderScene={renderScene}
        onIndexChange={setIndexRoute}
        indicatorStyle={{
          backgroundColor: colors.primary,
        }}
      />
      {isLoading && (
        <View style={style.loadingContainer}>
          <ShimmerPlaceHolder style={style.tabLoading} />
          <ShimmerPlaceHolder style={style.listLoading} />
        </View>
      )}
    </View>
  );
}
