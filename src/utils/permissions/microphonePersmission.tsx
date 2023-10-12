import { Linking, PermissionsAndroid, Platform } from "react-native";
import { Camera } from "react-native-vision-camera";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { store } from "@/redux/store";
import { displayName } from "../../../app.json";

const openSetting = () => {
    Linking.openSettings().catch(() => {
        store.dispatch(
            openPopUp({
                popUpType: "error",
                popUpText: "Terjadi error saat membuka Setting",
                outsideClickClosePopUp: true
            })
        );
    });
};

const showAlertMicrophone = () => {
    store.dispatch(
        openPopUp({
            popUpType: "none",
            popUpText: `Aktifkan Izin Microphone untuk mengizinkan ${displayName} merekam suara.`,
            isRenderActions: true,
            outsideClickClosePopUp: false,
            unRenderBackButton: true,
            primaryBtnTitle: "Buka Setting",
            primaryBtnAction: () => {
                setTimeout(() => {
                    store.dispatch(closePopUp());
                }, 100);
                openSetting();
            }
        })
    );
};

export const hasMicrophonePermissions = async () => {
    try {
        if (Platform.OS === "ios") {
            const microphonePermission =
                await Camera.getMicrophonePermissionStatus();
            if (microphonePermission === "not-determined") {
                const newMicrophonePermission =
                    await Camera.requestCameraPermission();
                if (newMicrophonePermission === "authorized") {
                    return true;
                }
                showAlertMicrophone();
            } else {
                if (microphonePermission === "authorized") {
                    return true;
                }
                showAlertMicrophone();
            }
            return false;
        }
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }
        if (status === PermissionsAndroid.RESULTS.DENIED) {
            showAlertMicrophone();
        } else {
            showAlertMicrophone();
        }
        return false;
    } catch (err) {
        const errorMessage =
            err?.message ||
            "Terjadi error dalam meminta izin untuk mengakses microphone";
        store.dispatch(
            openPopUp({
                popUpType: "error",
                popUpText: errorMessage,
                outsideClickClosePopUp: true
            })
        );
        return false;
    }
};

export default hasMicrophonePermissions;
