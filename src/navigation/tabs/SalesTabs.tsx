// In App.js in a new project

import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from 'react-native';
import BText from '@/components/atoms/BText';
import {Button} from 'react-native-paper';
import colors from '@/constants/colors';
import BTabScreen from '@/navigation/elements/BTabScreen';
import BStatusBar from '@/components/atoms/BStatusBar';
import HomeScreen from '@/screens/HomeScreen';

function HomeScreen2() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen 2</Text>
      <Text style={{fontFamily: 'montserrat_regular'}}>Home Screen 2</Text>
      <Text style={{fontFamily: 'montserrat_extrabold'}}>Home Screen 2</Text>
    </View>
  );
}

function HomeScreen3() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen 3</Text>
      <Text style={{fontFamily: 'montserrat_regular'}}>Home Screen 3</Text>
      <Text style={{fontFamily: 'montserrat_extrabold'}}>Home Screen 3</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function SalesTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        // headerShown: false,
        tabBarStyle: {
          borderColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 54,
        },
      }}>
      {BTabScreen({
        Tab: Tab,
        name: 'HomeTab',
        title: 'Beranda',
        type: 'home',
        color: 'primary',
        component: HomeScreen,
      })}
      {BTabScreen({
        Tab: Tab,
        name: 'HomeTab2',
        title: 'HomeTab2',
        type: 'sub',
        component: HomeScreen2,
      })}
      {BTabScreen({
        Tab: Tab,
        name: 'HomeTab3',
        title: 'HomeTab3',
        type: 'sub',
        component: HomeScreen3,
      })}
    </Tab.Navigator>
  );
}

export default SalesTabs;
