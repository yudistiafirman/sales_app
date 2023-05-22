import { Linking, PermissionsAndroid, Platform } from "react-native";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { store } from "@/redux/store";
import { displayName } from "../../../app.json";

const checkWritePermissions = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "Permissions for write access",
                message: "Give permission to your storage to write a file",
                buttonPositive: "ok"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }
        return false;
    } catch (err) {
        const errorMessage =
            err?.message ||
            "Terjadi error dalam meminta izin membuat file di external storage permission";
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

const showAlertStorage = () => {
    store.dispatch(
        openPopUp({
            popUpType: "none",
            popUpText: `Aktifkan Izin Penyimpanan untuk mengizinkan ${displayName} memilih file dan gambar.`,
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

const checkReadPermissions = async () => {
    try {
        if (Platform.OS === "ios") {
            return true;
        }
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }
        if (status === PermissionsAndroid.RESULTS.DENIED) {
            showAlertStorage();
        } else {
            showAlertStorage();
        }
        return false;
    } catch (err) {
        const errorMessage =
            err?.message ||
            "Terjadi error dalam request external storage permission";
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

export default { checkReadPermissions, checkWritePermissions };
