import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import resScale from '@/utils/resScale';
import { layout } from '@/constants';
import CustomFlatlist from './element/CustomFlatList';

const Operation = () => {
  const [isLoading] = useState(false);

  const data = useMemo(
    () =>
      Array(8)
        .fill(0)
        .map((_) => {
          return {
            id: 'SCH/BRIK/2022/11/00254',
            name: 'Proyek Ruko 2 lantai',
            // qty: '7 m3',
            status: 'Dalam Produksi',
          };
        }),
    []
  );

  return (
    <View style={style.container}>
      <CustomFlatlist isLoading={isLoading} data={data} />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'blue',
    width: '100%',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
  BsheetStyle: {
    paddingLeft: layout.pad.lg,
    paddingRight: layout.pad.lg,
  },
  flatListContainer: {},
  flatListLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListShimmer: {
    width: resScale(330),
    height: resScale(60),
    borderRadius: layout.radius.md,
  },
  modalContent: {
    flex: 1,
  },
  posRelative: {
    position: 'relative',
    marginBottom: resScale(10),
  },
  touchable: {
    position: 'absolute',
    width: '100%',
    borderRadius: resScale(4),
    height: resScale(45),
    zIndex: 2,
  },
});
export default Operation;
