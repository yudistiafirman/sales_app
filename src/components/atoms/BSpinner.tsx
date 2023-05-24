import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "@/constants/colors";

const styles = StyleSheet.create({
    spinnerContainer: {
        alignItems: "center",
        justifyContent: "center"
    }
});

interface BSpinnerProps {
    size?: "large" | "small";
    color?: string;
}

const BSpinnerDefaultProps = {
    size: "small",
    color: colors.primary
};

function BSpinner({
    size,
    color
}: BSpinnerProps & typeof BSpinnerDefaultProps) {
    return (
        <View style={styles.spinnerContainer}>
            <ActivityIndicator animating size={size} color={color} />
        </View>
    );
}

BSpinner.defaultProps = BSpinnerDefaultProps;

export default BSpinner;
