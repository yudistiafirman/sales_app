import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { colors, fonts, layout } from "@/constants";
import { resScale } from "@/utils";
import BText from "./BText";

interface BChipProps {
    children: any;
    type?: "default" | "header";
    backgroundColor?: string | undefined;
    textColor?: string | undefined;
}

function BChip({ children, type, backgroundColor, textColor }: BChipProps) {
    const BChipHeaderStyle: ViewStyle = {
        paddingHorizontal: layout.pad.md,
        paddingVertical: layout.pad.xs,
        borderRadius: layout.radius.sm
    };

    const BChipDefaultStyle: ViewStyle = {
        paddingVertical: layout.pad.xs,
        paddingHorizontal: layout.pad.md + layout.pad.xs,
        borderRadius: layout.radius.xl,
        marginRight: layout.pad.md
    };

    const _style: ViewStyle =
        type === "header" ? BChipHeaderStyle : BChipDefaultStyle;

    const _textStyle: TextStyle = {
        color: textColor || colors.text.dark,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.xs
    };

    return (
        <View style={[_style, { backgroundColor }]}>
            <BText style={[_textStyle]}>{children}</BText>
        </View>
    );
}

export default BChip;
