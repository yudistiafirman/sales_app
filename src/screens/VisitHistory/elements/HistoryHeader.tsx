import React from "react";
import { StyleSheet, View } from "react-native";
import { BText } from "@/components";
import { colors } from "@/constants";
import font from "@/constants/fonts";

const styles = StyleSheet.create({
    header: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.md,
        color: colors.text.darker
    },
    projectName: {
        fontFamily: font.family.montserrat[600],
        fontSize: font.size.md,
        color: colors.text.darker,
        textAlign: "center"
    }
});

function HistoryHeader({ projectName }: { projectName: string | undefined }) {
    return (
        <View>
            <BText style={styles.header}>Riwayat Kunjungan</BText>
            <BText style={styles.projectName}>{projectName}</BText>
        </View>
    );
}

export default HistoryHeader;
