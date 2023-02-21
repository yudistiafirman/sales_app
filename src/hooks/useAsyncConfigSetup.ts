import bStorage from '@/actions/BStorage';
import storageKey from '@/constants/storageKey';
import {
  setIsLoading,
  setUserData,
  toggleHunterScreen,
} from '@/redux/reducers/authReducer';
import { AppDispatch, RootState } from '@/redux/store';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import * as React from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { customLog, isDevelopment, isJsonString } from '@/utils/generalFunc';
import remoteConfig from '@react-native-firebase/remote-config';
import { ENTRY_TYPE } from '@/models/EnumModel';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-community/async-storage';
import { HUNTER_AND_FARMER } from '@/navigation/ScreenNames';

const useAsyncConfigSetup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isLoading,
    userData,
    isSignout,
    entryType,
    hunterScreen,
    remote_config,
  } = useSelector((state: RootState) => state.auth);
  const { enable_hunter_farmer } = useSelector(
    (state: RootState) => state.auth.remote_config
  );
  let timeoutId = React.useRef();
  let nextdays = moment().add(1, 'days').format('L');
  let duration = Math.abs(moment().diff(nextdays, 'millisecond'));

  const userDataSetup = React.useCallback(
    async (fetchedRemoteConfig: any) => {
      customLog('====remote config====', fetchedRemoteConfig);
      try {
        const userToken = await bStorage.getItem(storageKey.userToken);
        if (userToken) {
          const decoded = jwtDecode<JwtPayload>(userToken);
          dispatch(
            setUserData({
              userData: decoded,
              entryType: ENTRY_TYPE.SALES,
              remoteConfig: fetchedRemoteConfig,
            })
          );
        } else {
          dispatch(
            setIsLoading({
              loading: false,
              entryType: ENTRY_TYPE.SALES,
              remoteConfig: fetchedRemoteConfig,
            })
          );
        }
      } catch (error) {
        Alert.alert('ooops , something went wrong');
        dispatch(
          setIsLoading({
            loading: false,
            entryType: ENTRY_TYPE.SALES,
            remoteConfig: fetchedRemoteConfig,
          })
        );
      }
    },
    [dispatch]
  );

  const hunterFarmerSetup = React.useCallback(async () => {
    timeoutId.current = BackgroundTimer.runBackgroundTimer(
      () => {
        // to save state when app killed
        AsyncStorage.setItem(HUNTER_AND_FARMER, 'true');

        dispatch(toggleHunterScreen(true));
      },

      // in milisecond
      isDevelopment ? 3600000 : duration
    );
    return () => {
      BackgroundTimer.clearTimeout(timeoutId.current);
    };
  }, [dispatch, duration]);

  const appStateSetup = React.useCallback(async () => {
    remoteConfig().fetch(300);
    remoteConfig()
      .setDefaults(remote_config as any)
      .then(() => remoteConfig().fetchAndActivate())
      .then(() => {
        let fetchedData = {} as Object;
        Object.entries(remoteConfig().getAll()).forEach(($) => {
          const [key, entry] = $;
          let value = remote_config?.[key];
          if (
            Object.values(entry).length > 0 &&
            isJsonString(Object.values(entry)[0])
          )
            value = JSON.parse(Object.values(entry)[0]);
          fetchedData = {
            ...fetchedData,
            [key]: value,
          };
        });
        hunterFarmerSetup();
        userDataSetup(fetchedData);
      })
      .catch((err) => {
        customLog(err);
        hunterFarmerSetup();
        userDataSetup(undefined);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userDataSetup]);

  React.useEffect(() => {
    appStateSetup();
  }, [appStateSetup]);

  return {
    isLoading,
    userData,
    isSignout,
    entryType,
    hunterScreen,
    enable_hunter_farmer,
  };
};

export default useAsyncConfigSetup;
