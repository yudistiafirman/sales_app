import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import OperationList from '../element/OperationList';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  CAMERA,
  SUBMIT_FORM,
  TAB_RETURN,
  TAB_WB_IN,
} from '@/navigation/ScreenNames';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, layout } from '@/constants';
import {
  OperationProjectDetails,
  setAllOperationPhoto,
} from '@/redux/reducers/operationReducer';
import { OperationsDeliveryOrdersListResponse } from '@/interfaces/Operation';
import { AppDispatch, RootState } from '@/redux/store';
import { useMachine } from '@xstate/react';
import displayOperationListMachine from '@/machine/displayOperationListMachine';
import { ENTRY_TYPE } from '@/models/EnumModel';

const Return = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [state, send] = useMachine(displayOperationListMachine);
  const { userData } = useSelector((state: RootState) => state.auth);
  const { projectDetails } = useSelector((state: RootState) => state.operation);
  const { operationListData, isLoadMore, isLoading, isRefreshing } =
    state.context;

  useFocusEffect(
    React.useCallback(() => {
      send('assignUserData', { payload: userData?.type, tabActive: 'right' });
    }, [send, userData?.type])
  );

  React.useEffect(() => {
    crashlytics().log(ENTRY_TYPE.SECURITY ? TAB_RETURN : TAB_WB_IN);
  }, [projectDetails, operationListData]);

  const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
    if (projectDetails && projectDetails.deliveryOrderId === item.id) {
      navigation.navigate(SUBMIT_FORM, {
        operationType:
          userData?.type === ENTRY_TYPE.SECURITY
            ? ENTRY_TYPE.RETURN
            : ENTRY_TYPE.IN,
      });
    } else {
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
        requestedQuantity: item?.Schedule?.SaleOrder?.PoProduct
          ?.requestedQuantity
          ? item?.Schedule?.SaleOrder?.PoProduct?.requestedQuantity
          : 0,
        deliveryTime: item?.date ? item.date : '',
      };
      dispatch(setAllOperationPhoto({ file: [] }));
      navigation.navigate(CAMERA, {
        photoTitle: 'DO',
        navigateTo:
          userData?.type === ENTRY_TYPE.SECURITY
            ? ENTRY_TYPE.RETURN
            : ENTRY_TYPE.IN,
        operationTempData: dataToDeliver,
      });
    }
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
        onRefresh={() => send('onRefreshList', { payload: userData?.type, tabActive: 'right' })}
        onRetry={() => send('retryGettingList', { payload: userData?.type, tabActive: 'right' })}
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

export default Return;
