import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import colors from '@/constants/colors';
import { layout } from '@/constants';
import OperationList from '../element/OperationList';
import crashlytics from '@react-native-firebase/crashlytics';
import { CAMERA, OPERATION, TAB_DISPATCH } from '@/navigation/ScreenNames';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMachine } from '@xstate/react';
import displayOperationListMachine from '@/machine/displayOperationListMachine';
import { AppDispatch, RootState } from '@/redux/store';
import { OperationsDeliveryOrdersListResponse } from '@/interfaces/Operation';
import {
  onChangeProjectDetails,
  OperationProjectDetails,
} from '@/redux/reducers/operationReducer';
import { resetImageURLS } from '@/redux/reducers/cameraReducer';
import { ENTRY_TYPE } from '@/models/EnumModel';

const Dispatch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [state, send] = useMachine(displayOperationListMachine);
  const { userData } = useSelector((state: RootState) => state.auth);
  const { operationListData, isLoadMore, isLoading, isRefreshing } =
    state.context;

  useFocusEffect(
    React.useCallback(() => {
      send('assignUserData', { payload: userData?.type, tabActive: 'left' });
      dispatch(resetImageURLS({ source: OPERATION }));
    }, [send, userData?.type])
  );

  React.useEffect(() => {
    crashlytics().log(TAB_DISPATCH);
  }, []);

  const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
    const dataToDeliver: OperationProjectDetails = {
      deliveryOrderId: item?.id ? item.id : '',
      doNumber: item?.number ? item.number : '',
      projectName: item.project?.projectName ? item.project.projectName : '',
      address: item.project?.ShippingAddress?.line1
        ? item.project.ShippingAddress.line1
        : '',
      lonlat: {
        longitude: item.project?.ShippingAddress?.lon
          ? Number(item.project.ShippingAddress.lon)
          : 0,
        latitude: item.project?.ShippingAddress?.lat
          ? Number(item.project.ShippingAddress.lat)
          : 0,
      },
      requestedQuantity: item?.Schedule?.SaleOrder?.PoProduct?.requestedQuantity
        ? item?.Schedule?.SaleOrder?.PoProduct?.requestedQuantity
        : 0,
      deliveryTime: item?.date ? item.date : '',
    };

    dispatch(onChangeProjectDetails({ projectDetails: dataToDeliver }));
    navigation.navigate(CAMERA, {
      photoTitle: 'DO',
      navigateTo:
        userData?.type === ENTRY_TYPE.WB ? ENTRY_TYPE.OUT : ENTRY_TYPE.DISPATCH,
    });
  };

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
        onRefresh={() => send('onRefreshList', { payload: userData?.type })}
        onRetry={() => send('retryGettingList', { payload: userData?.type })}
        userType={userData?.type}
      />
    </SafeAreaView>
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
