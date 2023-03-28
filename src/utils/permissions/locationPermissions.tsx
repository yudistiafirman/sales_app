import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { displayName } from '../../../app.json';
const hasPermissionIOS = async () => {
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    showAlertLocation();
  }

  if (status === 'disabled') {
    showAlertLocation();
  }
};

const openSetting = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Unable to open settings');
  });
};

const showAlertLocation = () => {
  Alert.alert(
    `Turn on Location Services to allow ${displayName} to determine your location.`,
    '',
    [{ text: 'Go to Settings', onPress: openSetting }]
  );
};

const hasLocationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    } else {
      if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
      }

      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          showAlertLocation();
        } else {
          showAlertLocation();
        }
      }
    }
  } catch (err) {
    const errorMessage =
      err.message || 'Terjadi error dalam request location permission';
    Alert.alert(errorMessage);
    return;
  }
};

export default hasLocationPermission;
