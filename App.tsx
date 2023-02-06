import * as React from 'react';
import { StatusBar } from 'react-native';
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
          </ReduxProvider>
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
