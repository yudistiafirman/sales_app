import colors from "@/constants/colors";
import font from "@/constants/fonts";
import React from "react";
import {
    GestureResponderEvent,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from "react-native";
import { layout } from "@/constants";
import BText from "./BText";

interface BTouchableTextProps {
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    textStyle?: TextStyle | undefined;
    viewStyle?: ViewStyle | undefined;
    title?: string | undefined;
    disabled?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    textSize?: number;
}

const BTouchableTextDefaultStyle: TextStyle = {
    fontFamily: font.family.montserrat[400],
    color: colors.primary,
    fontSize: font.size.sm,
    marginLeft: layout.pad.xs,
    marginRight: layout.pad.xs
};

const BTouchableViewStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center"
};

const BTouchableDefaultProps = {
    textStyle: BTouchableTextDefaultStyle,
    viewStyle: BTouchableViewStyle
};

function BTouchableText({
    onPress,
    textStyle,
    viewStyle,
    title,
    textSize = undefined,
    disabled = false,
    startIcon,
    endIcon
}: BTouchableTextProps & typeof BTouchableDefaultProps) {
    return (
        <TouchableOpacity
            style={[viewStyle]}
            disabled={disabled}
            onPress={onPress}
        >
            {startIcon}
            <BText
                style={[
                    BTouchableTextDefaultStyle,
                    textStyle,
                    disabled && { color: colors.text.inactive }
                ]}
                sizeInNumber={textSize}
            >
                {title}
            </BText>
            {endIcon}
        </TouchableOpacity>
    );
}

BTouchableText.defaultProps = BTouchableDefaultProps;

export default BTouchableText;
