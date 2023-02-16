import { colors } from '@/constants';
import { resScale } from '@/utils';
import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { SPLASH } from '@/navigation/ScreenNames';

const Splash = () => {
  React.useEffect(() => {
    crashlytics().log(SPLASH);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/logo/brik_logo.png')}
        style={styles.logo}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  logo: { width: resScale(184), height: resScale(87) },
});
export default Splash;
