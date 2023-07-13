import { colors, fonts, layout } from "@/constants";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.status.errorPic,
        borderRadius: layout.radius.sm
    },
    errorText: {
        color: colors.primary,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.sm,
        padding: layout.pad.sm
    }
});

function BAlertText({ text }: { text: string }) {
    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>{text}</Text>
        </View>
    );
}

export default BAlertText;
