import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { displayName } from '../../../app.json';

const checkWritePermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permissions for write access',
        message: 'Give permission to your storage to write a file',
        buttonPositive: 'ok',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return;
  }
};

const openSetting = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Unable to open settings');
  });
};

const showAlertStorage = () => {
  Alert.alert(
    `Turn on Storage Permission to allow ${displayName} to pick file and picture.`,
    '',
    [{ text: 'Go to Settings', onPress: openSetting }]
  );
};

const checkReadPermissions = async () => {
  try {
    if (Platform.OS === 'ios') {
      return true;
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          showAlertStorage();
        } else {
          showAlertStorage();
        }
      }
    }
  } catch (err) {
    const errorMessage =
      err.message || 'Terjadi error dalam request external storage permission';
    Alert.alert(errorMessage);
    return;
  }
};

export default { checkReadPermissions, checkWritePermissions };
