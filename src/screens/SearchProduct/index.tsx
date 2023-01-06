/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import BTabSections from '@/components/organism/TabSections';
import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { SceneMap } from 'react-native-tab-view';
import SearchProductNavbar from './element/SearchProductNavbar';
import SearchProductStyles from './styles';
import ProductList from '@/components/templates/Price/ProductList';
import { useNavigation } from '@react-navigation/native';
import BHeaderIcon from '@/components/atoms/BHeaderIcon';
import resScale from '@/utils/resScale';
import debounce from 'lodash.debounce';

const SearchProduct = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'NFA', totalItems: 2, chipPosition: 'right' },
    { key: 'second', title: 'FA', totalItems: 0, chipPosition: 'right' },
  ]);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [productData, setProductData] = React.useState<[]>([]);
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => (
        <BHeaderIcon
          size={resScale(30)}
          iconName="chevron-left"
          marginRight={resScale(16)}
          onBack={() => navigation.goBack()}
        />
      ),
      headerTitle: () => (
        <SearchProductNavbar
          value={searchValue}
          onChangeText={onChangeText}
          onClearValue={() => setSearchValue('')}
        />
      ),
    });
  }, [navigation, searchValue]);

  const onChangeText = (text: string) => {
    setSearchValue(text);
  };

  // const debouncedResults = React.useMemo(() => {
  //   return debounce(onChangeText);
  // }, [searchValue]);

  const renderProductList = () => {
    return (
      <ProductList emptyProductName={searchValue} products={productData} />
    );
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
      />
    </SafeAreaView>
  );
};

export default SearchProduct;
