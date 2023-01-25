/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import SearchProductNavbar from './element/SearchProductNavbar';
import SearchProductStyles from './styles';
import { useNavigation } from '@react-navigation/native';
import resScale from '@/utils/resScale';
import { BHeaderIcon, BSpacer, BTabSections, ProductList } from '@/components';
import { layout } from '@/constants';
import { useMachine } from '@xstate/react';
import { searchProductMachine } from '@/machine/searchProductMachine';

type SearchProductType = {
  isAsComponent?: boolean;
  getProduct?: (data: any) => void;
  onPressBack?: () => void;
};

const SearchProduct = ({
  isAsComponent,
  getProduct,
  onPressBack = () => {},
}: SearchProductType) => {
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
    if (!isAsComponent) {
      navigation.setOptions({
        headerBackVisible: false,
        headerLeft: () => renderHeaderLeft(),
        headerTitle: () => renderHeaderCenter(),
      });
    }
  }, [navigation, searchValue, isAsComponent]);

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
      {isAsComponent && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              marginTop: layout.pad.md,
            }}
          >
            <BHeaderIcon
              size={resScale(30)}
              marginRight={0}
              iconName="chevron-left"
              onBack={() => {
                onPressBack();
              }}
            />
          </View>
          <SearchProductNavbar
            value={searchValue}
            onChangeText={onChangeText}
            onClearValue={onClearValue}
          />
        </View>
      )}
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
              onPress={getProduct}
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
