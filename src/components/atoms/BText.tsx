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
    const defaultStyle: TextStyle = {
        color: colors.text.dark,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.sm
    };
    let assignStyle: TextStyle = {
        ...defaultStyle
    };
    if (type === "header") {
        assignStyle = {
            ...assignStyle,
            fontFamily: fonts.family.montserrat[600],
            fontSize: fonts.size.xl
        };
    }
    if (type === "title") {
        assignStyle = {
            ...assignStyle,
            fontFamily: fonts.family.montserrat[600],
            fontSize: fonts.size.md
        };
    }

    if (color === "primary") {
        assignStyle = {
            ...assignStyle,
            color: colors.primary
        };
    }
    if (color === "darker") {
        assignStyle = {
            ...assignStyle,
            color: colors.text.darker
        };
    }
    if (color === "error") {
        assignStyle = {
            ...assignStyle,
            color: colors.text.errorText
        };
    }

    if (color === "divider") {
        assignStyle = {
            ...assignStyle,
            color: colors.text.divider
        };
    }

    if (bold) {
        assignStyle = {
            ...assignStyle,
            fontWeight: bold,
            fontFamily:
                bold !== "normal" && bold !== "bold"
                    ? fonts.family.montserrat[parseInt(bold, 10)]
                    : undefined
        };

        if (
            bold !== "normal" &&
            bold !== "bold" &&
            bold !== "100" &&
            bold !== "200" &&
            bold !== "900"
        ) {
            assignStyle = {
                ...assignStyle,
                fontFamily: fonts.family.montserrat[parseInt(bold, 10)]
            };
        }
    }

    if (size) {
        assignStyle = {
            ...assignStyle,
            fontSize: fonts.size.xs
        };
    }

    if (sizeInNumber) {
        assignStyle = {
            ...assignStyle,
            fontSize: sizeInNumber
        };
    }

    return (
        <Text
            numberOfLines={numberOfLines}
            style={[assignStyle, style]}
            {...props}
        >
            {children}
        </Text>
    );
}

export default BText;
