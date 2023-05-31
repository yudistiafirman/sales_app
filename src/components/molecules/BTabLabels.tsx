import colors from "@/constants/colors";
import font from "@/constants/fonts";
import resScale from "@/utils/resScale";
import React from "react";
import { TextStyle, View, ViewStyle } from "react-native";
import { layout } from "@/constants";
import BChip from "../atoms/BChip";
import BText from "../atoms/BText";
import BSpacer from "../atoms/BSpacer";

type Route = {
    key: string;
    title: string;
    totalItems?: number;
    chipPosition?: "right" | "bottom" | undefined;
};

interface BTabLabelsProps {
    route: Route;
    focused: boolean;
    tabTextfocusedColor?: string;
    minWidth?: number | undefined;
}

function BTabLabels({
    route,
    focused,
    minWidth,
    tabTextfocusedColor = colors.primary
}: BTabLabelsProps) {
    const isHasItems = route?.totalItems > 0;
    const rightChipPosition = route?.chipPosition === "right";

    const chipBackgroundColor = rightChipPosition ? colors.chip.disabled : "";
    const BTabLabelsContainer: ViewStyle = {
        flexDirection: rightChipPosition ? "row" : "column",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        minWidth: layout.pad.xxl * (route.title?.length > 9 ? 4 : 2)
    };

    const BTabLabelsTextStyle: TextStyle = {
        color: focused ? tabTextfocusedColor : colors.text.dark,
        fontFamily: focused
            ? font.family.montserrat[600]
            : font.family.montserrat[400],
        fontSize: font.size.md,
        alignSelf: "center",
        paddingRight: rightChipPosition ? layout.pad.sm : 0,
        textAlign: "center"
    };

    const BChipStyle: ViewStyle = {
        flex: 1
    };
    return (
        <View style={BTabLabelsContainer}>
            <BText style={BTabLabelsTextStyle}>{route.title}</BText>
            {isHasItems && (
                <BChip
                    type="header"
                    titleWeight={focused ? "700" : "normal"}
                    textColor={focused && tabTextfocusedColor}
                    backgroundColor={isHasItems ? chipBackgroundColor : null}
                    style={BChipStyle}
                >
                    {route?.totalItems}
                </BChip>
            )}
        </View>
    );
}

export default BTabLabels;
