import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';


const hasPermissionIOS = async () => {
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    ShowAlertLocation()
  }

  if (status === 'disabled') {
    ShowAlertLocation()
  }

  ShowAlertLocation()
};

const openSetting = () => {
  Linking.openSettings().catch(() => {
    Alert.alert('Unable to open settings');
  });
};

const ShowAlertLocation = () => {
  Alert.alert(
    'Turn on Location Services to allow "" to determine your location.',
    '',
    [{ text: 'Go to Settings', onPress: openSetting }]
  );
};


const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

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
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ShowAlertLocation()
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ShowAlertLocation()
  }

  ShowAlertLocation()
};

export default hasLocationPermission;
