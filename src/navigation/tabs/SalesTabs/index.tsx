// In App.js in a new project

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import BText from '@/components/atoms/BText';
import { Button } from 'react-native-paper';
import colors from '@/constants/colors';
import BTabScreen from '@/navigation/elements/BTabScreen';
import BStatusBar from '@/components/atoms/BStatusBar';
import HomeScreen from '@/screens/HomeScreen';
import PriceList from '@/screens/Price/PriceList';
import scaleSize from '@/utils/scale';
import CustomSalesTabBar from './SalesTabBar';
import Profile from '@/screens/Profile';
import Transactions from '@/screens/Transactions';
import Home from '@/screens/Home';

function HomeScreen2() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen 2</Text>
      <Text style={{ fontFamily: 'Montserrat-Regular' }}>Home Screen 2</Text>
      <Text style={{ fontFamily: 'Montserrat-ExtraBold' }}>Home Screen 2</Text>
    </View>
  );
}

function HomeScreen3() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen 3</Text>
      <Text style={{ fontFamily: 'Montserrat-Regular' }}>Home Screen 3</Text>
      <Text style={{ fontFamily: 'Montserrat-ExtraBold' }}>Home Screen 3</Text>
    </View>
  );
}

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
