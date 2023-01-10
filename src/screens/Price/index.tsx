/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { SceneMap } from 'react-native-tab-view';
import BTabSections from '@/components/organism/TabSections';
import { useNavigation } from '@react-navigation/native';
import Tnc from '@/screens/Price/element/Tnc';
import CurrentLocation from './element/CurrentLocation';
import PriceStyle from './PriceStyle';
import Geolocation from 'react-native-geolocation-service';
import PriceSearchBar from './element/PriceSearchBar';
import ProductList from '@/components/templates/Price/ProductList';
import { BAlert, BSpinner, BTouchableText } from '@/components';
import { hasLocationPermission } from '@/utils/permissions';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegion } from '@/redux/locationReducer';
import { RootState } from '@/redux/store';
const PriceList = () => {
  const navigation = useNavigation();
  const { region } = useSelector((state: RootState) => state.location);
  const dispatch = useDispatch();
  const [isVisibleTnc, setIsVisibleTnc] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState(true);
  const [routes] = React.useState([
    { key: 'first', title: 'NFA' },
    { key: 'second', title: 'FA' },
  ]);
  const [productsData, setProductsData] = React.useState([]);

  const renderProductList = () => {
    return <ProductList products={productsData} />;
  };
  const renderHeaderRight = () => {
    return (
      <BTouchableText onPress={() => setIsVisibleTnc(true)} title="Ketentuan" />
    );
  };
  const renderScene = SceneMap({
    first: renderProductList,
    second: renderProductList,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  }, [navigation]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = React.useCallback(async () => {
    const hasPermission = await hasLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinatePayload = {
            latitude,
            longitude,
          };
          dispatch(updateRegion(coordinatePayload));
          setLoading(false);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }, [dispatch]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <BSpinner />
      ) : (
        <CurrentLocation
          onPress={() => navigation.navigate('Location')}
          location={`latitude:${region.latitude} longitude:${region.longitude}`}
        />
      )}

      <PriceSearchBar onPress={() => navigation.navigate('SearchProduct')} />
      <BTabSections
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        indicatorStyle={PriceStyle.tabIndicator}
        tabStyle={PriceStyle.tabStyle}
        tabBarStyle={PriceStyle.tabBarStyle}
      />
      <Tnc isVisible={isVisibleTnc} onCloseTnc={() => setIsVisibleTnc(false)} />
      <BAlert
        isVisible={showAlert}
        type="warning"
        onClose={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
};

export default PriceList;
