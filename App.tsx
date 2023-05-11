import * as React from 'react';
import { StatusBar } from 'react-native';
import {
  createNavigationContainerRef,
  DefaultTheme as NavigationTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {
  configureFonts,
  MD3LightTheme as PaperTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { store, persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Popup from '@/components/templates/PopupGlobal/Popup';
import AppNavigator from '@/navigation/AppNavigator';
import { startNetworkLogging } from 'react-native-network-logger';
import analytics from '@react-native-firebase/analytics';
import SnackbarGlobal from '@/components/templates/SnackbarGlobal';
import codePush from 'react-native-code-push';

startNetworkLogging();

const parentFull = {
  flex: 1,
};

const navTheme = {
  ...NavigationTheme,
  colors: {
    ...NavigationTheme.colors,
    background: colors.white,
  },
};

const paperTheme = {
  ...PaperTheme,
  roundness: 2,
  colors: {
    ...PaperTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: '#a1b2c3',
  },
  fonts: configureFonts({
    config: {
      fontFamily: font.family.montserrat[400],
    },
  }),
};

function App() {
  const routeNameRef = React.useRef<any>();
  const navigationRef = createNavigationContainerRef();

  return (
    <GestureHandlerRootView style={parentFull}>
      <NavigationContainer
        theme={navTheme}
        ref={navigationRef}
        onReady={() => {
          if (navigationRef?.current && navigationRef?.current?.getCurrentRoute())
            routeNameRef.current = navigationRef?.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName =
            navigationRef?.current && navigationRef?.current?.getCurrentRoute()
              ? navigationRef?.current?.getCurrentRoute().name
              : '';

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true} />
        <PaperProvider theme={paperTheme}>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Popup />
              <SnackbarGlobal />
              <AppNavigator />
            </PersistGate>
          </ReduxProvider>
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default codePush(App);
