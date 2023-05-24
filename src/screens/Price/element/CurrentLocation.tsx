import React from "react";
import {
    GestureResponderEvent,
    StyleSheet,
    TouchableOpacity,
    Text
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { BViewMoreText } from "@/components";
import { layout } from "@/constants";
import colors from "@/constants/colors";
import font from "@/constants/fonts";

const CurrentLocationStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginStart: layout.pad.lg
    },
    viewMoreText: {
        flex: 1,
        fontFamily: font.family.montserrat[300],
        fontSize: font.size.xs,
        color: colors.text.blue,
        marginEnd: layout.pad.lg
    }
});

interface CurrentLocationProps {
    location?: string | undefined;
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
}

function CurrentLocation({ location, onPress }: CurrentLocationProps) {
    return (
        <TouchableOpacity
            style={CurrentLocationStyles.container}
            onPress={onPress}
        >
            <Icon
                name="map-pin"
                style={{ marginRight: layout.pad.md }}
                color={colors.text.darker}
            />
            <Text numberOfLines={1} style={CurrentLocationStyles.viewMoreText}>
                {location}
            </Text>
        </TouchableOpacity>
    );
}

export default CurrentLocation;
