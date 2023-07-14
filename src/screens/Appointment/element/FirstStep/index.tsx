import crashlytics from "@react-native-firebase/crashlytics";
import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import { BSearchBar, BSpacer } from "@/components";
import { layout } from "@/constants";
import { APPOINTMENT } from "@/navigation/ScreenNames";
import { resScale } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { enableSearching } from "@/redux/reducers/appointmentReducer";
import Inputs from "./Input";
import SearchingCustomer from "./SearchingCustomer";

const styles = StyleSheet.create({
    flexFull: {
        flex: 1
    },
    touchable: {
        position: "absolute",
        width: "100%",
        borderRadius: layout.radius.sm,
        height: resScale(45),
        zIndex: 2
    }
});

function FirstStep() {
    const appoinmentState = useSelector((state: RootState) => state.appoinment);
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        crashlytics().log(`${APPOINTMENT}-Step1`);
    }, []);

    return (
        <SafeAreaView style={styles.flexFull}>
            {appoinmentState?.isSearching ? (
                <SearchingCustomer />
            ) : (
                <>
                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() =>
                            dispatch(enableSearching({ value: true }))
                        }
                    />
                    <BSearchBar
                        placeholder="Cari Proyek"
                        activeOutlineColor="gray"
                        disabled
                        left={
                            <TextInput.Icon
                                forceTextInputFocus={false}
                                icon="magnify"
                            />
                        }
                    />
                    <View style={{ flex: 1 }}>
                        <BSpacer size="extraSmall" />
                        <KeyboardAwareScrollView>
                            <Inputs />
                        </KeyboardAwareScrollView>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

export default FirstStep;
