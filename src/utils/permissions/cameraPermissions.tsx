import { Alert, Linking, PermissionsAndroid } from 'react-native';
import { displayName } from '../../../app.json';

const openSetting = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Unable to open settings');
  });
};

const showAlertCamera = () => {
  Alert.alert(`Turn on Camera to allow ${displayName} to take a picture.`, '', [
    { text: 'Go to Settings', onPress: openSetting },
  ]);
};

export const hasCameraPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        showAlertCamera();
      } else {
        showAlertCamera();
      }
    }
  } catch (err) {
    console.warn(err);
    return;
  }
};

export default hasCameraPermissions;
