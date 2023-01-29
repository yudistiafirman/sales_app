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
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Modal from 'react-native-modal';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

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
  const [isLoading, userData] = useBootStrapAsync();
  const isPopUpVisible = useSelector(
    (state: RootState) => state.modal.isPopUpVisible
  );
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
      {/* <Modal isVisible={isPopUpVisible}>
        <View>
          <Text>ini popup global</Text>
        </View>
      </Modal> */}
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
