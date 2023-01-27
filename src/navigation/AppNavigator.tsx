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
import Camera from '@/screens/Camera';

const Stack = createNativeStackNavigator();

const getTabs = (
  userType?: 'opsManager' | 'sales' | 'cameraTest' | undefined
) => {
  let tabs = SalesTabs;
  if (userType === 'cameraTest') {
    return BStackScreen({
      Stack: Stack,
      name: 'Camera',
      title: 'Camera',
      type: 'home',
      color: 'white',
      headerShown: true,
      component: Camera,
    });
  } else {
    return BStackScreen({
      Stack: Stack,
      name: 'MainTabs',
      title: `Beranda - ${userType}`,
      type: 'home',
      color: 'primary',
      headerShown: false,
      component: tabs,
    });
  }
};

const getStacks = (
  userType?: 'opsManager' | 'sales' | 'cameraTest' | undefined
) => {
  if (userType === 'opsManager') return TestStack({ Stack: Stack });
  return TestStack({ Stack: Stack });
};

const authStack = () => AuthStack({ Stack: Stack });

function AppNavigator() {
  const [isLoading, userData] = useBootStrapAsync();
  const userType = 'cameraTest';

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
