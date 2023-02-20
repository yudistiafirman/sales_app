// In App.js in a new project

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BStackScreen from './elements/BStackScreen';
import SalesTabs from './tabs/SalesTabs';
import TestStack from './stacks/TestStack';
import Splash from '@/screens/Splash';
import AuthStack from './stacks/AuthStack';
import Operation from '@/screens/Operation';
import { ENTRY_TYPE } from '@/models/EnumModel';
import SecurityTabs from './tabs/SecurityTabs';
import { JwtPayload } from 'jwt-decode';
import { useAsyncConfigSetup } from '@/hooks';

const Stack = createNativeStackNavigator();

const getTabs = (userType?: ENTRY_TYPE) => {
  switch (userType) {
    case ENTRY_TYPE.OPERATION:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: 'Beranda',
        type: 'home',
        headerShown: true,
        component: Operation,
        role: ENTRY_TYPE[ENTRY_TYPE.OPERATION],
      });
    case ENTRY_TYPE.SECURITY:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: 'Beranda',
        type: 'home',
        headerShown: true,
        component: SecurityTabs,
        role: ENTRY_TYPE[ENTRY_TYPE.SECURITY],
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

/**
 * @deprecated The method should not be used
 */
function AppNavigator() {
  const [isLoading, userData] = useAsyncConfigSetup();
  const userType = ENTRY_TYPE.SECURITY;

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
