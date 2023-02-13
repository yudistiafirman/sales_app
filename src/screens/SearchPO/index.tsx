import * as React from 'react';
import { SafeAreaView, DeviceEventEmitter, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import resScale from '@/utils/resScale';
import { BHeaderIcon, BSpacer, BTabSections, ProductList } from '@/components';
import { colors, layout } from '@/constants';
import { useMachine } from '@xstate/react';
import SearchPONavbar from './element/SearchPONavbar';
import { searchPOMachine } from '@/machine/searchPOMachine';
import useCustomHeaderLeft from '@/hooks/useCustomHeaderLeft';

const SearchPO = () => {
  const route = useRoute<RouteProp<Record<string, object>, string>>();
  let isGoback: boolean = false;
  if (route.params) {
    const { isGobackAfterPress } = route.params as {
      isGobackAfterPress: boolean;
    };
    isGoback = isGobackAfterPress;
  }
  const [index, setIndex] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const navigation = useNavigation();
  const [state, send] = useMachine(searchPOMachine);

  useCustomHeaderLeft({
    customHeaderLeft: (
      <BHeaderIcon
        size={resScale(23)}
        onBack={() => navigation.goBack()}
        iconName="x"
      />
    ),
  });

  const onChangeText = (text: string) => {
    setSearchValue(text);

    if (text.length === 0) {
      send('clearInput');
    } else {
      send('searchingPO', { value: text });
    }
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

  const { routes, poData, loadPO } = state.context;
  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchPONavbar
        customStyle={styles.search}
        value={searchValue}
        onChangeText={onChangeText}
        onClearValue={onClearValue}
      />
      <BSpacer size="small" />
      {routes.length > 0 && (
        <BTabSections
          tabStyle={styles.tabStyle}
          indicatorStyle={styles.tabIndicator}
          navigationState={{ index, routes }}
          onTabPress={onTabPress}
          renderScene={() => (
            <ProductList
              products={poData}
              loadProduct={loadPO}
              emptyProductName={searchValue}
              onPress={(data) => {
                DeviceEventEmitter.emit('event.testEvent', { data });
                if (isGoback) {
                  navigation.goBack();
                }
              }}
            />
          )}
          onIndexChange={setIndex}
          tabBarStyle={styles.tabBarStyle}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  search: { flex: 1, paddingHorizontal: layout.pad.lg },
  tabIndicator: {
    height: 2,
    backgroundColor: colors.primary,
    marginLeft: resScale(15.5),
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: layout.pad.lg,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.lg,
  },
});

export default SearchPO;
