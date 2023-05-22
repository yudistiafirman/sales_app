import { StyleSheet } from "react-native";
import { colors, fonts, layout } from "@/constants";
import font from "@/constants/fonts";
import { resScale } from "@/utils";

const loginStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: layout.pad.lg
    },
    textInfo: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.md,
        color: colors.text.dark,
        textAlign: "center"
    },
    whatsapp: {
        fontFamily: font.family.montserrat[300],
        fontSize: font.size.md,
        color: colors.primary,
        textAlign: "left"
    },
    inputLabel: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.sm,
        color: colors.text.dark,
        alignSelf: "flex-start"
    },
    phoneNumberInputContainer: {
        flexDirection: "row",
        alignItems: "flex-end"
    },
    countryCodeContainer: {
        flex: 0.16,
        borderWidth: 1,
        height: resScale(38),
        width: resScale(45),
        borderColor: colors.textInput.inActive,
        borderBottomLeftRadius: layout.pad.sm,
        borderTopLeftRadius: layout.pad.sm,
        alignItems: "center",
        justifyContent: "center"
    },
    counterCodeText: {
        fontFamily: font.family.montserrat[500],
        fontSize: fonts.size.md,
        color: colors.text.dark,
        marginBottom: layout.pad.sm
    },
    maskInputStyle: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.md,
        backgroundColor: colors.white,
        color: colors.textInput.input
    },
    maskInputContainer: {
        borderTopRightRadius: layout.pad.sm,
        borderBottomEndRadius: layout.pad.sm,
        height: resScale(38),
        borderWidth: 1,
        borderLeftWidth: 0,
        justifyContent: "center",
        borderColor: colors.textInput.inActive,
        overflow: "hidden",
        flex: 0.85
    },
    buttonStyle: {
        width: resScale(328)
    }
});
export default loginStyle;
