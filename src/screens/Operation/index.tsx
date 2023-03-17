import React, { useState, useMemo } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import OperationList from './element/OperationList';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { CAMERA, CREATE_DO, OPERATION } from '@/navigation/ScreenNames';
import { useMachine } from '@xstate/react';
import displayOperationListMachine from '@/machine/displayOperationListMachine';
import { ENTRY_TYPE } from '@/models/EnumModel';

const Operation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation()
  const [state, send] = useMachine(displayOperationListMachine)
  const { userData } = useSelector((state: RootState) => state.auth);
  const { operationListData, isLoadMore, isLoading, isRefreshing } = state.context


  React.useEffect(() => {
    crashlytics().log(userData?.type ? userData.type : 'Operation Default');
  }, [userData?.type]);


  const onPressItem = (item) => {
    if (userData?.type === ENTRY_TYPE.OPSMANAGER) {
      navigation.navigate(CREATE_DO, { id: item });
    } else {
      navigation.navigate(CAMERA, {
        photoTitle: 'DO',
        navigateTo: userData?.type,
      });
    }
  }

  return (
    <SafeAreaView style={style.container}>
      <OperationList
        data={operationListData}
        loadList={isLoading}
        isLoadMore={isLoadMore}
        isError={state.matches('errorGettingList')}
        refreshing={isRefreshing}
        onEndReached={() => send('onEndReached')}
        onPressList={(item) => onPressItem(item)}

      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Operation;
