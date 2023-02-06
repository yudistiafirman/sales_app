import bStorage from '@/actions/BStorage';
import { signOut } from '@/actions/CommonActions';
import { BTouchableText } from '@/components';
import storageKey from '@/constants/storageKey';
import useCustomHeaderRight from '@/hooks/useCustomHeaderRight';
import { signout } from '@/redux/reducers/authReducer';
import { AppDispatch } from '@/redux/store';
import * as React from 'react';
import { Alert, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const onLogout = async () => {
    try {
      const response = await signOut();
      if (response) {
        bStorage.deleteItem(storageKey.userToken);
        dispatch(signout);
      }
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    }
  };

  useCustomHeaderRight({
    customHeaderRight: <BTouchableText onPress={onLogout} title="Logout" />,
  });

  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

export default Profile;
