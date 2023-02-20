import bStorage from '@/actions/BStorage';
import storageKey from '@/constants/storageKey';
import {
  setEntryType,
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
import { setFetchedConfig } from '@/redux/reducers/remoteConfigReducer';
import { ENTRY_TYPE } from '@/models/EnumModel';
import BackgroundTimer from 'react-native-background-timer';

const useAsyncConfigSetup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, userData, isSignout, entryType, hunterScreen } =
    useSelector((state: RootState) => state.auth);
  const initialState = useSelector((state: RootState) => state.remoteConfig);
  const { enable_hunter_farmer } = useSelector(
    (state: RootState) => state.remoteConfig
  );
  let timeoutId = React.useRef();
  let nextdays = moment().add(1, 'days').format('L');
  let duration = Math.abs(moment().diff(nextdays, 'millisecond'));

  const userDataSetup = React.useCallback(async () => {
    try {
      dispatch(setIsLoading(true));
      const userToken = await bStorage.getItem(storageKey.userToken);
      if (userToken) {
        const decoded = jwtDecode<JwtPayload>(userToken);
        dispatch(setUserData(decoded));
      }
      dispatch(setIsLoading(false));
    } catch (error) {
      Alert.alert('ooops , something went wrong');
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  const remoteConfigSetup = React.useCallback(async () => {
    remoteConfig().fetch(300);
    remoteConfig()
      .setDefaults(initialState as any)
      .then(() => remoteConfig().fetchAndActivate())
      .then(() => {
        let fetchedData = {} as Object;
        Object.entries(remoteConfig().getAll()).forEach(($) => {
          const [key, entry] = $;
          let value = initialState?.[key];
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
        customLog('====remote config====', fetchedData);
        dispatch(setFetchedConfig(fetchedData));
      });
  }, [dispatch, initialState]);

  const hunterFarmerSetup = React.useCallback(async () => {
    timeoutId.current = BackgroundTimer.runBackgroundTimer(
      () => {
        dispatch(toggleHunterScreen(true));
      },

      // in milisecond
      isDevelopment ? 3600000 : duration
    );
    return () => {
      BackgroundTimer.clearTimeout(timeoutId.current);
    };
  }, [dispatch, duration]);

  React.useEffect(() => {
    userDataSetup();
    remoteConfigSetup();
    hunterFarmerSetup();
    dispatch(setEntryType(ENTRY_TYPE.SALES));
  }, []);

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
