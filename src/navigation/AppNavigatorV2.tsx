import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/screens/Splash';
import { useBootStrapAsync } from '@/hooks';
import Operation from '@/screens/Operation';
import { USER_TYPE } from '@/models/EnumModel';
import { JwtPayload } from 'jwt-decode';
import { BHeaderTitle } from '@/components';
import SecurityTabsV2 from './tabs/SecurityTabsV2';
import SalesTabsV2 from './tabs/SalesTabsV2';
import Login from '@/screens/Login';
import Verification from '@/screens/Verification';
import { getOperationStack, getSalesStack } from './stacks/StackV2';
import { colors } from '@/constants';

const Stack = createNativeStackNavigator();

const getRootScreen = (
  userData: boolean | JwtPayload | null,
  userType?: USER_TYPE
) => {
  if (userData) {
    switch (userType) {
      case USER_TYPE.OPERATION:
        return [
          <Stack.Screen
            name={'Operation'}
            component={Operation}
            options={{
              headerTitle: () =>
                BHeaderTitle(
                  'Operation',
                  'center',
                  colors.text.dark,
                  'OPERATION'
                ),
            }}
          />,
          getOperationStack(Stack),
        ];
      case USER_TYPE.SECURITY:
        return [
          <Stack.Screen
            name={'Root'}
            component={SecurityTabsV2}
            options={{
              headerTitle: () =>
                BHeaderTitle('Beranda', 'center', colors.text.dark, 'SECURITY'),
            }}
          />,
          getOperationStack(Stack),
        ];
      default:
        return [
          <Stack.Screen
            name={'Root'}
            component={SalesTabsV2}
            options={{
              headerStyle: { backgroundColor: colors.primary },
              headerTitle: () =>
                BHeaderTitle('Beranda', 'center', colors.text.light),
            }}
          />,
          getSalesStack(Stack),
        ];
    }
  } else {
    return [
      <Stack.Screen
        name={'Login'}
        component={Login}
        options={{
          headerTitle: () => BHeaderTitle('Log in', 'flex-start'),
        }}
      />,
      <Stack.Screen
        name={'Verification'}
        component={Verification}
        options={{
          headerTitle: () => BHeaderTitle('Kode Verifikasi', 'flex-start'),
        }}
      />,
    ];
  }
};

function AppNavigatorV2() {
  const [isLoading, userData] = useBootStrapAsync();
  const userType = USER_TYPE.SALES;

  if (isLoading) {
    return <Splash />;
  } else {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerShown: true,
        }}
      >
        {getRootScreen(userData, userType)}
      </Stack.Navigator>
    );
  }
}

export default AppNavigatorV2;
