import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Operation from '@/screens/Operation';
import Dispatch from '@/screens/Operation/Dispatch';
import CustomSecurityTabBar from './../SecurityTabs/SecurityTabBar';

const Tab = createBottomTabNavigator();

function SecurityTabsV2() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
      tabBar={(props) => <CustomSecurityTabBar {...props} />}
    >
      <Tab.Screen name="Operation" component={Operation} />
      <Tab.Screen name="Dispatch" component={Dispatch} />
    </Tab.Navigator>
  );
}

export default SecurityTabsV2;
