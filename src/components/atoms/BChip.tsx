import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { colors, fonts, layout } from "@/constants";
import BText from "./BText";

interface BChipProps {
    children: any;
    type?: "default" | "header";
    backgroundColor?: string | undefined;
    textColor?: string | undefined;
    endIcon?: React.ReactNode;
    startIcon?: React.ReactNode;
    titleWeight?: string;
    marginRight?: number;
}

function BChip({
    children,
    type,
    backgroundColor,
    textColor,
    endIcon,
    startIcon,
    titleWeight,
    marginRight
}: BChipProps) {
    const BChipHeaderStyle: ViewStyle = {
        paddingHorizontal: layout.pad.md,
        paddingVertical: layout.pad.xs,
        borderRadius: layout.radius.sm,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    };

    const BChipDefaultStyle: ViewStyle = {
        paddingVertical: layout.pad.xs,
        paddingHorizontal: layout.pad.md + layout.pad.xs,
        borderRadius: layout.radius.xl,
        marginRight: layout.pad.md,
        flexDirection: "row",
        alignItems: "center"
    };

    const Styles: ViewStyle =
        type === "header" ? BChipHeaderStyle : BChipDefaultStyle;

    const TextStyles: TextStyle = {
        color: textColor || colors.text.dark,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.xs
    };

    return (
        <View style={[Styles, { backgroundColor, marginRight }]}>
            {startIcon}
            <BText style={[TextStyles, { fontWeight: titleWeight }]}>
                {children}
            </BText>
            {endIcon}
        </View>
    );
}

export default BChip;
