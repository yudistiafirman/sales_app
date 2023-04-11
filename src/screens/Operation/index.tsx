import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import OperationList from './element/OperationList';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  CAMERA,
  CREATE_DO,
  LOCATION,
  OPERATION,
  SUBMIT_FORM,
} from '@/navigation/ScreenNames';
import { useMachine } from '@xstate/react';
import displayOperationListMachine from '@/machine/displayOperationListMachine';
import { ENTRY_TYPE } from '@/models/EnumModel';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { OperationsDeliveryOrdersListResponse } from '@/interfaces/Operation';
import { OperationProjectDetails, setAllOperationPhoto } from '@/redux/reducers/operationReducer';

const Operation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [state, send] = useMachine(displayOperationListMachine);
  const { userData } = useSelector((state: RootState) => state.auth);
  const { projectDetails } = useSelector((state: RootState) => state.operation);
  const { operationListData, isLoadMore, isLoading, isRefreshing } =
    state.context;
    console.log('rendeeer', userData?.type)

  React.useEffect(() => {
    crashlytics().log(userData?.type ? userData.type : 'Operation Default');
  }, [userData?.type, projectDetails, operationListData]);

  useFocusEffect(
    React.useCallback(() => {
      send('assignUserData', { payload: userData?.type });
    }, [send])
  );

  const onPressItem = (item: OperationsDeliveryOrdersListResponse) => {
    if (userData?.type) {
      if (userData.type === ENTRY_TYPE.OPSMANAGER) {
        navigation.navigate(CREATE_DO, { id: item });
      } else {
        if (projectDetails && projectDetails.deliveryOrderId === item.id) {
          navigation.navigate(SUBMIT_FORM, {
            operationType: userData.type,
          });
        } else {
          const dataToDeliver: OperationProjectDetails = {
            deliveryOrderId: item?.id ? item.id : '',
            doNumber: item?.number ? item.number : '',
            projectName: item.project?.projectName
              ? item.project.projectName
              : '',
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
          dispatch(setAllOperationPhoto({ file: [{ file: null }] }));
          navigation.navigate(CAMERA, {
            photoTitle: 'Tiba Di Proyek',
            navigateTo: userData.type,
            operationTempData: dataToDeliver,
          });
        }
      }
    }
  };

  const onLocationPress = async (lonlat: {
    longitude: string;
    latitude: string;
  }) => {
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
        onPressList={(item) => onPressItem(item)}
        onLocationPress={(lonlat) => onLocationPress(lonlat)}
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
  },
});
export default Operation;
