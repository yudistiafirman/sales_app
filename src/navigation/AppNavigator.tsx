// In App.js in a new project

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BStackScreen from './elements/BStackScreen';
import SalesTabs from './tabs/SalesTabs';
import TestStack from './stacks/TestStack';
// import OpsManTabs from './tabs/OpsManTabs';
import Splash from '@/screens/Splash';
import AuthStack from './stacks/AuthStack';

const Stack = createNativeStackNavigator();

const getTabs = (userType?: 'opsManager' | 'sales' | undefined) => {
  let tabs = SalesTabs;
  if (userType === 'opsManager') {
  }

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
  if (userType === 'opsManager') return TestStack({ Stack: Stack });
  return TestStack({ Stack: Stack });
};

const authStack = () => AuthStack({ Stack: Stack });

function AppNavigator() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [signIn, setIsSignin] = React.useState(true);
  const userType = 'sales';
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
      {signIn ? (
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
