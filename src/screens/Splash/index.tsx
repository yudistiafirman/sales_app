import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import { useDispatch } from "react-redux";
import { SPLASH } from "@/navigation/ScreenNames";
import { resScale } from "@/utils";
import { colors } from "@/constants";
import { AppDispatch } from "@/redux/store";

function Splash() {
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    crashlytics().log(SPLASH);
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/logo/brik_logo.png")}
        style={styles.logo}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  logo: { width: resScale(184), height: resScale(87) },
});
export default Splash;
