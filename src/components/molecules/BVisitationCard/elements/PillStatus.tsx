import * as React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { layout } from "@/constants";
import colors from "@/constants/colors";
import font from "@/constants/fonts";

const style = StyleSheet.create({
    greenPill: {
        padding: layout.pad.xs,
        backgroundColor: "#C2FCC8",
        paddingVertical: layout.pad.xs,
        paddingHorizontal: layout.pad.xs + layout.pad.md,
        borderRadius: layout.radius.xl
    },
    grayColor: {
        backgroundColor: colors.status.grey
    },
    greenPillText: {
        alignSelf: "center",
        justifyContent: "center",
        fontFamily: font.family.montserrat[300],
        fontSize: font.size.xs,
        color: colors.textInput.input
    }
});

type PillStatusType = {
    pilStatus?: string;
    color?: string;
    styles?: ViewStyle;
    textColor?: string;
};
export default function PillStatus({
    pilStatus,
    color,
    textColor,
    styles
}: PillStatusType) {
    if (!pilStatus) {
        return null;
    }
    return (
        <View style={[styles]}>
            <View
                style={[
                    pilStatus ? style.greenPill : null,
                    color ? { backgroundColor: color } : null
                ]}
            >
                <Text
                    style={[
                        style.greenPillText,
                        textColor && { color: textColor }
                    ]}
                >
                    {pilStatus}
                </Text>
            </View>
        </View>
    );
}
