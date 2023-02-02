import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { layout } from '@/constants';
import { USER_TYPE } from '@/models/EnumModel';
import CustomFlatlist from '../element/CustomFlatList';

const Dispatch = () => {
  const [isLoading] = useState(false);

  const data = useMemo(
    () =>
      Array(8)
        .fill(0)
        .map((_) => {
          return {
            id: 'DISPATCH/BRIK/2022/11/00254',
            name: 'Proyek Ruko 1 lantai',
            qty: '7 m3',
          };
        }),
    []
  );

  return (
    <View style={style.container}>
      <CustomFlatlist
        role={USER_TYPE.SECURITY} // change from redux state
        isLoading={isLoading}
        data={data}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
    paddingBottom: layout.pad.lg,
  },
});

export default Dispatch;
