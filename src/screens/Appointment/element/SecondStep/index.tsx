import crashlytics from "@react-native-firebase/crashlytics";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
    DeviceEventEmitter,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { TextInput } from "react-native-paper";
import { BSearchBar } from "@/components";
import { colors, layout } from "@/constants";
import { APPOINTMENT, CALENDAR } from "@/navigation/ScreenNames";
import { SelectedDateType } from "@/screens/Visitation/elements/fifth";
import { resScale } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setDate } from "@/redux/reducers/appointmentReducer";

const styles = StyleSheet.create({
    flexFull: {
        flex: 1
    },
    touchable: {
        position: "absolute",
        display: "flex",
        width: "100%",
        borderRadius: layout.pad.sm,
        height: resScale(45),
        zIndex: 2
    }
});

function SecondStep() {
    const appointmentState = useSelector(
        (state: RootState) => state.appoinment
    );
    const dispatch = useDispatch<AppDispatch>();
    const { selectedDate } = appointmentState;

    useEffect(() => {
        crashlytics().log(`${APPOINTMENT}-Step2`);
        DeviceEventEmitter.addListener(
            "CalendarScreen.selectedDate",
            (date: SelectedDateType) => {
                dispatch(setDate({ value: date }));
            }
        );
        return () => {
            DeviceEventEmitter.removeAllListeners(
                "CalendarScreen.selectedDate"
            );
        };
    }, [dispatch]);

    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.flexFull}>
            <>
                <TouchableOpacity
                    style={styles.touchable}
                    onPress={() =>
                        navigation.navigate(CALENDAR, {
                            useTodayMinDate: true
                        })
                    }
                />
                <BSearchBar
                    disabled
                    activeOutlineColor="gray"
                    value={
                        selectedDate
                            ? `${selectedDate?.day} , ${selectedDate?.prettyDate}`
                            : ""
                    }
                    textColor={colors.textInput.input}
                    placeholder="Pilih Tanggal"
                    right={
                        <TextInput.Icon
                            style={{ marginBottom: 24 }}
                            forceTextInputFocus={false}
                            icon="chevron-right"
                        />
                    }
                />
            </>
        </SafeAreaView>
    );
}

export default SecondStep;
