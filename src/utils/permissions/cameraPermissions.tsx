import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { Camera } from 'react-native-vision-camera';
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
    if (Platform.OS === 'ios') {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission === 'not-determined') {
        const newCameraPermission = await Camera.requestCameraPermission();
        if (newCameraPermission === 'authorized') {
          return true;
        } else {
          showAlertCamera();
        }
      } else {
        if (cameraPermission === 'authorized') {
          return true;
        } else {
          showAlertCamera();
        }
      }
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          showAlertCamera();
        } else {
          showAlertCamera();
        }
      }
    }
  } catch (err) {
    const errorMessage =
      err.message || 'Terjadi error dalam request camera permission';
    Alert.alert(errorMessage);
    return;
  }
};

export default hasCameraPermissions;
