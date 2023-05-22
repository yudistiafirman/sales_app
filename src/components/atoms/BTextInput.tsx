import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import { resScale } from "@/utils";
import { colors, fonts, layout } from "@/constants";

interface IProps extends Partial<TextInputProps> {
    rounded?: boolean;
    disabled?: boolean;
    contentStyle?: ViewStyle;
}

const baseStyle: TextStyle = {
    fontFamily: fonts.family.montserrat[400],
    fontSize: fonts.size.md,
    lineHeight: resScale(14),
    backgroundColor: colors.white,
    color: colors.textInput.input
    // placeho
};

const baseContainerStyle: TextStyle = {
    borderRadius: layout.radius.sm,
    minHeight: resScale(40),
    backgroundColor: colors.white
};

const defaultProps = {
    mode: "outlined",
    outlineColor: colors.textInput.inActive,
    activeOutlineColor: colors.primary,
    // placeHolderTextColor: colors.primary,
    textInputStyle: baseStyle,
    outlineStyle: baseContainerStyle,
    dense: true
};

function BTextInput({ ...props }: IProps & typeof defaultProps) {
    return (
        <TextInput
            {...props}
            placeholderTextColor={colors.textInput.placeHolder}
            contentStyle={props.contentStyle}
        />
    );
}

BTextInput.defaultProps = defaultProps;

export default BTextInput;
