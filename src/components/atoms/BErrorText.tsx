import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { resScale } from "@/utils";
import BText from "./BText";

const styles = StyleSheet.create({
    container: { flexDirection: "row", alignSelf: "flex-start" },
    warningIcon: { marginRight: layout.pad.ml, alignSelf: "center" },
    warningText: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md,
        color: colors.primary
    }
});

function BErrorText({ text }: { text: string | unknown }) {
    return (
        <View style={styles.container}>
            <Icon
                style={styles.warningIcon}
                name="warning"
                color={colors.primary}
                size={resScale(14)}
            />
            <BText style={styles.warningText}>{text}</BText>
        </View>
    );
}
export default BErrorText;
