import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import { resScale } from "@/utils";
import { colors, fonts, layout } from "@/constants";

const baseStyle: TextStyle = {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    lineHeight: resScale(14),
    backgroundColor: colors.white,
    color: colors.textInput.input
};

interface IProps extends Partial<TextInputProps> {
    rounded?: boolean;
    disabled?: boolean;
    contentStyle?: ViewStyle;
    textInputStyle: TextStyle;
    mode?: "flat" | "outlined" | undefined;
    outlineColor?: string;
    activeOutlineColor?: string;
    outlineStyle?: ViewStyle;
    dense?: boolean;
}

const baseContainerStyle: TextStyle = {
    borderRadius: layout.radius.sm,
    minHeight: resScale(40),
    backgroundColor: colors.white
};

const BTextInputdefaultProps = {
    mode: "outlined",
    outlineColor: colors.textInput.inActive,
    activeOutlineColor: colors.primary,
    outlineStyle: baseContainerStyle,
    dense: true
};

function BTextInput({ ...props }: IProps & typeof BTextInputdefaultProps) {
    return (
        <TextInput
            {...props}
            placeholderTextColor={colors.textInput.placeHolder}
            contentStyle={props.contentStyle}
        />
    );
}

BTextInput.defaultProps = BTextInputdefaultProps;

export default BTextInput;
