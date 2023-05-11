import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { colors } from '@/constants';
import { ENTRY_TYPE } from '@/models/EnumModel';
import SalesHeaderRight from '@/navigation/Sales/HeaderRight';
import {
  SECURITY_TAB_TITLE,
  TAB_DISPATCH,
  TAB_DISPATCH_TITLE,
  TAB_RETURN,
  TAB_RETURN_TITLE,
  TAB_WB_IN,
  TAB_WB_IN_TITLE,
  TAB_WB_OUT,
  TAB_WB_OUT_TITLE,
} from '@/navigation/ScreenNames';
import { RootState } from '@/redux/store';
import Dispatch from '@/screens/Operation/Dispatch';
import Return from '@/screens/Operation/Return';
import CustomTabBar from '../CustomTabBar';

const Tab = createBottomTabNavigator();

function SecurityTabs() {
  const userData = useSelector((state: RootState) => state.auth.userData);

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        key={userData?.type === ENTRY_TYPE.SECURITY ? TAB_DISPATCH : TAB_WB_OUT}
        name={userData?.type === ENTRY_TYPE.SECURITY ? TAB_DISPATCH_TITLE : TAB_WB_OUT_TITLE}
        options={{
          headerTitle: SECURITY_TAB_TITLE,
          headerRight: () => SalesHeaderRight(colors.text.darker),
          headerShown: true,
        }}
        component={Dispatch}
      />
      <Tab.Screen
        key={userData?.type === ENTRY_TYPE.SECURITY ? TAB_RETURN : TAB_WB_IN}
        name={userData?.type === ENTRY_TYPE.SECURITY ? TAB_RETURN_TITLE : TAB_WB_IN_TITLE}
        options={{
          headerTitle: SECURITY_TAB_TITLE,
          headerRight: () => SalesHeaderRight(colors.text.darker),
          headerShown: true,
        }}
        component={Return}
      />
    </Tab.Navigator>
  );
}

export default SecurityTabs;
