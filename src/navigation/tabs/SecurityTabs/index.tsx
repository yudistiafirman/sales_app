import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dispatch from '@/screens/Operation/Dispatch';
import CustomTabBar from '../CustomTabBar';
import {
  SECURITY_TAB_TITLE,
  TAB_DISPATCH,
  TAB_DISPATCH_TITLE,
  TAB_RETURN,
  TAB_RETURN_TITLE,
} from '@/navigation/ScreenNames';
import OperationHeaderRight from '@/navigation/Operation/OperationHeaderRight';
import Return from '@/screens/Operation/Return';

const Tab = createBottomTabNavigator();

function SecurityTabs() {
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
        key={TAB_DISPATCH}
        name={TAB_DISPATCH_TITLE}
        options={{
          headerTitle: SECURITY_TAB_TITLE,
          headerRight: () => OperationHeaderRight('Dispatch'),
          headerShown: true,
        }}
        component={Dispatch}
      />
      <Tab.Screen
        key={TAB_RETURN}
        name={TAB_RETURN_TITLE}
        options={{
          headerTitle: SECURITY_TAB_TITLE,
          headerRight: () => OperationHeaderRight('Return'),
          headerShown: true,
        }}
        component={Return}
      />
    </Tab.Navigator>
  );
}

export default SecurityTabs;
