// In App.js in a new project

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BTabScreen from '@/navigation/elements/BTabScreen';
import Operation from '@/screens/Operation';
import Dispatch from '@/screens/Operation/Dispatch';
import CustomSecurityTabBar from './SecurityTabBar';

const Tab = createBottomTabNavigator();

function SecurityTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomSecurityTabBar {...props} />}
    >
      {BTabScreen({
        Tab: Tab,
        name: 'Dispatch',
        title: 'Dispatch',
        type: 'home',
        color: 'white',
        headerShown: false,
        component: Operation,
      })}
      {BTabScreen({
        Tab: Tab,
        name: 'Return',
        title: 'Return',
        type: 'sub',
        headerShown: false,
        component: Dispatch,
      })}
    </Tab.Navigator>
  );
}

export default SecurityTabs;
