// In App.js in a new project

import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BTabScreen from '@/navigation/elements/BTabScreen';
import Operation from '@/screens/Operation';
import Dispatch from '@/screens/Operation/Dispatch';
import CustomOperationTabBar from './OperationTabBar';

const Tab = createBottomTabNavigator();

function OperationTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <CustomOperationTabBar {...props} />}
    >
      {BTabScreen({
        Tab: Tab,
        name: 'Dispatch',
        title: 'Beranda',
        type: 'home',
        color: 'white',
        component: Operation,
      })}
      {BTabScreen({
        Tab: Tab,
        name: 'Return',
        title: 'Beranda',
        type: 'sub',
        component: Dispatch,
      })}
    </Tab.Navigator>
  );
}

export default OperationTabs;
