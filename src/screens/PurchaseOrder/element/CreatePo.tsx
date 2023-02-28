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
import { deleteImage } from '@/redux/reducers/cameraReducer';
import { RootState, AppDispatch } from '@/redux/store';
import { resScale } from '@/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { PORoutes } from '..';
import { openPopUp, setIsPopUpVisible } from '@/redux/reducers/modalReducer';

const CreatePo = () => {
  const navigation = useNavigation();
  const poGlobalState = useSelector(
    (postate: RootState) => postate.purchaseOrder
  );
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
  } = poGlobalState.poState;

  const isUserSearchSph = searchQuery.length > 0;
  const isUserChoosedSph = JSON.stringify(choosenSphDataFromModal) !== '{}';

  const getPhotoPo = useCallback(() => {
    if (poGlobalState.matches('firstStep.addPO')) {
      dispatch({ type: 'addMoreImages' });
    } else {
      dispatch({
        type: 'goToFirstStep',
        value: 'yes',
      });
    }
    navigation.navigate('CAMERA', {
      photoTitle: 'File PO',
      navigateTo: 'PO',
    });
  }, [dispatch, navigation, poGlobalState]);

  const deleteImages = (i: number) => {
    dispatch(deleteImage({ pos: i - 1 }));
    dispatch({
      type: 'deleteImage',
      value: i,
    });
  };

  useEffect(() => {
    if (route?.params) {
      dispatch({
        type: 'addImages',
        value: photoURLs,
      });
    }
  }, [dispatch, photoURLs, route]);

  useEffect(() => {
    poGlobalState.matches('enquirePOType') &&
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
            dispatch({ type: 'goToFirstStep', value: 'no' });
            dispatch(setIsPopUpVisible());
          },
        })
      );
  }, [dispatch, getPhotoPo, poGlobalState]);

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
                    <BCommonCompanyList
                      searchQuery={searchQuery}
                      onPress={(data) =>
                        dispatch({ type: 'openingModal', value: data })
                      }
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
      <ChoosePOModal
        isVisible={isModalChooseSphVisible}
        companyData={choosenSphDataFromList}
        onCloseModal={() => dispatch({ type: 'closeModal' })}
        onChoose={(data) => dispatch({ type: 'addChoosenSph', value: data })}
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
