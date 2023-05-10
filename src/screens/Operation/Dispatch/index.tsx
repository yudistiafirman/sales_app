import crashlytics from '@react-native-firebase/crashlytics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMachine } from '@xstate/react';
import React from 'react';
import { StyleSheet, SafeAreaView, DeviceEventEmitter } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OperationList from '../element/OperationList';
import { layout } from '@/constants';
import colors from '@/constants/colors';
import { OperationsDeliveryOrdersListResponse } from '@/interfaces/Operation';
import displayOperationListMachine from '@/machine/displayOperationListMachine';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { CAMERA, SUBMIT_FORM, TAB_DISPATCH, TAB_WB_OUT } from '@/navigation/ScreenNames';
import { OperationProjectDetails, setAllOperationPhoto } from '@/redux/reducers/operationReducer';
import { AppDispatch, RootState } from '@/redux/store';

function Dispatch() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [state, send] = useMachine(displayOperationListMachine);
  const { userData } = useSelector((state: RootState) => state.auth);
  const { projectDetails, photoFiles } = useSelector((state: RootState) => state.operation);
  const { operationListData, isLoadMore, isLoading, isRefreshing } = state.context;

  useFocusEffect(
    React.useCallback(() => {
      send('assignUserData', { payload: userData?.type, tabActive: 'left' });
    }, [send, userData?.type])
  );

  React.useEffect(() => {
    crashlytics().log(ENTRY_TYPE.SECURITY ? TAB_DISPATCH : TAB_WB_OUT);

    DeviceEventEmitter.addListener('Operation.refreshlist', () => {
      send('onRefreshList', { payload: userData?.type, tabActive: 'left' });
    });

    return () => {
      DeviceEventEmitter.removeAllListeners('Operation.refreshlist');
    };
  }, [send, projectDetails, operationListData]);

  const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
    if (projectDetails && projectDetails.deliveryOrderId === item.id) {
      if (photoFiles.length > 1) {
        navigation.navigate(SUBMIT_FORM, {
          operationType:
            userData?.type === ENTRY_TYPE.SECURITY ? ENTRY_TYPE.DISPATCH : ENTRY_TYPE.OUT,
        });
      } else {
        navigation.navigate(CAMERA, {
          photoTitle: 'DO',
          navigateTo: userData?.type === ENTRY_TYPE.SECURITY ? ENTRY_TYPE.DISPATCH : ENTRY_TYPE.OUT,
        });
      }
    } else {
      const dataToDeliver: OperationProjectDetails = {
        deliveryOrderId: item?.id ? item.id : '',
        doNumber: item?.number ? item.number : '',
        projectName: item.project?.projectName ? item.project.projectName : '',
        address: item.project?.ShippingAddress?.line1 ? item.project.ShippingAddress.line1 : '',
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
      dispatch(setAllOperationPhoto({ file: [{ file: null }] }));
      navigation.navigate(CAMERA, {
        photoTitle: 'DO',
        navigateTo: userData?.type === ENTRY_TYPE.SECURITY ? ENTRY_TYPE.DISPATCH : ENTRY_TYPE.OUT,
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
        onPressList={item => onPressItem(item)}
        onRefresh={() => {
          send('onRefreshList', { payload: userData?.type, tabActive: 'left' });
        }}
        onRetry={() =>
          send('retryGettingList', {
            payload: userData?.type,
            tabActive: 'left',
          })
        }
        userType={userData?.type}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: layout.pad.lg,
  },
});

export default Dispatch;
