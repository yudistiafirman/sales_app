/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { SafeAreaView, View, DeviceEventEmitter } from 'react-native';
import SearchProductNavbar from './element/SearchProductNavbar';
import SearchProductStyles from './styles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import resScale from '@/utils/resScale';
import { BHeaderIcon, BSpacer, BTabSections, ProductList } from '@/components';
import { layout } from '@/constants';
import { useMachine } from '@xstate/react';
import { searchProductMachine } from '@/machine/searchProductMachine';
import useCustomHeaderCenter from '@/hooks/useCustomHeaderCenter';

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
  const route = useRoute<RouteProp<Record<string, object>, string>>();
  let isGoback: boolean = false;
  if (route.params) {
    const { isGobackAfterPress } = route.params as {
      isGobackAfterPress: boolean;
      distance: number;
    };
    isGoback = isGobackAfterPress;
  }
  // const { isGobackAfterPress } = route.params as {
  //   isGobackAfterPress: boolean;
  // };
  const [index, setIndex] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const navigation = useNavigation();
  const [state, send] = useMachine(searchProductMachine);

  React.useEffect(() => {
    if (route?.params) {
      const { distance } = route.params;
      send('sendingParams', { value: distance });
    }
  }, [route?.params]);

  const onChangeText = (text: string) => {
    console.log(text, 'onChangeText');

    setSearchValue(text);

    if (text.length === 0) {
      send('clearInput');
    } else {
      send('searchingProducts', { value: text });
    }
  };

  const onClearValue = () => {
    setSearchValue('');
    send('clearInput');
  };

  if (!isAsComponent) {
    useCustomHeaderCenter(
      {
        customHeaderCenter: (
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <SearchProductNavbar
              customStyle={{
                width: '75%',
                justifyContent: 'center',
              }}
              value={searchValue}
              onChangeText={onChangeText}
              onClearValue={onClearValue}
            />
          </View>
        ),
      },
      [searchValue]
    );
  }

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
              onPress={(data) => {
                if (getProduct) {
                  getProduct(data);
                } else {
                  DeviceEventEmitter.emit('event.testEvent', { data });
                  if (isGoback) {
                    navigation.goBack();
                  }
                }
              }}
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
