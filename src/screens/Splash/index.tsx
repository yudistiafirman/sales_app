import { colors } from '@/constants';
import { resScale } from '@/utils';
import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { HUNTER_AND_FARMER, SPLASH } from '@/navigation/ScreenNames';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { toggleHunterScreen } from '@/redux/reducers/authReducer';
import { bStorage } from '@/actions';

const Splash = () => {
  const dispatch = useDispatch<AppDispatch>();

  const checkStoredState = async () => {
    const storedState = await bStorage.getItem(HUNTER_AND_FARMER);
    return storedState;
  };

  React.useEffect(() => {
    crashlytics().log(SPLASH);
    checkStoredState().then((item) => {
      if (item) dispatch(toggleHunterScreen(true));
    });
  }, [dispatch]);

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
