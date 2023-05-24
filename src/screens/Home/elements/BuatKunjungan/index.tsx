import { BottomSheetFooter } from "@gorhom/bottom-sheet";
import React from "react";
import { StyleSheet } from "react-native";
import BButtonPrimary from "@/components/atoms/BButtonPrimary";
import { layout } from "@/constants";
import colors from "@/constants/colors";
import font from "@/constants/fonts";
import respFS from "@/utils/resFontSize";

const style = StyleSheet.create({
    container: {},
    footerContainer: {
        padding: layout.pad.md,
        margin: layout.pad.md,
        borderRadius: layout.radius.md,
        backgroundColor: colors.primary
    },
    footerText: {
        textAlign: "center",
        color: colors.white,
        fontFamily: font.family.montserrat[600],
        fontSize: respFS(16)
    }
});

export default function BuatKunjungan(props: any, kunjunganAction: () => void) {
    return (
        <BottomSheetFooter {...props} style={style.container} bottomInset={10}>
            <BButtonPrimary onPress={kunjunganAction} title="Buat Kunjungan" />
        </BottomSheetFooter>
    );
}
