import { colors, layout } from '@/constants';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { resScale } from '@/utils';
import BList from '@/components/templates/BList';
import { useMachine } from '@xstate/react';
import customerListMachine from '@/machine/customerListMachine';
import {
  CUSTOMER_CUSTOMER_DETAIL,
  TAB_CUSTOMER,
} from '@/navigation/ScreenNames';
import crashlytics from '@react-native-firebase/crashlytics';

const Customer = () => {
  const [state, send] = useMachine(customerListMachine);
  const navigation = useNavigation();
  const [searchValue, setSearchValue] = React.useState('');
  const [index, setIndex] = React.useState(0);

  const { data, refreshing, routes, isLoading, errorMessage } = state.context;

  React.useEffect(() => {
    crashlytics().log(TAB_CUSTOMER);
    send('fetchData');
  }, []);

  const goToCustomerDetail = (item: ICustomerListData) => {
    navigation.navigate(CUSTOMER_CUSTOMER_DETAIL, { id: item.id });
  };

  const onTabPress = (event: any) => {
    setSearchValue('');
    send('onChangeTab', { value: event.route.key });
  };

  const onSearchCustomer = (e) => {
    setSearchValue(e);
    if (e.length > 2) {
      send('searching', { value: e });
    }
  };

  const onClearValue = () => {
    setSearchValue('');
    send('searching', { value: '' });
  };

  return (
    <View style={{ flex: 1 }}>
      <BList
        searchBarOutlineStyle={styles.outlineSearchBar}
        placeholder="Cari Pelanggan"
        onChangeText={onSearchCustomer}
        searchBarBgColor={colors.lightCyanBlue}
        searchBarInputStyle={{ minHeight: resScale(42) }}
        data={data}
        onClearValue={onClearValue}
        index={index}
        isError={state.matches('errorGettingData')}
        routes={routes}
        onRetry={() => send('retry')}
        errorMessage={errorMessage}
        onIndexChange={setIndex}
        refreshing={refreshing}
        loadList={isLoading}
        onPressCard={goToCustomerDetail}
        searchQuery={searchValue}
        onEndReached={() => send('onEndReached')}
        onRefresh={() => send('onRefresh')}
        onTabPress={onTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: layout.pad.lg,
  },
  outlineSearchBar: {
    borderWidth: 0,
    borderRadius: layout.radius.md,
  },
});

export default Customer;
