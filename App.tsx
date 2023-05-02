import * as React from 'react';
import { Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
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
import NetworkLogger, {
  startNetworkLogging,
} from 'react-native-network-logger';
import { layout } from '@/constants';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';
import { isDevelopment, isProduction } from '@/utils/generalFunc';
import analytics from '@react-native-firebase/analytics';
import SnackbarGlobal from '@/components/templates/SnackbarGlobal';
import codePush from "react-native-code-push";

startNetworkLogging();
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

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
  const [isNetworkLoggerVisible, setVisibleNetworkLogger] =
    React.useState(false);
  const [isShowButtonNetwork, setShowButtonNetwork] = React.useState(
    isDevelopment() || (isProduction() && __DEV__)
  );
  const routeNameRef = React.useRef<any>();
  const navigationRef = createNavigationContainerRef();

  const networkLogger = () => {
    return (
      <>
        {isShowButtonNetwork && (
          <>
            <Draggable
              maxX={width}
              minX={0}
              x={width - 50}
              y={100}
              minY={20}
              maxY={height}
            >
              <>
                <TouchableOpacity
                  style={styles.close}
                  onPress={() => setShowButtonNetwork(!isShowButtonNetwork)}
                >
                  <Icon name={'x'} size={10} color={colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setVisibleNetworkLogger(!isNetworkLoggerVisible)
                  }
                  style={styles.container}
                >
                  <Icon name={'cloud'} size={30} color={colors.primary} />
                </TouchableOpacity>
              </>
            </Draggable>
            <Modal
              backdropOpacity={0.5}
              backdropColor={colors.text.darker}
              hideModalContentWhileAnimating={true}
              coverScreen={true}
              isVisible={isNetworkLoggerVisible}
              style={{ margin: layout.pad.xl }}
            >
              <TouchableOpacity
                onPress={() => setVisibleNetworkLogger(!isNetworkLoggerVisible)}
                style={styles.button}
              >
                <Icon name={'x'} size={30} color={colors.white} />
              </TouchableOpacity>
              <NetworkLogger />
            </Modal>
          </>
        )}
      </>
    );
  };

  return (
    <GestureHandlerRootView style={parentFull}>
      <NavigationContainer
        theme={navTheme}
        ref={navigationRef}
        onReady={() => {
          if (
            navigationRef?.current &&
            navigationRef?.current?.getCurrentRoute()
          )
            routeNameRef.current =
              navigationRef?.current.getCurrentRoute().name;
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
        }}
      >
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'transparent'}
          translucent={true}
        />
        <PaperProvider theme={paperTheme}>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <Popup />
              <SnackbarGlobal />
              <AppNavigator />
              {(isDevelopment() || (isProduction() && __DEV__)) &&
                networkLogger()}
            </PersistGate>
          </ReduxProvider>
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  close: {
    borderRadius: layout.radius.xl,
    backgroundColor: colors.text.darker,
    borderWidth: 1,
    padding: layout.pad.xs,
    alignSelf: 'flex-end',
    zIndex: 1,
    marginBottom: -layout.pad.md,
  },
  container: {
    borderRadius: layout.radius.xl,
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
    padding: layout.pad.md,
  },
  button: {
    alignItems: 'flex-end',
  },
});

export default codePush(App);
