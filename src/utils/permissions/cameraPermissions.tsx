import { PermissionsAndroid } from 'react-native';

export const checkCameraPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Permissions camera',
        message: 'Give permission to your camera',
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

export default { checkCameraPermissions };
