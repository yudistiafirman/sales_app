import * as React from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import bStorage from '@/actions/BStorage';
import { signOut } from '@/actions/CommonActions';
import { BTouchableText } from '@/components';
import useCustomHeaderRight from '@/hooks/useCustomHeaderRight';
import { signout } from '@/redux/reducers/authReducer';
import { AppDispatch } from '@/redux/store';
import { TAB_PROFILE } from '@/navigation/ScreenNames';
import { openPopUp } from '@/redux/reducers/modalReducer';

function Profile() {
  const dispatch = useDispatch<AppDispatch>();

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
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText: error.message || 'Terjadi error saat logout',
          outsideClickClosePopUp: true,
        }),
      );
    }
  };

  useCustomHeaderRight({
    customHeaderRight: <BTouchableText onPress={onLogout} title="Logout" />,
  });

  React.useEffect(() => {
    crashlytics().log(TAB_PROFILE);
  }, []);

  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
}

export default Profile;
