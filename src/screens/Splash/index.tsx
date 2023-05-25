import crashlytics from "@react-native-firebase/crashlytics";
import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { colors } from "@/constants";
import { SPLASH } from "@/navigation/ScreenNames";
import { AppDispatch } from "@/redux/store";
import { resScale } from "@/utils";
import BrikLogo from "@/assets/logo/brik_logo.png";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white
    },
    logo: { width: resScale(184), height: resScale(87) }
});

function Splash() {
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        crashlytics().log(SPLASH);
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <Image source={BrikLogo} style={styles.logo} />
        </View>
    );
}
export default Splash;
