// In App.js in a new project

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BTabScreen from '@/navigation/elements/BTabScreen';
import PriceList from '@/screens/Price';
import CustomTabBar from '../CustomTabBar';
import Profile from '@/screens/Profile';
import Home from '@/screens/Home';
import Transaction from '@/screens/Transaction';

const Tab = createBottomTabNavigator();
/**
 * @deprecated The method should not be used
 */
function SalesTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
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
        title: 'Transaksi',
        type: 'sub',
        component: Transaction,
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
