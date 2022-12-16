// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BStackScreen from './elements/BStackScreen';
import SalesTabs from './tabs/SalesTabs';
import TestStack from './stacks/TestStack';
import OpsManTabs from './tabs/OpsManTabs';

const Stack = createNativeStackNavigator();

const getTabs = (userType?: 'opsManager' | 'sales' | undefined) => {
  let tabs = SalesTabs;
  if (userType === 'opsManager') tabs = OpsManTabs;
  return BStackScreen({
    Stack: Stack,
    name: 'MainTabs',
    title: `Beranda - ${userType}`,
    type: 'home',
    color: 'primary',
    headerShown: false,
    component: tabs,
  });
};

const getStacks = (userType?: 'opsManager' | 'sales' | undefined) => {
  if (userType === 'opsManager') return TestStack({Stack: Stack});
  return TestStack({Stack: Stack});
};

function AppNavigator() {
  const userType = 'opsManager';
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      {getTabs(userType)}
      {getStacks(userType)}
    </Stack.Navigator>
  );
}

export default AppNavigator;
