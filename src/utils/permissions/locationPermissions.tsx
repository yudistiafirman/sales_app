import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { displayName } from "../../../app.json";
import { store } from "@/redux/store";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";

const hasPermissionIOS = async () => {
  const status = await Geolocation.requestAuthorization("whenInUse");

  if (status === "granted") {
    return true;
  }

  if (status === "denied") {
    showAlertLocation();
  }

  if (status === "disabled") {
    showAlertLocation();
  }
};

const openSetting = () => {
  Linking.openSettings().catch(() => {
    store.dispatch(
      openPopUp({
        popUpType: "error",
        popUpText: "Terjadi error saat membuka Setting",
        outsideClickClosePopUp: true,
      })
    );
  });
};

const showAlertLocation = () => {
  store.dispatch(
    openPopUp({
      popUpType: "none",
      popUpText: `Aktifkan Layanan Lokasi untuk mengizinkan ${displayName} menentukan lokasi Anda.`,
      isRenderActions: true,
      outsideClickClosePopUp: false,
      unRenderBackButton: true,
      primaryBtnTitle: "Buka Setting",
      primaryBtnAction: () => {
        setTimeout(() => {
          store.dispatch(closePopUp());
        }, 100);
        openSetting();
      },
    })
  );
};

const hasLocationPermission = async () => {
  try {
    if (Platform.OS === "ios") {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }
    if (Platform.OS === "android" && Platform.Version < 23) {
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
      showAlertLocation();
    } else {
      showAlertLocation();
    }
  } catch (err) {
    const errorMessage =
      err.message ||
      "Terjadi error dalam meminta izin mengakses layanan lokasi";
    store.dispatch(
      openPopUp({
        popUpType: "error",
        popUpText: errorMessage,
        outsideClickClosePopUp: true,
      })
    );
  }
};

export default hasLocationPermission;
