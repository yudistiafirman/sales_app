/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { AppState, DeviceEventEmitter, SafeAreaView, View } from 'react-native';
import BTabSections from '@/components/organism/TabSections';
import { useNavigation, useRoute } from '@react-navigation/native';
import Tnc from '@/screens/Price/element/Tnc';
import CurrentLocation from './element/CurrentLocation';
import PriceStyle from './PriceStyle';
import PriceSearchBar from './element/PriceSearchBar';
import ProductList from '@/components/templates/Price/ProductList';
import { BAlert, BEmptyState, BSpacer, BTouchableText } from '@/components';
import { useMachine } from '@xstate/react';
import { priceMachine } from '@/machine/priceMachine';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { layout } from '@/constants';
import { RootStackScreenProps } from '@/navigation/CustomStateComponent';
import {
  CREATE_VISITATION,
  LOCATION,
  SEARCH_PRODUCT,
  TAB_PRICE_LIST,
  TAB_PRICE_LIST_TITLE,
} from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { closePopUp, openPopUp } from '@/redux/reducers/modalReducer';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const PriceList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<RootStackScreenProps>();
  const [index, setIndex] = React.useState(0);
  const [visibleTnc, setVisibleTnc] = React.useState(false);
  const appState = React.useRef(AppState.currentState);
  const [state, send] = useMachine(priceMachine);
  const [fromVisitation, setFromVisitation] = React.useState(false);
  const [searchFormattedAddress, setSearchFormattedAddress] =
    React.useState('');

  React.useEffect(() => {
    crashlytics().log(TAB_PRICE_LIST);

    if (state.matches('denied')) {
      const subscription = AppState.addEventListener(
        'change',
        (nextAppState) => {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            send('appComeForegroundState');
          } else {
            send('appComeBackgroundState');
          }
          appState.current = nextAppState;
        }
      );
      return () => {
        subscription.remove();
      };
    }
  }, [send, state]);

  React.useEffect(() => {
    if (route?.params) {
      const { params } = route;
      const { latitude, longitude, formattedAddress } = params.coordinate;
      setSearchFormattedAddress(formattedAddress);
      const { from } = params;
      if (from === CREATE_VISITATION) {
        setFromVisitation(true);
      }
      send('backToIdle');
      send('sendingParams', { value: { latitude, longitude } });
      setIndex(0);
    } else {
      send('onAskPermission');
    }
  }, [route, route?.params, send]);

  React.useEffect(() => {
    if (state.matches('errorGettingCurrentLocation')) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: state.context.errorMessage,
          primaryBtnTitle: 'Retry',
          outlineBtnTitle: 'Back',
          isRenderActions: true,
          primaryBtnAction: () => {
            dispatch(closePopUp());
            send('retryGettingCurrentLocation');
          },
          outlineBtnAction: () => {
            dispatch(closePopUp());
            navigation.goBack();
          },
        })
      );
    } else if (state.matches('errorFetchLocationDetail')) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: state.context.errorMessage,
          primaryBtnTitle: 'Retry',
          outlineBtnTitle: 'Back',
          isRenderActions: true,
          primaryBtnAction: () => {
            dispatch(closePopUp());
            send('retryFetchLocationDetail');
          },
          outlineBtnAction: () => {
            dispatch(closePopUp());
            navigation.goBack();
          },
        })
      );
    }
  }, [dispatch, navigation, send, state]);

  const renderHeaderRight = React.useCallback(() => {
    if (fromVisitation) {
      return <View />;
    } else {
      return (
        <BTouchableText onPress={() => setVisibleTnc(true)} title="Ketentuan" />
      );
    }
  }, [fromVisitation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [navigation, renderHeaderRight]);

  const onTabPress = () => {
    const tabIndex = index === 0 ? 1 : 0;
    if (route.key !== routes[index].key) {
      send('onChangeCategories', { payload: tabIndex });
    }
  };

  const onPressProduct = (data) => {
    if (fromVisitation) {
      DeviceEventEmitter.emit('event.testEvent', { data });
      navigation.goBack();
    }
  };

  const onPressSearchBar = () => {
    if (!fromVisitation) {
      navigation.navigate(SEARCH_PRODUCT, {
        distance: locationDetail?.distance?.value,
      });
    } else {
      navigation.goBack();
    }
  };

  const goToLocation = () => {
    if (!fromVisitation) {
      const { lon, lat } = locationDetail;
      const coordinate = {
        longitude: Number(lon),
        latitude: Number(lat),
        formattedAddress:
          searchFormattedAddress.length > 0 ? searchFormattedAddress : '',
      };

      navigation.navigate(LOCATION, {
        coordinate: coordinate,
        isReadOnly: false,
        from: TAB_PRICE_LIST_TITLE,
      });
    }
  };

  const {
    locationDetail,
    routes,
    productsData,
    loadProduct,
    isLoadMore,
    refreshing,
    loadLocation,
    errorMessage,
    page,
    totalPage,
  } = state.context;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BSpacer size="small" />

      {!loadLocation ? (
        <CurrentLocation
          onPress={goToLocation}
          location={
            searchFormattedAddress?.length > 0
              ? searchFormattedAddress
              : locationDetail?.formattedAddress
          }
        />
      ) : (
        <ShimmerPlaceholder
          style={{
            marginHorizontal: layout.pad.lg,
            height: layout.pad.lg,
            width: '92%',
          }}
        />
      )}
      <BSpacer size="extraSmall" />
      {!loadLocation ? (
        <PriceSearchBar onPress={onPressSearchBar} />
      ) : (
        <ShimmerPlaceholder
          style={{
            marginHorizontal: layout.pad.lg,
            height: layout.pad.xl,
            width: '92%',
          }}
        />
      )}

      <BSpacer size="extraSmall" />
      {state.matches('getProduct.errorGettingCategories') && (
        <BEmptyState
          isError
          errorMessage={errorMessage}
          onAction={() => send('retryGettingCategories')}
        />
      )}
      {routes.length > 0 && (
        <BTabSections
          swipeEnabled={false}
          navigationState={{ index, routes }}
          renderScene={() => (
            <ProductList
              onEndReached={() => {
                page !== totalPage && send('onEndReached');
              }}
              products={productsData}
              onPress={onPressProduct}
              isLoadMore={isLoadMore}
              loadProduct={loadProduct}
              refreshing={refreshing}
              isError={state.matches(
                'getProduct.categoriesLoaded.errorGettingProducts'
              )}
              onAction={() => send('retryGettingProducts')}
              errorMessage={errorMessage}
              onRefresh={() => send('refreshingList')}
              disablePressed={fromVisitation ? false : true}
            />
          )}
          onTabPress={onTabPress}
          onIndexChange={setIndex}
          tabStyle={PriceStyle.tabStyle}
          tabBarStyle={PriceStyle.tabBarStyle}
          indicatorStyle={PriceStyle.tabIndicator}
        />
      )}

      <Tnc isVisible={visibleTnc} onCloseTnc={() => setVisibleTnc(false)} />
      {/* <BAlert
        isVisible={state.matches('unreachable')}
        type="warning"
        onClose={() => send('hideWarning')}
      /> */}
    </SafeAreaView>
  );
};

export default PriceList;
