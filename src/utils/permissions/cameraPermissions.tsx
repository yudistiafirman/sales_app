import { Linking, PermissionsAndroid, Platform } from "react-native";
import { Camera } from "react-native-vision-camera";
import { displayName } from "../../../app.json";
import { store } from "@/redux/store";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";

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

const showAlertCamera = () => {
  store.dispatch(
    openPopUp({
      popUpType: "none",
      popUpText: `Aktifkan Izin Kamera untuk mengizinkan ${displayName} mengambil gambar.`,
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

export const hasCameraPermissions = async () => {
  try {
    if (Platform.OS === "ios") {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission === "not-determined") {
        const newCameraPermission = await Camera.requestCameraPermission();
        if (newCameraPermission === "authorized") {
          return true;
        }
        showAlertCamera();
      } else {
        if (cameraPermission === "authorized") {
          return true;
        }
        showAlertCamera();
      }
    } else {
      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      if (status === PermissionsAndroid.RESULTS.DENIED) {
        showAlertCamera();
      } else {
        showAlertCamera();
      }
    }
  } catch (err) {
    const errorMessage =
      err.message || "Terjadi error dalam meminta izin untuk mengakses camera";
    store.dispatch(
      openPopUp({
        popUpType: "error",
        popUpText: errorMessage,
        outsideClickClosePopUp: true,
      })
    );
  }
};

export default hasCameraPermissions;
