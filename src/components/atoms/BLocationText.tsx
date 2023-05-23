import { View, Text, StyleSheet } from "react-native";
import React from "react";
import font from "@/constants/fonts";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import resScale from "@/utils/resScale";
import { colors, fonts, layout } from "@/constants";

const style = StyleSheet.create({
    location: {
        flexDirection: "row",
        alignItems: "center"
    },
    locationText: {
        flex: 1,
        color: "#0080FF",
        fontFamily: font.family.montserrat[300],
        fontSize: fonts.size.xs
    },
    iconStyle: {
        marginRight: layout.pad.md
    }
});

type locationType = {
    location?: string;
    color?: string;
};

export default function BLocationText({
    location,
    color = colors.text.blue
}: locationType) {
    if (!location) {
        return null;
    }
    return (
        <View style={style.location}>
            <SimpleLineIcons
                name="location-pin"
                size={13}
                color={color}
                style={style.iconStyle}
            />
            <Text numberOfLines={1} style={[style.locationText, { color }]}>
                {location}
            </Text>
        </View>
    );
}
