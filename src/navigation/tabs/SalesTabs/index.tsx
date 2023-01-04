// In App.js in a new project

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BTabScreen from '@/navigation/elements/BTabScreen';
import PriceList from '@/screens/Price/PriceList';
import CustomSalesTabBar from './SalesTabBar';
import Profile from '@/screens/Profile';
import Transactions from '@/screens/Transactions';
import Home from '@/screens/Home';

const Tab = createBottomTabNavigator();

function SalesTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomSalesTabBar {...props} />}
    >
      {BTabScreen({
        Tab: Tab,
        name: 'Beranda',
        title: 'Beranda',
        type: 'home',
        color: 'primary',
        component: Home,
      })}
      {BTabScreen({
        Tab: Tab,
        name: 'Transaksi',
        title: 'Transakski',
        type: 'sub',
        component: Transactions,
      })}
      {BTabScreen({
        Tab: Tab,
        name: 'Profil',
        title: 'Profil',
        type: 'sub',
        component: Profile,
      })}
      {BTabScreen({
        Tab: Tab,
        name: 'Harga',
        title: 'Harga',
        type: 'sub',
        component: PriceList,
      })}
    </Tab.Navigator>
  );
}

export default SalesTabs;
