/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { SceneMap } from 'react-native-tab-view';
import BTabSections from '@/components/organism/TabSections';
import { useNavigation, useRoute } from '@react-navigation/native';
import Tnc from '@/screens/Price/element/Tnc';
import CurrentLocation from './element/CurrentLocation';
import PriceStyle from './PriceStyle';
import Geolocation from 'react-native-geolocation-service';
import PriceSearchBar from './element/PriceSearchBar';
import ProductList from '@/components/templates/Price/ProductList';
import BAlert from '@/components/organism/BAlert';
import BTouchableText from '@/components/atoms/BTouchableText';
import { hasLocationPermission } from '@/utils/permissions/locationPermissions';
import BSpinner from '@/components/atoms/BSpinner';
const PriceList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isVisibleTnc, setIsVisibleTnc] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const [location, setLocation] = React.useState<{}>({});
  const [loading, setLoading] = React.useState(true);
  const [routes] = React.useState([
    { key: 'first', title: 'NFA', totalItems: 8, chipPosition: 'right' },
    { key: 'second', title: 'FA', totalItems: 6, chipPosition: 'right' },
  ]);
  const [productsData, setProductsData] = React.useState([]);

  const renderProductList = () => {
    return <ProductList products={productsData} />;
  };
  const renderScene = SceneMap({
    first: renderProductList,
    second: renderProductList,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BTouchableText
          onPress={() => setIsVisibleTnc(true)}
          title="Ketentuan"
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (route.params?.updatedParams) {
      const { latitude, longitude } = route.params.updatedParams;
      const locationDetails = `latitude=${latitude} and longitude=${longitude}`;
      setLocation({ latitude, longitude, locationDetails });
    } else {
      getCurrentLocation();
    }
  }, [route.params?.updatedParams]);

  const getCurrentLocation = React.useCallback(async () => {
    const hasPermission = await hasLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('ini current position', position.coords);
          const locationDetails = `latitude=${latitude} and longitude=${longitude}`;
          const coordinate = {
            latitude,
            longitude,
            locationDetails,
          };
          setLocation(coordinate);
          setLoading(false)
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }, [location]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <BSpinner />
      ) : (
        <CurrentLocation
          onPress={() =>
            navigation.navigate('Location', {
              longitude: location.longitude,
              latitude: location.latitude,
            })
          }
          location={location.locationDetails}
        />
      )}

      <PriceSearchBar onPress={() => navigation.navigate('SearchProduct')} />
      <BTabSections
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        indicatorStyle={PriceStyle.tabIndicator}
        tabStyle={PriceStyle.tabStyle}
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
