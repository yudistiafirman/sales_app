import bStorage from '@/actions/BStorage';
import storageKey from '@/constants/storageKey';
import { setIsLoading, setUserData } from '@/redux/reducers/authReducer';
import { AppDispatch, RootState } from '@/redux/store';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import React from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const useBootStrapAsync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, userData } = useSelector((state: RootState) => state.auth);

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
      }
      dispatch(setIsLoading(false));
    } catch (error) {
      Alert.alert('ooops , something went wrong');
      dispatch(setIsLoading(false));
    }
  };

  return [isLoading, userData];
};

export default useBootStrapAsync;
