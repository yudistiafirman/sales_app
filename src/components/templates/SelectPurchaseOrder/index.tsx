import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { BCommonSearchList} from '@/components';
import { useMachine } from '@xstate/react';
import { searchPOMachine } from '@/machine/searchPOMachine';
import SelectedPOModal from './element/SelectedPOModal';
import { PurchaseOrdersData } from '@/interfaces/CreateDeposit';
import { QuotationRequests } from '@/interfaces/CreatePurchaseOrder';


interface IProps {
  dataToGet:'SPHDATA' | 'DEPOSITDATA' | 'SCHEDULEDATA';
  onSubmitData:({parentData,data})=> void
}

const SelectPurchaseOrderData = ({dataToGet,onSubmitData}:IProps) => {
  const [index, setIndex] = React.useState(0);
  const [state, send] = useMachine(searchPOMachine);
  const [searchQuery,setSearchQuery]=React.useState('')
  const { routes, poData, loadData,isModalVisible,sphData,choosenDataFromList,isRefreshing,loadMoreData,errorGettingListMessage } = state.context;
  React.useEffect(()=> {
    send('setDataType',{value:dataToGet})
},[dataToGet])
  const getDataToDisplayInsideModal =() => {
    let companyName =choosenDataFromList?.name
    let locationName 
    let sphs
    if(dataToGet === 'SPHDATA'){
      locationName = choosenDataFromList?.ShippingAddress !== null ? choosenDataFromList?.ShippingAddress?.Postal?.City?.name  : ''
      sphs = choosenDataFromList?.QuotationRequests
    }else{
      locationName = choosenDataFromList?.address?.line1 !== null ? choosenDataFromList?.address?.line1 : ''
      sphs = choosenDataFromList?.PurchaseOrders
    }
    return {companyName,locationName,sphs}
  }


  const getDataToDisplay = () => {
    if(dataToGet === 'DEPOSITDATA' || dataToGet === 'SCHEDULEDATA'){
      return poData
    }else {
      return sphData
    }
  }
  const {companyName,locationName,sphs} = getDataToDisplayInsideModal()




  const onChangeText = (text: string) => {
      setSearchQuery(text);
      send('searching',{value:text})
  };

  const onClearValue = () => {
    setSearchQuery('');
    send('clearInput');
  };

  const onCloseModal = (productData: PurchaseOrdersData & QuotationRequests) => {
    const parentData={name:companyName,locationName}
    onSubmitData({parentData,data:productData})
    send('onCloseModal')
  };





 

  return (
    <SafeAreaView style={styles.safeArea}>
        <SelectedPOModal
          isModalVisible={isModalVisible}
          onCloseModal={() => send('onCloseModal')}
          data={{companyName,locationName,sphs}}
          onPressCompleted={(data) => onCloseModal(data)}
          modalTitle={dataToGet ==='SPHDATA'? 'Pilih SPH' : 'Pilih PO'}
          isDeposit={dataToGet === 'DEPOSITDATA'}
        />
        <BCommonSearchList
        searchQuery={searchQuery}
        onChangeText={onChangeText}
        placeholder='Cari PO'
        onClearValue={onClearValue}
        index={index}
        routes={routes}
        emptyText={`Pencarian mu ${searchQuery} tidak ada. Coba cari PO lainnya.`}
        onIndexChange={setIndex}
        data={getDataToDisplay()}
        loadList={loadData}
        isLoadMore={loadMoreData}
        refreshing={isRefreshing}
        errorMessage={errorGettingListMessage}
        hidePicName
        isError={state.matches('errorGettingList')}
        onRetry={()=> send('retryGettingList')}
        onRefresh={()=> send('onRefresh')}
         onPressList={(data:any)=> send('openingModal',{value:data})}
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
