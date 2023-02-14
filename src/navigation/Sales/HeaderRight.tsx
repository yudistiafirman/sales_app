import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import { Styles } from '@/interfaces';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { signout } from '@/redux/reducers/authReducer';
import { AppDispatch } from '@/redux/store';
import storageKey from '@/constants/storageKey';
import bStorage from '@/actions/BStorage';
import { signOut } from '@/actions/CommonActions';
import crashlytics from '@react-native-firebase/crashlytics';
const _styles: Styles = {
  chipView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: layout.pad.lg,
  },
  chip: {
    paddingHorizontal: layout.pad.ml,
    paddingVertical: layout.pad.sm,
    backgroundColor: colors.white,
    borderRadius: layout.radius.sm,
  },
  chipText: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.sm,
    color: colors.text.darker,
  },
};

export default function SalesHeaderRight() {
  const dispatch = useDispatch<AppDispatch>();
  

  const onLogout = async () => {
    try {
      const response = await signOut();
      if (response) {
        bStorage.clearItem();
        dispatch(signout(false));
        crashlytics().setUserId('');
      }
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    }
  };
  return (
    <TouchableOpacity onPress={onLogout} style={_styles.chipView}>
      <View style={_styles.chip}>
        <Text style={_styles.chipText}>{'Logout'}</Text>
      </View>
    </TouchableOpacity>
  );
}
