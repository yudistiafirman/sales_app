import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PriceList from '@/screens/Price';
import CustomSalesTabBar from './../SalesTabs/SalesTabBar';
import Profile from '@/screens/Profile';
import Transactions from '@/screens/Transactions';
import Home from '@/screens/Home';

const Tab = createBottomTabNavigator();

function SalesTabsV2() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
      tabBar={(props) => <CustomSalesTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Transaction" component={Transactions} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="PriceList" component={PriceList} />
    </Tab.Navigator>
  );
}

export default SalesTabsV2;
