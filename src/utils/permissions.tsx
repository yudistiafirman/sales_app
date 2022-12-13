import {PermissionsAndroid} from 'react-native';

export const checkWritePermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permissions for write access',
        message: 'Give permission to your storage to write a file',
        buttonPositive: 'ok',
      },
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

export const checkReadPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Permissions for read access',
        message: 'Give permission to your storage to read a file',
        buttonPositive: 'ok',
      },
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
