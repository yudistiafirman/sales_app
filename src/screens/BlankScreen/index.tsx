import { bStorage } from '@/actions';
import { signOut } from '@/actions/CommonActions';
import EmptyState from '@/components/organism/BEmptyState';
import { signout } from '@/redux/reducers/authReducer';
import { AppDispatch } from '@/redux/store';
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// // import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import { openPopUp } from '@/redux/reducers/modalReducer';

const BlankScreen = () => {
  const { userData } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const onLogout = async () => {
    try {
      const response = await signOut();
      if (response) {
        bStorage.clearItem();
        dispatch(signout(false));
        // // crashlytics().setUserId('');
        analytics().setUserId('');
      }
    } catch (error) {
      dispatch(
        openPopUp({
          popUpType: 'error',
          popUpText:
            error.message ||
            'Terjadi error saat akan kembali ke halaman Login dari Blank Screen',
          outsideClickClosePopUp: true,
        })
      );
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        isError
        errorMessage={`Tipe user ${userData.type} tidak memiliki akses ke BOD APP`}
        actionBtnTitle="Kembali"
        onAction={onLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BlankScreen;
