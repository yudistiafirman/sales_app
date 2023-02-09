import {
  BSearchBar,
  BSpacer,
  BTabSections,
  BCommonCompanyList,
  BForm,
  BTouchableText,
  BExpandableSPHCard,
} from '@/components';
import BCommonCompanyCard from '@/components/molecules/BCommonCompanyCard';
import BImageList from '@/components/organism/BImagesList';
import ChoosePOModal from '@/components/templates/ChooseSphModal';
import { colors } from '@/constants';
import { PurchaseOrderContext } from '@/context/PoContext';
import { deleteImage } from '@/redux/reducers/cameraReducer';
import { RootState, AppDispatch } from '@/redux/store';
import { resScale } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useActor } from '@xstate/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PORoutes } from '../..';
import { openPopUp, setIsPopUpVisible } from '@/redux/reducers/modalReducer';

const CreatePo = () => {
  const navigation = useNavigation();
  const { purchaseOrderService } = useContext(PurchaseOrderContext);
  const [state] = useActor(purchaseOrderService);
  const { send } = purchaseOrderService;
  const { photoURLs } = useSelector(
    (_reduxstate: RootState) => _reduxstate.camera
  );
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<PORoutes>();
  const [index, setIndex] = useState(0);
  const {
    routes,
    searchQuery,
    sphData,
    isProvidedByCustomers,
    poImages,
    choosenSphDataFromList,
    choosenSphDataFromModal,
    isModalChooseSphVisible,
  } = state.context;

  const isUserSearchSph = searchQuery.length > 0;
  const isUserChoosedSph = JSON.stringify(choosenSphDataFromModal) !== '{}';

  const getPhotoPo = useCallback(() => {
    if (state.matches('firstStep.addPO')) {
      send('addMoreImages');
    } else {
      send('goToFirstStep', { value: 'yes' });
    }
    navigation.navigate('Camera', {
      photoTitle: 'File PO',
      navigateTo: 'PO',
    });
  }, [navigation, send, state]);

  const deleteImages = (i: number) => {
    dispatch(deleteImage({ pos: i - 1 }));
    send('deleteImage', { value: i });
  };

  useEffect(() => {
    if (route?.params) {
      send('addImages', { value: photoURLs });
    }
  }, [photoURLs, route, send]);
  useEffect(() => {
    state.matches('enquirePOType') &&
      dispatch(
        openPopUp({
          popUpTitle: 'Apakah PO disediakan oleh pelanggan?',
          popUpType: 'none',
          outlineBtnTitle: 'Iya',
          primaryBtnTitle: 'Tidak',
          isRenderActions: true,
          outlineBtnAction: () => {
            getPhotoPo();
            dispatch(setIsPopUpVisible());
          },
          primaryBtnAction: () => {
            send('goToFirstStep', { value: 'no' });
            dispatch(setIsPopUpVisible());
          },
        })
      );
  }, [dispatch, getPhotoPo, send, state]);

  const onTabPress = (tabRoutes: any) => {
    const tabIndex = index === 0 ? 1 : 0;
    if (tabRoutes.key !== routes[index].key) {
      send('onChangeCategories', { value: tabIndex });
    }
  };

  const inputs: Input[] = [
    {
      label: 'No. Purchase Order',
      isRequire: true,
      isError: false,
      type: 'textInput',
      onChange: (e: any) => {
        send('inputSph', { value: e.nativeEvent.text });
      },
      value: state.context.sphNumber,
    },
  ];

  const renderCustomButton = () => {
    return (
      <BTouchableText onPress={() => send('searchingSph')} title="Ganti" />
    );
  };

  return (
    <>
      <View style={styles.firstStepContainer}>
        {state.matches('firstStep.SearchSph') ? (
          <View style={styles.firstStepContainer}>
            <BSearchBar
              value={searchQuery}
              onChangeText={(text) => send('searching', { value: text })}
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
                    <BCommonCompanyList
                      searchQuery={searchQuery}
                      onPress={(data) => send('openingModal', { value: data })}
                      companyData={sphData}
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
            {isProvidedByCustomers && (
              <>
                <BImageList
                  onAddImage={getPhotoPo}
                  imageData={poImages}
                  onRemoveImage={(idx) => deleteImages(idx)}
                />
                <BSpacer size="small" />
                <BForm inputs={inputs} />
              </>
            )}

            {isUserChoosedSph ? (
              <>
                <BCommonCompanyCard
                  name={choosenSphDataFromModal.name}
                  location={choosenSphDataFromModal.location}
                  needRightIcon
                  customButton={renderCustomButton}
                />
                <BSpacer size="small" />
                <BExpandableSPHCard
                  sphNo={
                    choosenSphDataFromModal.sph &&
                    choosenSphDataFromModal.sph[0].no
                  }
                  totalPrice={
                    choosenSphDataFromModal.sph &&
                    choosenSphDataFromModal.sph[0].totalPrice
                  }
                  checked={
                    choosenSphDataFromModal.sph &&
                    choosenSphDataFromModal.sph[0].checked
                  }
                  productsData={
                    choosenSphDataFromModal.sph &&
                    choosenSphDataFromModal.sph[0].productsData
                  }
                />
              </>
            ) : (
              <TouchableOpacity
                onPress={() => send('searchingSph')}
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
      <ChoosePOModal
        isVisible={isModalChooseSphVisible}
        companyData={choosenSphDataFromList}
        onCloseModal={() => send('closeModal')}
        onChoose={(data) => send('addChoosenSph', { value: data })}
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
