/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { SceneMap } from 'react-native-tab-view';
import BTabSections from '@/components/organism/TabSections';
import { useNavigation } from '@react-navigation/native';
import Tnc from '@/screens/Price/element/Tnc';
import CurrentLocation from './element/CurrentLocation';
import PriceStyle from './PriceStyle';
import PriceNavbar from './element/PriceNavbar';
import PriceSearchBar from './element/PriceSearchBar';
import ProductList from '@/components/templates/Price/ProductList';
import BAlert from '@/components/organism/BAlert';
import BTouchableText from '@/components/atoms/BTouchableText';

const PriceList = () => {
  const navigation = useNavigation();
  const [isVisibleTnc, setIsVisibleTnc] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState<boolean>(true);
  const [location, setLocation] = React.useState<string>('');
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CurrentLocation
        onPress={() => navigation.navigate('Location')}
        location={location}
      />
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
