import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/screens/Splash';
import Operation from '@/screens/Operation';
import { ENTRY_TYPE } from '@/models/EnumModel';
import Login from '@/screens/Login';
import Verification from '@/screens/Verification';
import { colors, fonts } from '@/constants';
import {
  LOGIN,
  LOGIN_TITLE,
  OPSMANAGER,
  OPSMANAGER_TITLE,
  TAB_ROOT,
  VERIFICATION,
  VERIFICATION_TITLE,
  BATCHER,
  DRIVER,
  BATCHER_TITLE,
  DRIVER_TITLE,
  BLANK_SCREEN,
} from './ScreenNames';
import OperationStack from './Operation/Stack';
import SalesStack from './Sales/Stack';
import HunterAndFarmers from '@/screens/HunterAndFarmers';
import { useAsyncConfigSetup } from '@/hooks';
import SalesTabs from './tabs/SalesTabs';
import SecurityTabs from './tabs/SecurityTabs';
import SalesHeaderRight from './Sales/HeaderRight';
import { UserModel } from '@/models/User';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import BlankScreen from '@/screens/BlankScreen';
import { BHttpLogger } from '@/components';
import {
  setShowButtonNetwork,
  setVisibleNetworkLogger,
} from '@/redux/reducers/authReducer';
const Stack = createNativeStackNavigator();

const RootScreen = (
  userData: UserModel.DataSuccessLogin | null,
  isSignout: boolean
) => {
  if (userData !== null) {
    switch (userData.type) {
      case ENTRY_TYPE.OPSMANAGER:
        return (
          <>
            <Stack.Screen
              name={OPSMANAGER}
              key={OPSMANAGER}
              component={Operation}
              options={{
                headerTitleAlign: 'center',
                headerTitle: OPSMANAGER_TITLE,
                headerRight: () => SalesHeaderRight(colors.text.darker),
                headerShown: true,
              }}
            />
            {OperationStack(Stack)}
          </>
        );
      case ENTRY_TYPE.BATCHER:
        return (
          <>
            <Stack.Screen
              name={BATCHER}
              key={BATCHER}
              component={Operation}
              options={{
                headerTitleAlign: 'center',
                headerTitle: BATCHER_TITLE,
                headerRight: () => SalesHeaderRight(colors.text.darker),
                headerShown: true,
              }}
            />
            {OperationStack(Stack)}
          </>
        );
      case ENTRY_TYPE.DRIVER:
        return (
          <>
            <Stack.Screen
              name={DRIVER}
              key={DRIVER}
              component={Operation}
              options={{
                headerTitleAlign: 'center',
                headerTitle: DRIVER_TITLE,
                headerRight: () => SalesHeaderRight(colors.text.darker),
                headerShown: true,
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
              component={SecurityTabs}
              options={{
                headerShown: false,
              }}
            />
            {OperationStack(Stack)}
          </>
        );
      case ENTRY_TYPE.WB:
        return (
          <>
            <Stack.Screen
              name={TAB_ROOT}
              key={TAB_ROOT}
              component={SecurityTabs}
              options={{
                headerShown: false,
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
              component={SalesTabs}
              options={{
                headerShown: false,
              }}
            />
            {SalesStack(Stack)}
          </>
        );
      case ENTRY_TYPE.ADMIN:
        return (
          <>
            <Stack.Screen
              name={TAB_ROOT}
              key={TAB_ROOT}
              component={SalesTabs}
              options={{
                headerShown: false,
              }}
            />
            {SalesStack(Stack)}
          </>
        );
      default:
        return (
          <Stack.Screen
            name={BLANK_SCREEN}
            key={BLANK_SCREEN}
            component={BlankScreen}
            options={{
              headerTitle: '',
            }}
          />
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

function AppNavigator() {
  const {
    isLoading,
    userData,
    isSignout,
    isNetworkLoggerVisible,
    isShowButtonNetwork,
  } = useAsyncConfigSetup();
  const dispatch = useDispatch<AppDispatch>();
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
              fontFamily: fonts.family.montserrat[600],
            },
          }}
        >
          {RootScreen(userData, isSignout)}
        </Stack.Navigator>
        <BHttpLogger
          isShowButtonNetwork={isShowButtonNetwork}
          isNetworkLoggerVisible={isNetworkLoggerVisible}
          setShowButtonNetwork={() =>
            dispatch(setShowButtonNetwork(!isShowButtonNetwork))
          }
          setVisibleNetworkLogger={() =>
            dispatch(setVisibleNetworkLogger(!isNetworkLoggerVisible))
          }
        />
      </>
    );
  }
}

export default AppNavigator;
