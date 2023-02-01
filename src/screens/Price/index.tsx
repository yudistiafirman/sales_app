/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppState, SafeAreaView } from 'react-native';
import BTabSections from '@/components/organism/TabSections';
import { useNavigation, useRoute } from '@react-navigation/native';
import Tnc from '@/screens/Price/element/Tnc';
import CurrentLocation from './element/CurrentLocation';
import PriceStyle from './PriceStyle';
import PriceSearchBar from './element/PriceSearchBar';
import ProductList from '@/components/templates/Price/ProductList';
import { BAlert, BSpacer, BTouchableText } from '@/components';
import { useMachine } from '@xstate/react';
import { priceMachine } from '@/machine/priceMachine';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { layout } from '@/constants';
import { RootStackScreenProps } from '@/navigation/navTypes';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const PriceList = () => {
  const navigation = useNavigation();
  const route = useRoute<RootStackScreenProps>();
  const [index, setIndex] = useState(0);
  const [visibleTnc, setVisibleTnc] = useState(false);
  const appState = useRef(AppState.currentState);
  const [state, send] = useMachine(priceMachine);

  useEffect(() => {
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

  useEffect(() => {
    if (route?.params) {
      const { params } = route;
      const { latitude, longitude } = params.coordinate;
      send('backToIdle');
      send('sendingParams', { value: { latitude, longitude } });
      setIndex(0);
    } else {
      send('onAskPermission');
    }
  }, [route, route?.params, send]);

  const renderHeaderRight = () => {
    return (
      <BTouchableText onPress={() => setVisibleTnc(true)} title="Ketentuan" />
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  }, [navigation]);

  const onTabPress = ({ route: any }) => {
    const tabIndex = index === 0 ? 1 : 0;
    if (route.key !== routes[index].key) {
      send('onChangeCategories', { payload: tabIndex });
    }
  };
  const goToLocation = () => {
    const { lon, lat } = locationDetail;
    const coordinate = {
      longitude: Number(lon),
      latitude: Number(lat),
    };

    navigation.navigate('Location', {
      coordinate: coordinate,
    });
  };

  const {
    locationDetail,
    routes,
    productsData,
    loadProduct,
    isLoadMore,
    refreshing,
    loadLocation,
  } = state.context;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BSpacer size="small" />

      {!loadLocation ? (
        <CurrentLocation
          onPress={goToLocation}
          location={locationDetail?.formattedAddress}
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
        <PriceSearchBar
          onPress={() =>
            navigation.navigate('SearchProduct', {
              distance: locationDetail?.distance?.value,
            })
          }
        />
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
      {routes.length > 0 && (
        <BTabSections
          swipeEnabled={false}
          navigationState={{ index, routes }}
          renderScene={() => (
            <ProductList
              onEndReached={() => send('onEndReached')}
              products={productsData}
              isLoadMore={isLoadMore}
              loadProduct={loadProduct}
              refreshing={refreshing}
              onRefresh={() => send('refreshingList')}
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
      <BAlert
        isVisible={state.matches('unreachable')}
        type="warning"
        onClose={() => send('hideWarning')}
      />
    </SafeAreaView>
  );
};

export default PriceList;
