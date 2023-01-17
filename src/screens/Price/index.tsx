/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { AppState, SafeAreaView } from 'react-native';
import BTabSections from '@/components/organism/TabSections';
import { useNavigation } from '@react-navigation/native';
import Tnc from '@/screens/Price/element/Tnc';
import CurrentLocation from './element/CurrentLocation';
import PriceStyle from './PriceStyle';
import PriceSearchBar from './element/PriceSearchBar';
import ProductList from '@/components/templates/Price/ProductList';
import { BAlert, BSpacer, BSpinner, BTouchableText } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegion } from '@/redux/locationReducer';
import { RootState } from '@/redux/store';
import { useMachine } from '@xstate/react';
import { priceMachine } from '@/machine/priceMachine';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { layout } from '@/constants';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const PriceList = () => {
  const navigation = useNavigation();
  const { region } = useSelector((state: RootState) => state.location);
  const dispatch = useDispatch();
  const [index, setIndex] = React.useState(0);
  const [productsData, setProductsData] = React.useState([]);
  const appState = useRef(AppState.currentState);
  const [state, send] = useMachine(priceMachine);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        send('appComeForegroundState');
      } else {
        send('appComeBackgroundState');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const renderHeaderRight = () => {
    return (
      <BTouchableText onPress={() => send('showAgreement')} title="Ketentuan" />
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  }, [navigation]);

  const { locationDetail, showingAlert, routes } = state.context;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BSpacer size="small" />
      {state.matches('getLocation.finito') ? (
        <CurrentLocation
          onPress={() => navigation.navigate('Location')}
          location={locationDetail.formattedAddress}
        />
      ) : (
        <ShimmerPlaceholder
          style={{
            marginHorizontal: layout.pad.lg,
            height: layout.pad.lg,
            width: '92%',
          }}
          stopAutoRun
        />
      )}
      <BSpacer size="extraSmall" />
      <PriceSearchBar onPress={() => navigation.navigate('SearchProduct')} />
      <BSpacer size="extraSmall" />
      <BTabSections
        navigationState={{ index, routes }}
        renderScene={() => <ProductList products={productsData} />}
        onIndexChange={setIndex}
        tabStyle={
          state.matches('getProduct.categoriesLoaded') && PriceStyle.tabStyle
        }
        indicatorStyle={PriceStyle.tabIndicator}
      />

      <Tnc
        isVisible={state.matches('Tnc.agreementShowed')}
        onCloseTnc={() => send('hideAgreement')}
      />
      <BAlert
        isVisible={state.matches('getLocation.unreachable')}
        type="warning"
        onClose={() => send('hideWarning')}
      />
    </SafeAreaView>
  );
};

export default PriceList;
