import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { layout } from '@/constants';
import { ENTRY_TYPE } from '@/models/EnumModel';
import OperationList from '../element/OperationList';
import crashlytics from '@react-native-firebase/crashlytics';
import { TAB_DISPATCH } from '@/navigation/ScreenNames';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';

const Dispatch = () => {
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
      dispatch(resetImageURLS());
    }, [dispatch])
  );

  React.useEffect(() => {
    crashlytics().log(TAB_DISPATCH);
  }, []);

  return (
    <View style={style.container}>
      <OperationList
        role={ENTRY_TYPE.DISPATCH} // change from redux state
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
