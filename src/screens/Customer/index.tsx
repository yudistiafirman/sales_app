import {
  BContainer,
  BSearchBar,
  BSpacer,
  BTabSections,
  BVisitationCard,
} from '@/components';
import PriceListShimmer from '@/components/templates/Price/PriceListShimmer';
import { colors, fonts, layout } from '@/constants';
import { ICustomerListData } from '@/models/Customer';
import { RootState } from '@/redux/store';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import CustomerCard from './elements/CustomerCard';
import { color } from 'react-native-reanimated';
import { resScale } from '@/utils';

const Customer = () => {
  const { customerListData, isLoading, isLoadMore, isRefreshing } = useSelector(
    (state: RootState) => state.customer
  );

  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);

  const goToCustomerDetail = (id) => {
    navigation.navigate('CUSTOMER_DETAIL');
  };

  const routes = [
    {
      key: '1',
      title: 'Semua',
      totalItems: 5,
      chipPosition: 'right',
    },
    {
      key: '2',
      title: 'Perusahaan',
      totalItems: 12,
      chipPosition: 'right',
    },
    {
      key: '3',
      title: 'Individu',
      totalItems: 2,
      chipPosition: 'right',
    },
  ];

  const renderItem: ListRenderItem<ICustomerListData> = React.useCallback(
    ({ item, index }) => {
      return (
        <CustomerCard
          avatarText={item?.name[0]}
          customerName={item?.displayName}
          customerType={item?.type}
          ktp={item?.ktp}
          npwp={item?.npwp}
          chipBgColor={
            item?.type === 'INDIVIDU'
              ? colors.status.lightYellow
              : colors.status.lightBlue
          }
        />
      );
    },
    []
  );

  const renderItemSeparator = () => {
    return <BSpacer size="extraSmall" />;
  };

  const onEndReached = () => {
    console.log('ini on end reached');
  };

  const onRefresh = () => {
    console.log('ini on refresh');
  };

  const onTabPress = () => {
    console.log('ini on Tab press');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <BSearchBar
          outlineStyle={{ borderWidth: 0, borderRadius: layout.radius.md }}
          placeholder="Cari Pelanggan"
          bgColor={colors.lightCyanBlue}
          textInputStyle={{ minHeight: resScale(42) }}
          // left={<TextInput.Icon icon="magnify" />}
          // right={<TextInput.Icon icon="close" />}
        />
      </View>

      <BSpacer size="extraSmall" />
      <BTabSections
        swipeEnabled={false}
        navigationState={{ index, routes }}
        renderScene={() => (
          <FlashList
            keyExtractor={(item, indx) => indx.toString()}
            data={customerListData}
            contentContainerStyle={{
              paddingTop: resScale(44),
              paddingHorizontal: layout.pad.ml,
            }}
            ItemSeparatorComponent={renderItemSeparator}
            renderItem={renderItem}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
          />
        )}
        onTabPress={onTabPress}
        onIndexChange={setIndex}
        tabStyle={styles.tabStyle}
        tabBarStyle={styles.tabBarStyle}
        tabTextFocusedColor={colors.blueSail}
        indicatorStyle={styles.tabIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: layout.pad.lg,
  },
  tabIndicator: {
    backgroundColor: colors.blueSail,
    marginLeft: resScale(15.5),
  },
  tabStyle: {
    width: 'auto',
    paddingRight: layout.pad.md,
  },
  tabBarStyle: {
    backgroundColor: colors.white,
    paddingHorizontal: layout.pad.md,
  },
});

export default Customer;
