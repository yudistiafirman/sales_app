import * as React from 'react';
import {
  Dimensions,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import {
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
import { store } from '@/redux/store';
import Popup from '@/components/templates/PopupGlobal/Popup';
import AppNavigatorV2 from '@/navigation/AppNavigatorV2';
import { View } from 'react-native';
import NetworkLogger, {
  startNetworkLogging,
} from 'react-native-network-logger';
import { layout } from '@/constants';
import Icon from 'react-native-vector-icons/Feather';
import { StyleSheet } from 'react-native';
import Draggable from 'react-native-draggable';

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
    __DEV__ ? true : false
  );
  let lastPress = 0;

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
      <NavigationContainer theme={navTheme}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'transparent'}
          translucent={true}
        />
        <PaperProvider theme={paperTheme}>
          <ReduxProvider store={store}>
            <Popup />
            <AppNavigatorV2 />
            {__DEV__ && networkLogger()}
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

export default App;
