import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { layout } from '@/constants';
import OperationList from './element/OperationList';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { useFocusEffect } from '@react-navigation/native';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { OPERATION } from '@/navigation/ScreenNames';

const Operation = () => {
  const dispatch = useDispatch();
  const [isLoading] = useState(false);
  const { entryType } = useSelector((state: RootState) => state.auth);

  const data = useMemo(
    () =>
      Array(8)
        .fill(0)
        .map((_) => {
          return {
            id: 'SCH/BRIK/2022/11/00254',
            name: 'Proyek Ruko 2 lantai',
            qty: '7 m3',
            // status: 'Dalam Produksi',
          };
        }),
    []
  );

  useFocusEffect(
    React.useCallback(() => {
      dispatch(resetImageURLS({ source: OPERATION }));
    }, [dispatch])
  );

  React.useEffect(() => {
    crashlytics().log(entryType ? ENTRY_TYPE[entryType] : 'Operation Default');
  }, [entryType]);

  return (
    <View style={style.container}>
      <OperationList role={entryType} isLoading={isLoading} data={data} />
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
export default Operation;
