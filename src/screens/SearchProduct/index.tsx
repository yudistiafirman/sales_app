/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { SceneMap } from 'react-native-tab-view';
import SearchProductNavbar from './element/SearchProductNavbar';
import SearchProductStyles from './styles';
import { useNavigation } from '@react-navigation/native';
import resScale from '@/utils/resScale';
import debounce from 'lodash.debounce';
import { BHeaderIcon, BTabSections, ProductList } from '@/components';

const SearchProduct = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'NFA', totalItems: 2, chipPosition: 'right' },
    { key: 'second', title: 'FA', totalItems: 0, chipPosition: 'right' },
  ]);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [productData, setProductData] = React.useState<[]>([]);
  const navigation = useNavigation();

  const renderHeaderLeft = () => (
    <BHeaderIcon
      size={resScale(30)}
      iconName="chevron-left"
      marginRight={resScale(16)}
      onBack={() => navigation.goBack()}
    />
  );

  const renderHeaderCenter = () => (
    <SearchProductNavbar
      value={searchValue}
      onChangeText={onChangeText}
      onClearValue={() => setSearchValue('')}
    />
  );

  const renderProductList = () => {
    return (
      <ProductList emptyProductName={searchValue} products={productData} />
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
      headerTitle: () => renderHeaderCenter(),
    });
  }, [navigation, searchValue]);

  const onChangeText = (text: string) => {
    setSearchValue(text);
  };


  const renderScene = SceneMap({
    first: renderProductList,
    second: renderProductList,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BTabSections
        tabStyle={SearchProductStyles.tabStyle}
        indicatorStyle={SearchProductStyles.tabIndicator}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        tabBarStyle={SearchProductStyles.tabBarStyle}
      />
    </SafeAreaView>
  );
};

export default SearchProduct;
