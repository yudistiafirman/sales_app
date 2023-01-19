/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { SafeAreaView } from 'react-native';
import SearchProductNavbar from './element/SearchProductNavbar';
import SearchProductStyles from './styles';
import { useNavigation } from '@react-navigation/native';
import resScale from '@/utils/resScale';
import { BHeaderIcon, BSpacer, BTabSections, ProductList } from '@/components';
import { layout } from '@/constants';
import { useMachine } from '@xstate/react';
import { searchProductMachine } from '@/machine/searchProductMachine';

const SearchProduct = ({ route }: { route: any }) => {
  const [index, setIndex] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const navigation = useNavigation();
  const [state, send] = useMachine(searchProductMachine);

  const renderHeaderLeft = () => (
    <BHeaderIcon
      size={resScale(30)}
      iconName="chevron-left"
      marginRight={layout.pad.lg}
      onBack={() => navigation.goBack()}
    />
  );

  const renderHeaderCenter = () => (
    <SearchProductNavbar
      value={searchValue}
      onChangeText={onChangeText}
      onClearValue={onClearValue}
    />
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => renderHeaderLeft(),
      headerTitle: () => renderHeaderCenter(),
    });
  }, [navigation, searchValue]);

  const onChangeText = (text: string) => {
    setSearchValue(text);
    send('searchingProducts', { value: text });
  };

  const onClearValue = () => {
    setSearchValue('');
    send('clearInput');
  };

  const onTabPress = ({ route }) => {
    const tabIndex = index === 0 ? 1 : 0;
    if (route.key !== routes[index].key) {
      send('onChangeTab', { value: tabIndex });
    }
  };
  const { routes, productsData, loadProduct } = state.context;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BSpacer size="small" />
      {routes.length > 0 && (
        <BTabSections
          tabStyle={SearchProductStyles.tabStyle}
          indicatorStyle={SearchProductStyles.tabIndicator}
          navigationState={{ index, routes }}
          onTabPress={onTabPress}
          renderScene={() => (
            <ProductList
              products={productsData}
              loadProduct={loadProduct}
              emptyProductName={searchValue}
            />
          )}
          onIndexChange={setIndex}
          tabBarStyle={SearchProductStyles.tabBarStyle}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchProduct;
