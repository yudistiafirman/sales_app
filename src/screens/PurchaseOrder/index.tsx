import {
  BCommonCompanyList,
  BForm,
  BHeaderIcon,
  BHeaderTitle,
  BSearchBar,
  BSpacer,
  BTabSections,
} from '@/components';
import BImageList from '@/components/organism/BImagesList';
import { colors, layout } from '@/constants';
import {
  PurchaseOrderContext,
  PurchaseOrderProvider,
} from '@/context/PoContext';
import { Input } from '@/interfaces';
import { RootStackParamList } from '@/navigation/navTypes';
import cameraReducer, { deleteImage } from '@/redux/reducers/cameraReducer';
import { AppDispatch, RootState } from '@/redux/store';
import { resScale } from '@/utils';
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useActor } from '@xstate/react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

type PORoutes = RouteProp<RootStackParamList['PO']>;

const PO = () => {
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

  const deleteImages = (index: number) => {
    dispatch(deleteImage({ pos: index - 1 }));
    send('deleteImage', { value: index });
  };

  useEffect(() => {
    if (route?.params) {
      send('addImages', { value: photoURLs });
    }
  }, [photoURLs, route, send]);
  useEffect(() => {
    state.matches('enquirePOType') &&
      Alert.alert('Apakah PO disediakan oleh pelanggan', '', [
        { text: 'Iya', onPress: getPhotoPo },
        {
          text: 'Tidak',
          onPress: () => send('goToFirstStep', { value: 'no' }),
        },
      ]);
  }, [getPhotoPo, send, state]);

  const handleBack = useCallback(() => {
    if (state.matches('firstStep.SearchSph')) {
      send('backToAddPo');
    } else {
      navigation.dispatch(StackActions.popToTop());
    }
  }, [navigation, send, state]);

  const renderHeaderLeft = useCallback(
    () => (
      <BHeaderIcon
        size={layout.pad.lg + layout.pad.md}
        iconName="x"
        marginRight={layout.pad.lg}
        onBack={handleBack}
      />
    ),
    [handleBack]
  );

  const renderTitle = useCallback(() => {
    let title = 'Buat PO';
    if (state.matches('firstStep.SearchSph')) {
      title = 'Cari SPH';
    }
    return title;
  }, [state]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
      headerTitle: () => BHeaderTitle(renderTitle(), 'flex-start'),
    });
  }, [navigation, renderHeaderLeft, renderTitle]);

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
  const { routes, searchQuery, sphData } = state.context;
  return (
    <SafeAreaView style={styles.poContainer}>
      <View style={{ flex: 1 }}>
        {state.matches('firstStep.SearchSph') ? (
          <View style={{ flex: 1 }}>
            <BSearchBar
              value={searchQuery}
              onChangeText={(text) => send('searching', { value: text })}
              left={
                <TextInput.Icon forceTextInputFocus={false} icon="magnify" />
              }
              placeholder="Cari Sph"
            />
            <BSpacer size="small" />
            {state.context.searchQuery.length > 0 && (
              <BTabSections
                navigationState={{ index, routes }}
                swipeEnabled={false}
                onTabPress={onTabPress}
                onIndexChange={setIndex}
                renderScene={() => (
                  <BCommonCompanyList
                    searchQuery={searchQuery}
                    onPress={(data) => console.log(data)}
                    companyData={sphData}
                  />
                )}
                tabStyle={styles.tabStyle}
                tabBarStyle={styles.tabBarStyle}
                indicatorStyle={styles.tabIndicator}
              />
            )}
          </View>
        ) : (
          <View>
            <BImageList
              onAddImage={getPhotoPo}
              imageData={state.context.poImages}
              onRemoveImage={(index) => deleteImages(index)}
            />
            <BSpacer size="small" />
            <BForm inputs={inputs} />
            <TouchableOpacity
              onPress={() => send('searchingSph')}
              style={{ height: resScale(50) }}
            >
              <BSearchBar
                left={
                  <TextInput.Icon forceTextInputFocus={false} icon="magnify" />
                }
                disabled
                placeholder="Cari Sph"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  poContainer: { flex: 1, margin: layout.pad.md },
  tabIndicator: {
    backgroundColor: colors.primary,
    marginLeft: resScale(15.5),
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: layout.pad.lg,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
  },
});

const PurchaseOrderWithProvider = () => {
  return (
    <PurchaseOrderProvider>
      <PO />
    </PurchaseOrderProvider>
  );
};

export default PurchaseOrderWithProvider;
