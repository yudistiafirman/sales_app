import crashlytics from '@react-native-firebase/crashlytics';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMachine } from '@xstate/react';
import React from 'react';
import { StyleSheet, SafeAreaView, DeviceEventEmitter } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OperationsDeliveryOrdersListResponse } from '@/interfaces/Operation';
import displayOperationListMachine from '@/machine/displayOperationListMachine';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { CAMERA, LOCATION, OPERATION, SUBMIT_FORM } from '@/navigation/ScreenNames';
import {
  OperationProjectDetails,
  onChangeProjectDetails,
  setAllOperationPhoto,
} from '@/redux/reducers/operationReducer';
import { AppDispatch, RootState } from '@/redux/store';
import OperationList from './element/OperationList';

function Operation() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [state, send] = useMachine(displayOperationListMachine);
  const { userData } = useSelector((state: RootState) => state.auth);
  const { projectDetails, photoFiles } = useSelector((state: RootState) => state.operation);
  const { operationListData, isLoadMore, isLoading, isRefreshing } = state.context;

  React.useEffect(() => {
    crashlytics().log(userData?.type ? userData.type : 'Operation Default');
    DeviceEventEmitter.addListener('Operation.refreshlist', () => {
      send('onRefreshList', { payload: userData?.type });
    });

    return () => {
      DeviceEventEmitter.removeAllListeners('Operation.refreshlist');
    };
  }, [userData?.type, projectDetails, operationListData]);

  useFocusEffect(
    React.useCallback(() => {
      send('assignUserData', { payload: userData?.type });
    }, [send])
  );

  const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
    // NOTE: currently driver only

    if (projectDetails && projectDetails.deliveryOrderId === item.id) {
      navigation.navigate(SUBMIT_FORM, {
        operationType: userData.type,
      });
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

      dispatch(onChangeProjectDetails({ projectDetails: dataToDeliver }));
      dispatch(
        setAllOperationPhoto({
          file: [
            { file: null, attachType: 'Tiba di lokasi' },
            { file: null, attachType: 'Dalam gentong isi' },
            { file: null, attachType: 'Tuang beton' },
            { file: null, attachType: 'Cuci gentong' },
            { file: null, attachType: 'DO' },
            { file: null, attachType: 'Penerima' },
            { file: null, attachType: 'Penambahan air' },
            { file: null, attachType: 'Tambahan' },
          ],
        })
      );
      navigation.navigate(CAMERA, {
        photoTitle: 'Tiba di lokasi',
        closeButton: true,
        navigateTo: ENTRY_TYPE.DRIVER,
        operationAddedStep: 'Tiba di lokasi',
      });
    }
  };

  const onLocationPress = async (lonlat: { longitude: string; latitude: string }) => {
    navigation.navigate(LOCATION, {
      coordinate: {
        longitude: Number(lonlat.longitude),
        latitude: Number(lonlat.latitude),
      },
      isReadOnly: true,
      from: OPERATION,
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
        onPressList={item => onPressItem(item)}
        onLocationPress={lonlat => onLocationPress(lonlat)}
        onRefresh={() => send('onRefreshList', { payload: userData?.type })}
        onRetry={() => send('retryGettingList', { payload: userData?.type })}
        userType={userData?.type}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Operation;
