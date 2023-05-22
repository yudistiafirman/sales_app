import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { colors, fonts } from "@/constants";
import { resFontSize } from "@/utils";

interface IProps {
    children: React.ReactNode;
    type?: "default" | "header" | "title";
    color?: "primary" | "divider" | "error" | "darker";
    bold?:
        | "bold"
        | "400"
        | "normal"
        | "100"
        | "200"
        | "300"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900"
        | undefined;
    size?: "small" | "normal" | "large";
    sizeInNumber?: number;
    numberOfLines?: number;
}

function BText({
    children,
    style,
    type,
    color,
    bold,
    size,
    numberOfLines,
    sizeInNumber,
    ...props
}: IProps & TextProps) {
    const _defaultStyle: TextStyle = {
        color: colors.text.dark,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.sm
    };
    let _style: TextStyle = {
        ..._defaultStyle
    };
    if (type === "header") {
        _style = {
            ..._style,
            fontFamily: fonts.family.montserrat[600],
            fontSize: fonts.size.xl
        };
    }
    if (type === "title") {
        _style = {
            ..._style,
            fontFamily: fonts.family.montserrat[600],
            fontSize: fonts.size.md
        };
    }

    if (color === "primary") {
        _style = {
            ..._style,
            color: colors.primary
        };
    }
    if (color === "darker") {
        _style = {
            ..._style,
            color: colors.text.darker
        };
    }
    if (color === "error") {
        _style = {
            ..._style,
            color: colors.text.errorText
        };
    }

    if (color === "divider") {
        _style = {
            ..._style,
            color: colors.text.divider
        };
    }

    if (bold) {
        _style = {
            ..._style,
            fontWeight: bold,
            fontFamily:
                bold !== "normal" && bold !== "bold"
                    ? fonts.family.montserrat[parseInt(bold)]
                    : undefined
        };

        if (
            bold !== "normal" &&
            bold !== "bold" &&
            bold !== "100" &&
            bold !== "200" &&
            bold !== "900"
        ) {
            _style = {
                ..._style,
                fontFamily: fonts.family.montserrat[parseInt(bold)]
            };
        }
    }

    if (size) {
        _style = {
            ..._style,
            fontSize: fonts.size.xs
        };
    }

    if (sizeInNumber) {
        _style = {
            ..._style,
            fontSize: sizeInNumber
        };
    }

    return (
        <Text numberOfLines={numberOfLines} style={[_style, style]} {...props}>
            {children}
        </Text>
    );
}

export default BText;
