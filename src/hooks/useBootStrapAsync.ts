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

const useBootStrapAsync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, userData, isSignout, hunterScreen } = useSelector(
    (state: RootState) => state.auth
  );

  React.useEffect(() => {
    bootStrapAsync();
  }, []);

  const bootStrapAsync = async () => {
    try {
      dispatch(setIsLoading(true));
      const userToken = await bStorage.getItem(storageKey.userToken);
      if (userToken) {
        const decoded = jwtDecode<JwtPayload>(userToken);
        dispatch(setUserData(decoded));
        const firstLogin = await bStorage.getItem('firstLogin');
        console.log('ini firstlogin',firstLogin)
        if (firstLogin === undefined) {
          dispatch(toggleHunterScreen(false));
        }else {
          dispatch(toggleHunterScreen(true))
        }
      }
      dispatch(setIsLoading(false));
    } catch (error) {
      Alert.alert('ooops , something went wrong');
      dispatch(setIsLoading(false));
    }
  };

  return { isLoading, userData, isSignout };
};

export default useBootStrapAsync;
