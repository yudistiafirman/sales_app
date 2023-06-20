import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import bStorage from "@/actions";
import { signOut } from "@/actions/CommonActions";
import EmptyState from "@/components/organism/BEmptyState";
import { signout } from "@/redux/reducers/authReducer";
import { AppDispatch, RootState } from "@/redux/store";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});

function BlankScreen() {
    const { userData } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const onLogout = async () => {
        await signOut().catch((err) => undefined);
        bStorage.clearItem();
        dispatch(signout(false));
        crashlytics().setUserId("");
        analytics().setUserId("");
    };
    return (
        <SafeAreaView style={styles.container}>
            <EmptyState
                isError
                errorMessage={`Tipe user ${
                    userData?.type || userData?.roles?.join(", ")
                } tidak memiliki akses ke BOD APP`}
                actionBtnTitle="Kembali"
                onAction={onLogout}
            />
        </SafeAreaView>
    );
}

export default BlankScreen;
