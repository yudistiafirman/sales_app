import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { BCommonSearchList } from '@/components';
import { useMachine } from '@xstate/react';
import { searchPOMachine } from '@/machine/searchPOMachine';
import SelectedPOModal from './element/SelectedPOModal';
import { QuotationRequests } from '@/interfaces/CreatePurchaseOrder';
import { PurchaseOrdersData } from '@/interfaces/SelectConfirmedPO';

interface IProps {
  dataToGet: 'SPHDATA' | 'DEPOSITDATA' | 'SCHEDULEDATA';
  filterSphDataBy?: 'INDIVIDU' | 'COMPANY';
  onSubmitData: ({ parentData, data }) => void;
  onDismiss?: () => void;
}

const SelectPurchaseOrderData = ({
  dataToGet,
  onSubmitData,
  onDismiss,
  filterSphDataBy,
}: IProps) => {
  const [index, setIndex] = React.useState(0);
  const [state, send] = useMachine(searchPOMachine);
  const [searchQuery, setSearchQuery] = React.useState('');
  const {
    routes,
    poData,
    loadData,
    isModalVisible,
    sphData,
    choosenDataFromList,
    isRefreshing,
    loadMoreData,
    errorGettingListMessage,
    searchValue,
  } = state.context;

  React.useEffect(() => {
    send('setDataType', { value: dataToGet, filterBy: filterSphDataBy });
  }, [dataToGet]);

  const getDataToDisplayInsideModal = () => {
    let companyName = choosenDataFromList?.name;
    let locationName;
    let listData;
    let projectId;
    if (dataToGet === 'SPHDATA') {
      locationName =
        choosenDataFromList?.ShippingAddress !== null
          ? choosenDataFromList?.ShippingAddress?.Postal?.City?.name
          : '';
      listData = choosenDataFromList?.QuotationRequests;
    } else {
      locationName =
        choosenDataFromList?.address?.line1 !== null
          ? choosenDataFromList?.address?.line1
          : '';
      listData = choosenDataFromList?.PurchaseOrders;
    }
    projectId = choosenDataFromList?.id;
    return { companyName, locationName, listData, projectId };
  };

  const getDataToDisplay = () => {
    if (dataToGet === 'DEPOSITDATA' || dataToGet === 'SCHEDULEDATA') {
      return poData;
    } else {
      return sphData;
    }
  };
  const { companyName, locationName, listData, projectId } =
    getDataToDisplayInsideModal();

  const onChangeText = (text: string) => {
    setSearchQuery(text);
    send('searching', { value: text });
  };

  const onClearValue = () => {
    if (searchValue && searchValue.trim() !== '') {
      setSearchQuery('');
      send('clearInput');
    } else {
      onDismiss && onDismiss();
    }
  };

  const onCloseModal = (
    productData: PurchaseOrdersData | QuotationRequests
  ) => {
    const parentData = { companyName, locationName, projectId };
    onSubmitData({ parentData, data: productData });
    send('onCloseModal');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SelectedPOModal
        isModalVisible={isModalVisible}
        onCloseModal={() => send('onCloseModal')}
        data={{ companyName, locationName, listData }}
        onPressCompleted={(data) => onCloseModal(data)}
        modalTitle={dataToGet === 'SPHDATA' ? 'Pilih SPH' : 'Pilih PO'}
        isDeposit={dataToGet === 'DEPOSITDATA'}
        dataToGet={dataToGet}
      />
      <BCommonSearchList
        searchQuery={searchQuery}
        onChangeText={onChangeText}
        placeholder={dataToGet === 'SPHDATA' ? 'Cari SPH' : 'Cari PO'}
        onClearValue={onClearValue}
        index={index}
        routes={routes}
        autoFocus={true}
        emptyText={`${searchQuery} tidak ditemukan!`}
        onIndexChange={setIndex}
        data={getDataToDisplay()}
        loadList={loadData}
        isLoadMore={loadMoreData}
        refreshing={isRefreshing}
        errorMessage={errorGettingListMessage}
        hidePicName
        isError={state.matches('errorGettingList')}
        onRetry={() => send('retryGettingList')}
        onRefresh={() => send('onRefresh')}
        onPressList={(data: any) => send('openingModal', { value: data })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

export default SelectPurchaseOrderData;
