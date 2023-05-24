import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import * as React from "react";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";
import bStorage from "@/actions/BStorage";
import { signOut } from "@/actions/CommonActions";
import { TAB_PROFILE } from "@/navigation/ScreenNames";
import { signout } from "@/redux/reducers/authReducer";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { AppDispatch } from "@/redux/store";

function Profile() {
    const dispatch = useDispatch<AppDispatch>();

    const onLogout = async () => {
        try {
            const response = await signOut();
            if (response) {
                bStorage.clearItem();
                dispatch(signout(false));
                crashlytics().setUserId("");
                analytics().setUserId("");
            }
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText: error?.message || "Terjadi error saat logout",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    React.useEffect(() => {
        crashlytics().log(TAB_PROFILE);
    }, []);

    return (
        <View>
            <Text>Profile</Text>
        </View>
    );
}

export default Profile;
