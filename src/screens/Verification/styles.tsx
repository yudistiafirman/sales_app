import { StyleSheet } from "react-native";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { resScale } from "@/utils";

const VerificationStyles = StyleSheet.create({
    container: { flex: 1, marginHorizontal: layout.pad.lg },
    otpMessageImage: {
        width: resScale(180),
        height: resScale(125.5),
        alignSelf: "center"
    },
    intructionsTextDark: {
        fontFamily: font.family.montserrat[300],
        color: colors.text.dark,
        fontSize: font.size.md,
        textAlign: "center"
    },
    intructionsTextRed: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md,
        color: colors.primary
    },
    intrutructionsTextDarkBold: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md,
        color: colors.text.dark
    },
    otpLabel: {
        fontFamily: font.family.montserrat[500],
        color: colors.text.dark,
        fontSize: font.size.sm
    },
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    countDownText: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.md,
        color: colors.text.divider
    }
});
export default VerificationStyles;
