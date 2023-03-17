import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import OperationList from './element/OperationList';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { CAMERA, CREATE_DO, LOCATION, OPERATION } from '@/navigation/ScreenNames';
import { useMachine } from '@xstate/react';
import displayOperationListMachine from '@/machine/displayOperationListMachine';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { layout } from '@/constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { OperationsDeliveryOrdersListResponse } from '@/interfaces/Operation';
import { onChangeProjectDetails, OperationProjectDetails } from '@/redux/reducers/operationReducer';

const Operation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation()
  const [state, send] = useMachine(displayOperationListMachine)
  const { userData } = useSelector((state: RootState) => state.auth);
  const { operationListData, isLoadMore, isLoading, isRefreshing } = state.context

  React.useEffect(() => {
    crashlytics().log(userData?.type ? userData.type : 'Operation Default');
  }, [userData?.type]);

  useFocusEffect(
    React.useCallback(() => {
      send('onRefreshList')
    }, [send])
  );

  const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
    if (userData?.type) {
      if (userData.type === ENTRY_TYPE.OPSMANAGER) {
        navigation.navigate(CREATE_DO, { id: item });
      } else {
        const dataToDeliver: OperationProjectDetails = {
          doNumber: item?.number ? item.number : '',
          projectName: item.project?.projectName ? item.project.projectName : '',
          address: item.project?.Address?.line1 ? item.project.Address.line1 : '',
          lonlat: { longitude: item.project?.Address?.lon ? Number(item.project.Address.lon) : 0, latitude: item.project?.Address?.lat ? Number(item.project.Address.lat) : 0 },
          requestedQuantity: item?.Schedule?.SaleOrder?.PoProduct?.requestedQuantity ? item?.Schedule?.SaleOrder?.PoProduct?.requestedQuantity : 0,
          deliveryTime: item?.date ? item.date : ''
        }

        dispatch(onChangeProjectDetails({ projectDetails: dataToDeliver }))
        navigation.navigate(CAMERA, {
          photoTitle: 'DO',
          navigateTo: userData.type,
        });
      }
    }
  }

  const onLocationPress = async (lonlat: { longitude: string, latitude: string }) => {
    navigation.navigate(LOCATION,
      {
        coordinate: { longitude: Number(lonlat.longitude), latitude: Number(lonlat.latitude) },
        isReadOnly: true,
        from: OPERATION
      })
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
        onLocationPress={(lonlat) => onLocationPress(lonlat)}
        onRefresh={() => send('onRefreshList')}
        onRetry={() => send('retryGettingList')}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: layout.pad.lg,
    paddingBottom: layout.pad.lg
  },
});
export default Operation;
