import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/screens/Splash';
import Operation from '@/screens/Operation';
import { ENTRY_TYPE } from '@/models/EnumModel';
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
  TAB_ROOT,
  SECURITY_TAB_TITLE,
  VERIFICATION,
  VERIFICATION_TITLE,
} from './ScreenNames';
import OperationHeaderRight from './Operation/HeaderRight';
import OperationStack from './Operation/Stack';
import SalesStack from './Sales/Stack';
import HunterAndFarmers from '@/screens/HunterAndFarmers';
import { useAsyncConfigSetup } from '@/hooks';
import { customLog } from '@/utils/generalFunc';
const Stack = createNativeStackNavigator();

const RootScreen = (
  userData: JwtPayload | null,
  isSignout: boolean,
  userType?: ENTRY_TYPE
) => {
  if (userData !== null) {
    switch (userType) {
      case ENTRY_TYPE.OPERATION:
        return (
          <>
            <Stack.Screen
              name={OPERATION}
              key={OPERATION}
              component={Operation}
              options={{
                headerTitleAlign: 'center',
                headerTitle: OPERATION_TITLE,
                headerRight: () => OperationHeaderRight(),
              }}
            />
            {OperationStack(Stack)}
          </>
        );
      case ENTRY_TYPE.SECURITY:
        return (
          <>
            <Stack.Screen
              name={TAB_ROOT}
              key={TAB_ROOT}
              component={SecurityTabsV2}
              options={{
                headerTitle: SECURITY_TAB_TITLE,
                headerRight: () => OperationHeaderRight(),
              }}
            />
            {OperationStack(Stack)}
          </>
        );
      case ENTRY_TYPE.SALES:
        return (
          <>
            <Stack.Screen
              name={TAB_ROOT}
              key={TAB_ROOT}
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
            headerTitleAlign: 'center',
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
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: fonts.family.montserrat[600],
              fontSize: fonts.size.lg,
              color: colors.text.inactive,
            },
          }}
        />
      </>
    );
  }
};

function AppNavigatorV2() {
  const {
    isLoading,
    userData,
    isSignout,
    entryType,
    hunterScreen,
    enable_hunter_farmer,
  } = useAsyncConfigSetup();

  customLog('state hunterfarmer: ', hunterScreen, enable_hunter_farmer);
  if (isLoading) {
    return <Splash />;
  } else {
    return (
      <>
        <HunterAndFarmers />
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: 'left',
            headerShadowVisible: false,
            headerShown: true,
            headerTitleStyle: {
              color: colors.text.darker,
              fontSize: fonts.size.lg,
              fontWeight: fonts.family.montserrat[600],
            },
          }}
        >
          {RootScreen(userData, isSignout, entryType)}
        </Stack.Navigator>
      </>
    );
  }
}

export default AppNavigatorV2;
