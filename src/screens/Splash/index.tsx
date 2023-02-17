import { colors } from '@/constants';
import { resScale } from '@/utils';
import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { SPLASH } from '@/navigation/ScreenNames';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchedConfig } from '@/redux/reducers/remoteConfigReducer';
import remoteConfig from '@react-native-firebase/remote-config';
import { RootState } from '@/redux/store';
import { customLog } from '@/utils/generalFunc';

const Splash = () => {
  const dispatch = useDispatch();
  const initialState: any = useSelector(
    (state: RootState) => state.remoteConfig
  );

  React.useEffect(() => {
    crashlytics().log(SPLASH);

    // default value is 12 hours.
    // current set is 300 for 5 minutes
    remoteConfig().fetch(300);
    remoteConfig()
      .setDefaults(initialState)
      .then(() => remoteConfig().fetchAndActivate())
      .then(() => {
        let fetchedData = {} as Object;
        Object.entries(remoteConfig().getAll()).forEach(($) => {
          const [key, entry] = $;
          fetchedData = {
            ...fetchedData,
            [key]: JSON.parse(Object.values(entry)[0]),
          };
        });
        customLog('config from remote: ', fetchedData);
        dispatch(setFetchedConfig(fetchedData));
      });
  }, [initialState, dispatch]);

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
