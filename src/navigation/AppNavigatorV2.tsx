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
  TAB_ROOT,
  SECURITY_TAB_TITLE,
  VERIFICATION,
  VERIFICATION_TITLE,
} from './ScreenNames';
import OperationHeaderRight from './Operation/HeaderRight';
import OperationStack from './Operation/Stack';
import SalesStack from './Sales/Stack';
import { useDispatch } from 'react-redux';
import { toggleHunterScreen } from '@/redux/reducers/authReducer';
import BackgroundTimer from 'react-native-background-timer';
import { AppDispatch } from '@/redux/store';
import moment from 'moment';
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
                headerTitleAlign: 'center',
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
      default:
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
  const { isLoading, userData, isSignout } = useBootStrapAsync();
  const userType = USER_TYPE.SALES;
  const dispatch = useDispatch<AppDispatch>();
  let timeoutId = React.useRef();
  let now = moment();
  let nextdays = moment().add(1, 'days').format('L');
  let duration = Math.abs(now.diff(nextdays, 'millisecond'));

  React.useEffect(() => {
    timeoutId.current = BackgroundTimer.runBackgroundTimer(() => {
      dispatch(toggleHunterScreen(true));
    }, duration);
    return () => {
      BackgroundTimer.clearTimeout(timeoutId.current);
    };
  }, [dispatch, duration]);

  if (isLoading) {
    return <Splash />;
  } else {
    return (
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
        {RootScreen(userData, isSignout, userType)}
      </Stack.Navigator>
    );
  }
}

export default AppNavigatorV2;
