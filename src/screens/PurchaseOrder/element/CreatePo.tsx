import {
  BSearchBar,
  BSpacer,
  BForm,
  BTouchableText,
  BGallery,
  BVisitationCard,
  BNestedProductCard,
  BCommonSearchList,
} from '@/components';
import { RootState, AppDispatch } from '@/redux/store';
import { resScale } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CAMERA, PO } from '@/navigation/ScreenNames';
import SelectedPOModal from '@/screens/SearchPO/element/SelectedPOModal';
import {
  CreatedSPHListResponse,
  QuotationLetters,
} from '@/interfaces/createPurchaseOrder';

const CreatePo = () => {
  const navigation = useNavigation();
  const poState = useSelector((state: RootState) => state.purchaseOrder);
  const dispatch = useDispatch<AppDispatch>();
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navRoutes = useRoute();
  const {
    routes,
    sphData,
    poImages,
    choosenSphDataFromList,
    choosenSphDataFromModal,
    isModalChooseSphVisible,
    openCamera,
    loadingSphData,
    errorGettingSphMessage,
    poNumber,
  } = poState.currentState.context;
  const isUserChoosedSph = JSON.stringify(choosenSphDataFromModal) !== '{}';
  const [expandData,setExpandData]= React.useState<any[]>([])
  const addMoreImages = useCallback(() => {
    dispatch({ type: 'addMoreImages' });
  }, [dispatch]);

  const goToCamera = useCallback(() => {
    navigation.navigate(CAMERA, {
      photoTitle: 'File PO',
      navigateTo: PO,
      disabledDocPicker: false,
      disabledGalleryPicker: false,
      closeButton: true,
    });
  }, [navigation]);

  const deleteImages = (i: number) => {
    dispatch({
      type: 'deleteImage',
      value: i,
    });
  };

  useEffect(() => {
    if (openCamera) {
      goToCamera();
    }
  }, [
    dispatch,
    goToCamera,
    navRoutes.params,
    openCamera,
    poState.currentState,
  ]);

  const onTabPress = (tabRoutes: any) => {
    const tabIndex = index === 0 ? 1 : 0;
    if (tabRoutes.key !== routes[index].key) {
      dispatch({
        type: 'onChangeCategories',
        value: tabIndex,
      });
    }
  };

  const inputs: Input[] = [
    {
      label: 'No. Purchase Order',
      isRequire: true,
      isError: false,
      type: 'textInput',
      onChange: (e: any) => {
        dispatch({
          type: 'inputSph',
          value: e.nativeEvent.text,
        });
      },
      value: poNumber,
    },
  ];

  const onPressCompleted = (data: QuotationLetters) => {
    const selectedSphFromModal = Object.assign({}, choosenSphDataFromList);
    selectedSphFromModal.QuotationRequests = data;

    dispatch({
      type: 'addChoosenSph',
      value: selectedSphFromModal,
    });
  };

  const renderCustomButton = () => {
    return (
      <BTouchableText
        onPress={() => dispatch({ type: 'searchingSph' })}
        title="Ganti"
      />
    );
  };

  const onChangeText = useCallback((text: string) => {
    setSearchQuery(text);
    dispatch({ type: 'searching', value: text });
  }, []);

  const onExpand = (index:number,data:any)=> {
    let newExpandsetExpandData;
    const isExisted = expandData?.findIndex(
      (val) => val?.QuotationLetter?.id === data?.QuotationLetter?.id
    );
    if (isExisted === -1) {
      newExpandsetExpandData = [...expandData, data];
    } else {
      newExpandsetExpandData = expandData.filter(
        (val) => val?.QuotationLetter?.id !== data?.QuotationLetter?.id
      );
    }
    setExpandData(newExpandsetExpandData);
  }

  return (
    <>
      <View style={styles.firstStepContainer}>
        {poState.currentState.matches('firstStep.SearchSph') ? (
          <BCommonSearchList
            searchQuery={searchQuery}
            onChangeText={onChangeText}
            placeholder="Cari SPH"
            index={index}
            emptyText={`Pencarian mu ${searchQuery} tidak ada. Coba cari sph lainnya.`}
            routes={routes}
            onTabPress={onTabPress}
            onIndexChange={setIndex}
            loadList={loadingSphData}
            onPressList={(data: CreatedSPHListResponse) =>
              dispatch({
                type: 'openingModal',
                value: data,
              })
            }
            poDatas={sphData}
            isError={poState.currentState.matches(
              'firstStep.SearchSph.errorGettingSphList'
            )}
            errorMessage={errorGettingSphMessage}
            onRetry={() => dispatch({ type: 'retryGettingSphList' })}
          />
        ) : (
          <ScrollView>
            <>
              <BGallery
                addMorePict={addMoreImages}
                picts={poImages}
                removePict={deleteImages}
              />
              <BSpacer size="extraSmall" />
              <BForm inputs={inputs} />
            </>

            {isUserChoosedSph ? (
              <>
                <View style={{ height: resScale(57) }}>
                  <BVisitationCard
                    item={{
                      name: choosenSphDataFromModal.name,
                      location:
                        choosenSphDataFromList?.ShippingAddress !== null
                          ? choosenSphDataFromModal?.ShippingAddress?.Postal
                              ?.City?.name
                          : '',
                    }}
                    isRenderIcon
                    customIcon={renderCustomButton}
                  />
                </View>

                <BSpacer size="extraSmall" />
                <BNestedProductCard
                  withoutHeader={false}
                  data={choosenSphDataFromModal?.QuotationRequests}
                  expandData={expandData}
                  onExpand={onExpand}
                />
              </>
            ) : (
              <TouchableOpacity
                onPress={() => dispatch({ type: 'searchingSph' })}
                style={{ height: resScale(50) }}
              >
                <BSearchBar
                  left={
                    <TextInput.Icon
                      forceTextInputFocus={false}
                      icon="magnify"
                    />
                  }
                  disabled
                  placeholder="Cari SPH"
                />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>
      <SelectedPOModal
        isModalVisible={isModalChooseSphVisible}
        onCloseModal={() => dispatch({ type: 'closeModal' })}
        data={{
          companyName: choosenSphDataFromList.name,
          locationName:
            choosenSphDataFromList?.ShippingAddress !== null
              ? choosenSphDataFromList?.ShippingAddress?.Postal?.City?.name
              : '',
          sphs: choosenSphDataFromList.QuotationRequests,
        }}
        modalTitle="Pilih SPH"
        onPressCompleted={onPressCompleted}
      />
    </>
  );
};

const styles = StyleSheet.create({
  firstStepContainer: {
    flex: 1,
  },
});

export default CreatePo;
