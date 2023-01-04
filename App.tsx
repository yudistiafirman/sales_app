// In App.js in a new project

import * as React from 'react';
import { StatusBar } from 'react-native';
import {
  DefaultTheme as NavigationTheme,
  NavigationContainer,
} from '@react-navigation/native';
import AppNavigator from '@/navigation/AppNavigator';
import {
  configureFonts,
  MD3LightTheme as PaperTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import colors from '@/constants/colors';
import font from '@/constants/fonts';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={navTheme}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'transparent'}
          translucent={true}
        />
        <PaperProvider theme={paperTheme}>
          <AppNavigator />
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
