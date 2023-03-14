import * as React from 'react';
import { colors, fonts, layout } from '@/constants';
import { Styles } from '@/interfaces';
import { NativeModules, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { signout } from '@/redux/reducers/authReducer';
import { AppDispatch } from '@/redux/store';
import bStorage from '@/actions/BStorage';
import { signOut } from '@/actions/CommonActions';
import crashlytics from '@react-native-firebase/crashlytics';
import Icon from 'react-native-vector-icons/Feather';
import analytics from '@react-native-firebase/analytics';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

const { RNCustomConfig } = NativeModules;
const versionName = RNCustomConfig?.version_name;

const _styles: Styles = {
  chipText: {
    fontFamily: fonts.family.montserrat[500],
    fontSize: fonts.size.md,
    color: colors.text.darker,
    textAlign: 'center',
  },
  version: {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.xs,
    color: colors.text.darker,
    textAlign: 'center',
  },
};

export default function SalesHeaderRight(iconColor: string = '') {
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = React.useState(false);

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  const onLogout = async () => {
    try {
      const response = await signOut();
      if (response) {
        bStorage.clearItem();
        dispatch(signout(false));
        crashlytics().setUserId('');
        analytics().setUserId('');
      }
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    }
  };

  return (
    <Menu
      visible={visible}
      anchor={
        <Icon
          name="more-vertical"
          size={18}
          color={iconColor !== '' ? iconColor : colors.white}
          style={{ padding: layout.pad.lg }}
          onPress={showMenu}
        />
      }
      onRequestClose={hideMenu}
    >
      <MenuItem textStyle={_styles.chipText} onPress={onLogout}>
        Logout
      </MenuItem>
      <MenuDivider />
      <MenuItem textStyle={_styles.version} disabled>
        {'APP Version ' + versionName}
      </MenuItem>
    </Menu>
  );
}
