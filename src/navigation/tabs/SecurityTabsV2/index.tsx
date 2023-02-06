import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Operation from '@/screens/Operation';
import Dispatch from '@/screens/Operation/Dispatch';
import CustomTabBar from '../CustomTabBar';
import {
  TAB_DISPATCH,
  TAB_DISPATCH_TITLE,
  TAB_OPERATION,
  TAB_OPERATION_TITLE,
} from '@/navigation/ScreenNames';

const Tab = createBottomTabNavigator();

function SecurityTabsV2() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        key={TAB_OPERATION}
        name={TAB_OPERATION_TITLE}
        options={{ headerTitle: TAB_OPERATION_TITLE }}
        component={Operation}
      />
      <Tab.Screen
        key={TAB_DISPATCH}
        name={TAB_DISPATCH_TITLE}
        options={{ headerTitle: TAB_DISPATCH_TITLE }}
        component={Dispatch}
      />
    </Tab.Navigator>
  );
}

export default SecurityTabsV2;
