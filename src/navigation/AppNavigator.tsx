// In App.js in a new project

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BStackScreen from './elements/BStackScreen';
import SalesTabs from './tabs/SalesTabs';
import TestStack from './stacks/TestStack';
// import OpsManTabs from './tabs/OpsManTabs';
import Splash from '@/screens/Splash';
import AuthStack from './stacks/AuthStack';
import { useBootStrapAsync } from '@/hooks';
import Operation from '@/screens/Operation';
import OperationTabs from './tabs/OperationTabs';
import { USER_TYPE } from '@/models/EnumModel';

const Stack = createNativeStackNavigator();

const getTabs = (userType?: USER_TYPE) => {
  let salesTabs = SalesTabs;
  let operationTabs = OperationTabs;
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
        operationType: 'Transport',
      });
    case USER_TYPE.SECURITY:
      return BStackScreen({
        Stack: Stack,
        name: 'MainTabs',
        title: 'Beranda',
        type: 'home',
        color: 'white',
        headerShown: true,
        component: operationTabs,
        operationType: 'Dispatch',
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
        operationType: '',
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
  const userType = USER_TYPE.SECURITY;

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
