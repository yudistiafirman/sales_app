import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts, layout } from "@/constants";
import colors from "@/constants/colors";
import font from "@/constants/fonts";
import HighlightText from "../../../atoms/BHighlightText";

const style = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginTop: layout.pad.xs + layout.pad.md,
        alignItems: "center"
    },
    bluePill: {
        padding: layout.pad.xs,
        paddingVertical: layout.pad.xs,
        paddingHorizontal: layout.pad.xs + layout.pad.md,
        borderRadius: layout.radius.xl
    },
    bluePillText: {
        fontFamily: font.family.montserrat[400],
        fontSize: fonts.size.xs,
        color: colors.textInput.input
    },
    margin: {
        marginRight: layout.pad.md + layout.pad.xs
    }
});

type PillNamesType = {
    pilNames?: string[];
    searchQuery?: string;
    pillColor?: string;
};
export default function PillNames({
    pilNames = [],
    searchQuery,
    pillColor = colors.blueSky
}: PillNamesType) {
    if (!pilNames.length) {
        return null;
    }
    function nameCount() {
        if (pilNames?.length > 1) {
            return (
                <View style={[style.bluePill]}>
                    <Text style={style.bluePillText}>{`+${
                        pilNames.length - 1
                    } lagi`}</Text>
                </View>
            );
        }
        return null;
    }
    const filteredPilNames = pilNames.filter((it) => it);
    return (
        <View style={style.container}>
            <View
                style={[
                    style.bluePill,
                    style.margin,
                    { backgroundColor: pillColor }
                ]}
            >
                <View style={{ flex: 0.5 }}>
                    <HighlightText
                        fontSize={fonts.size.xs}
                        name={filteredPilNames[0]}
                        searchQuery={searchQuery}
                        // numberOfLines={2}
                    />
                </View>
            </View>
            {nameCount()}
        </View>
    );
}
