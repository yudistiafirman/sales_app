import crashlytics from "@react-native-firebase/crashlytics";
import * as React from "react";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { TAB_PROFILE } from "@/navigation/ScreenNames";
import { AppDispatch } from "@/redux/store";

function Profile() {
    const dispatch = useDispatch<AppDispatch>();

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
