import bStorage from '@/Actions/BStorage';
import { signOut } from '@/Actions/CommonActions';
import { BTouchableText } from '@/components';
import storageKey from '@/constants/storageKey';
import { setUserData } from '@/redux/reducers/authReducer';
import { AppDispatch } from '@/redux/store';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';

const Transaksi = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const renderHeaderRight = () => {
    return <BTouchableText onPress={onLogout} title="logout" />;
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderHeaderRight(),
    });
  }, [navigation]);

  const onLogout = async () => {
    try {
      const response = await signOut();
      if (response) {
        bStorage.deleteItem(storageKey.userToken);
        dispatch(setUserData(null));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Text>Transaki</Text>
    </View>
  );
};

export default Transaksi;
