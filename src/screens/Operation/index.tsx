import React, { useState, useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
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
  const { userData } = useSelector((state: RootState) => state.auth);

  const data = useMemo(
    () =>
      Array(8)
        .fill(0)
        .map((_) => {
          return {
            id: 'SCH/BRIK/2022/11/00254',
            name: 'Proyek Ruko 2 lantai',
            qty: '7 m3',
            status: 'Dalam Produksi',
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
    crashlytics().log(userData?.type ? ENTRY_TYPE[userData.type] : 'Operation Default');
  }, [userData?.type]);

  return (
    <SafeAreaView style={style.container}>
      <OperationList role={userData?.type} isLoading={isLoading} data={data} />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Operation;
