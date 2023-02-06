import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PriceList from '@/screens/Price';
import CustomTabBar from '../CustomTabBar';
import Profile from '@/screens/Profile';
import Transactions from '@/screens/Transactions';
import Home from '@/screens/Home';
import { colors, fonts } from '@/constants';
import {
  TAB_HOME,
  TAB_HOME_TITLE,
  TAB_PRICE_LIST,
  TAB_PRICE_LIST_TITLE,
  TAB_PROFILE,
  TAB_PROFILE_TITLE,
  TAB_TRANSACTION,
  TAB_TRANSACTION_TITLE,
} from '@/navigation/ScreenNames';
import SalesHeaderRight from '@/navigation/Sales/HeaderRight';

const Tab = createBottomTabNavigator();

function SalesTabsV2() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarHideOnKeyboard: true,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: {
          color: colors.text.darker,
          fontSize: fonts.size.lg,
          fontWeight: fonts.family.montserrat[600],
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        key={TAB_HOME}
        name={TAB_HOME_TITLE}
        options={{
          headerTitle: TAB_HOME_TITLE,
          headerRight: () => SalesHeaderRight(),
        }}
        component={Home}
      />
      <Tab.Screen
        key={TAB_TRANSACTION}
        name={TAB_TRANSACTION_TITLE}
        options={{ headerTitle: TAB_TRANSACTION_TITLE }}
        component={Transactions}
      />
      <Tab.Screen
        key={TAB_PROFILE}
        name={TAB_PROFILE_TITLE}
        options={{ headerTitle: TAB_PROFILE_TITLE }}
        component={Profile}
      />
      <Tab.Screen
        key={TAB_PRICE_LIST}
        name={TAB_PRICE_LIST_TITLE}
        options={{ headerTitle: TAB_PRICE_LIST_TITLE }}
        component={PriceList}
      />
    </Tab.Navigator>
  );
}

export default SalesTabsV2;
