import React from "react";
import { Text, StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "@/constants";
import { closeSnackbar } from "@/redux/reducers/snackbarReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'space-between',
    },
    default: {
        backgroundColor: colors.white
    },
    error: {
        backgroundColor: "#F6D7DC"
    },
    success: {
        backgroundColor: "#D7F6D8"
    },
    errorText: {
        color: "#F43353"
    },
    successText: {
        color: "#4C574C"
    }
});

export default function SnackbarGlobal() {
    //   const [visible, setVisible] = useState(true);
    const dispatch = useDispatch();
    const { isSnackbarVisible, snackBarOptions } = useSelector(
        (state: RootState) => state.snackbar
    );
    const { isSuccess, snackBarText } = snackBarOptions;

    //   const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => {
        dispatch(closeSnackbar());
    };
    // #D7F6D8 green
    return (
        // <View style={styles.container}>
        <Snackbar
            visible={isSnackbarVisible}
            onDismiss={onDismissSnackBar}
            duration={3000}
            style={[
                snackBarText
                    ? !isSuccess
                        ? styles.error
                        : styles.success
                    : styles.default
            ]}
            wrapperStyle={{ top: resScale(50), zIndex: 10 }}
            //   action={{
            //     label: 'Undo',
            //     textColor: 'red',
            //     onPress: () => {
            //       // Do something
            //     },
            //   }}
        >
            <Text style={[!isSuccess ? styles.errorText : styles.successText]}>
                {snackBarText}
            </Text>
        </Snackbar>
        // </View>
    );
}
