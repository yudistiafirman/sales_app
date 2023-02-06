import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/screens/Splash';
import { useBootStrapAsync } from '@/hooks';
import Operation from '@/screens/Operation';
import { USER_TYPE } from '@/models/EnumModel';
import { JwtPayload } from 'jwt-decode';
import SecurityTabsV2 from './tabs/SecurityTabsV2';
import SalesTabsV2 from './tabs/SalesTabsV2';
import Login from '@/screens/Login';
import Verification from '@/screens/Verification';
import { colors, fonts } from '@/constants';
import {
  LOGIN,
  LOGIN_TITLE,
  OPERATION,
  OPERATION_TITLE,
  SALES_TAB,
  SECURITY_TAB,
  SECURITY_TAB_TITLE,
  VERIFICATION,
  VERIFICATION_TITLE,
} from './ScreenNames';
import OperationHeaderRight from './Operation/HeaderRight';
import OperationStack from './Operation/Stack';
import SalesStack from './Sales/Stack';

const Stack = createNativeStackNavigator();

const RootScreen = (
  userData: JwtPayload | null,
  isSignout: boolean,
  userType?: USER_TYPE
) => {
  if (userData !== null) {
    switch (userType) {
      case USER_TYPE.OPERATION:
        return (
          <>
            <Stack.Screen
              name={OPERATION}
              key={OPERATION}
              component={Operation}
              options={{
                headerTitle: OPERATION_TITLE,
                headerRight: () => OperationHeaderRight(),
              }}
            />
            {OperationStack(Stack)}
          </>
        );
      case USER_TYPE.SECURITY:
        return (
          <>
            <Stack.Screen
              name={SECURITY_TAB}
              key={SECURITY_TAB}
              component={SecurityTabsV2}
              options={{
                headerTitle: SECURITY_TAB_TITLE,
                headerRight: () => OperationHeaderRight(),
              }}
            />
            {OperationStack(Stack)}
          </>
        );
      default:
        return (
          <>
            <Stack.Screen
              name={SALES_TAB}
              key={SALES_TAB}
              component={SalesTabsV2}
              options={{
                headerShown: false,
              }}
            />
            {SalesStack(Stack)}
          </>
        );
    }
  } else {
    return (
      <>
        <Stack.Screen
          name={LOGIN}
          key={LOGIN}
          component={Login}
          options={{
            headerTitle: LOGIN_TITLE,
            animationTypeForReplace: isSignout ? 'pop' : 'push',
          }}
        />
        <Stack.Screen
          name={VERIFICATION}
          key={VERIFICATION}
          component={Verification}
          options={{
            headerTitle: VERIFICATION_TITLE,
          }}
        />
      </>
    );
  }
};

function AppNavigatorV2() {
  const { isLoading, userData, isSignout } = useBootStrapAsync();
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
          headerTitleStyle: {
            color: colors.text.darker,
            fontSize: fonts.size.lg,
            fontWeight: fonts.family.montserrat[600],
          },
        }}
      >
        {RootScreen(userData, isSignout, userType)}
      </Stack.Navigator>
    );
  }
}

export default AppNavigatorV2;
