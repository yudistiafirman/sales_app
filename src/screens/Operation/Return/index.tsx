import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ENTRY_TYPE } from '@/models/EnumModel';
import OperationList from '../element/OperationList';
import crashlytics from '@react-native-firebase/crashlytics';
import { OPERATION, TAB_RETURN } from '@/navigation/ScreenNames';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';

const Return = () => {
  const dispatch = useDispatch();
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

  useFocusEffect(
    React.useCallback(() => {
      dispatch(resetImageURLS({ source: OPERATION }));
    }, [dispatch])
  );

  React.useEffect(() => {
    crashlytics().log(TAB_RETURN);
  }, []);

  return (
    <View style={style.container}>
      <OperationList
        role={ENTRY_TYPE.RETURN}
        isLoading={isLoading}
        data={data}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Return;
