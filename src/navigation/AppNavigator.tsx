// In App.js in a new project

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BStackScreen from './elements/BStackScreen';
import SalesTabs from './tabs/SalesTabs';
import TestStack from './stacks/TestStack';
import Splash from '@/screens/Splash';
import AuthStack from './stacks/AuthStack';
import { useBootStrapAsync } from '@/hooks';
import Operation from '@/screens/Operation';
import { USER_TYPE } from '@/models/EnumModel';
import SecurityTabs from './tabs/SecurityTabs';

const Stack = createNativeStackNavigator();

const getTabs = (userType?: USER_TYPE) => {
  let salesTabs = SalesTabs;
  let securityTabs = SecurityTabs;
  switch (userType) {
    case USER_TYPE.OPERATION:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: 'Beranda',
        type: 'home',
        color: 'white',
        headerShown: true,
        component: Operation,
        role: 'Transport',
      });
    case USER_TYPE.SECURITY:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: 'Beranda',
        type: 'home',
        color: 'white',
        headerShown: true,
        component: securityTabs,
        role: 'Dispatch',
      });
    default:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: `Beranda - ${userType}`,
        type: 'home',
        color: 'primary',
        headerShown: false,
        component: salesTabs,
        role: '',
      });
  }
};

const getStacks = (userType?: USER_TYPE) => {
  if (userType === USER_TYPE.OPSMANAGER) return TestStack({ Stack: Stack });
  return TestStack({ Stack: Stack });
};

const authStack = () => AuthStack({ Stack: Stack });

function AppNavigator() {
  const [isLoading, userData] = useBootStrapAsync();
  const userType = USER_TYPE.OPSMANAGER;

  if (isLoading) {
    return <Splash />;
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      {userData ? (
        <>
          {getTabs(userType)}
          {getStacks(userType)}
        </>
      ) : (
        <>{authStack()}</>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
