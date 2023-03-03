import {
  BSearchBar,
  BSpacer,
  BTabSections,
  BForm,
  BTouchableText,
  BExpandableSPHCard,
  POList,
  BGallery,
  BVisitationCard,
  BNestedProductCard,
} from '@/components';
import { colors } from '@/constants';
import { RootState, AppDispatch } from '@/redux/store';
import { resScale } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CAMERA, PO } from '@/navigation/ScreenNames';
import SelectedPOModal from '@/screens/SearchPO/element/SelectedPOModal';
import {
  CreatedSPHListResponse,
  QuotationLetters,
} from '@/interfaces/createPurchaseOrder';

const CreatePo = () => {
  const navigation = useNavigation();
  const poGlobalState = useSelector(
    (postate: RootState) => postate.purchaseOrder
  );
  const dispatch = useDispatch<AppDispatch>();
  const [index, setIndex] = useState(0);
  const navRoutes = useRoute();
  const {
    routes,
    searchQuery,
    sphData,
    poImages,
    choosenSphDataFromList,
    choosenSphDataFromModal,
    isModalChooseSphVisible,
    openCamera,
  } = poGlobalState.poState;
  const [picts, setPicts] = useState([]);
  const isUserSearchSph = searchQuery.length > 0;
  const isUserChoosedSph = JSON.stringify(choosenSphDataFromModal) !== '{}';

  const addMoreImages = useCallback(() => {
    dispatch({ type: 'addMoreImages' });
  }, [dispatch]);

  const goToCamera = useCallback(() => {
    navigation.navigate(CAMERA, {
      photoTitle: 'File PO',
      navigateTo: PO,
      disabledDocPicker: false,
      disabledGalleryPicker: false,
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
  }, [dispatch, goToCamera, navRoutes.params, openCamera, poGlobalState]);

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
      value: poGlobalState.sphNumber,
    },
  ];

  const onPressCompleted = (data: QuotationLetters) => {
    const selectedSphFromModal = Object.assign({}, choosenSphDataFromList);
    selectedSphFromModal.QuotationRequest = data;

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

  return (
    <>
      <View style={styles.firstStepContainer}>
        {poGlobalState.matches('firstStep.SearchSph') ? (
          <View style={styles.firstStepContainer}>
            <BSearchBar
              value={searchQuery}
              onChangeText={(text) =>
                dispatch({ type: 'searching', value: text })
              }
              left={
                <TextInput.Icon forceTextInputFocus={false} icon="magnify" />
              }
              placeholder="Cari Sph"
            />
            <BSpacer size="small" />
            {isUserSearchSph && (
              <BTabSections
                navigationState={{ index, routes }}
                swipeEnabled={false}
                onTabPress={onTabPress}
                onIndexChange={setIndex}
                renderScene={() => (
                  <>
                    <BSpacer size="extraSmall" />
                    <POList
                      onPress={(data: CreatedSPHListResponse) =>
                        dispatch({
                          type: 'openingModal',
                          value: data,
                        })
                      }
                      poDatas={sphData}
                    />
                  </>
                )}
                tabStyle={styles.tabStyle}
                tabBarStyle={styles.tabBarStyle}
                indicatorStyle={styles.tabIndicator}
              />
            )}
          </View>
        ) : (
          <View>
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
                        choosenSphDataFromModal.ShippingAddress.Postal.City
                          .name,
                    }}
                    isRenderIcon
                    customIcon={renderCustomButton}
                  />
                </View>

                <BSpacer size="extraSmall" />
                <BNestedProductCard
                  withoutHeader={false}
                  data={choosenSphDataFromModal?.QuotationRequest}
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
                  placeholder="Cari Sph"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <SelectedPOModal
        isModalVisible={isModalChooseSphVisible}
        onCloseModal={() => dispatch({ type: 'closeModal' })}
        data={{
          companyName: choosenSphDataFromList.name,
          locationName:
            choosenSphDataFromList?.ShippingAddress?.Postal?.City?.name,
          sphs: choosenSphDataFromList.QuotationRequest,
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
  tabIndicator: {
    backgroundColor: colors.primary,
  },
  tabStyle: {
    flex: 1,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
  },
});

export default CreatePo;
