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
import { JwtPayload } from 'jwt-decode';

const Stack = createNativeStackNavigator();

const getTabs = (userType?: USER_TYPE) => {
  switch (userType) {
    case USER_TYPE.OPERATION:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: 'Beranda',
        type: 'home',
        headerShown: true,
        component: Operation,
        role: USER_TYPE[USER_TYPE.OPERATION],
      });
    case USER_TYPE.SECURITY:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: 'Beranda',
        type: 'home',
        headerShown: true,
        component: SecurityTabs,
        role: USER_TYPE[USER_TYPE.SECURITY],
      });
    default:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: `Beranda - ${userType}`,
        type: 'home',
        headerShown: false,
        component: SalesTabs,
        role: '',
      });
  }
};

const getStacks = (userData: boolean | JwtPayload | null) => {
  if (userData) {
    return TestStack({ Stack: Stack });
  } else {
    return AuthStack({ Stack: Stack });
  }
};

function AppNavigator() {
  const [isLoading, userData] = useBootStrapAsync();
  const userType = USER_TYPE.SECURITY;

  if (isLoading) {
    return <Splash />;
  } else {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      >
        {userData && getTabs(userType)}
        {getStacks(userData)}
      </Stack.Navigator>
    );
  }
}

export default AppNavigator;
