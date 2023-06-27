import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View } from "react-native";
import { layout } from "@/constants";
import { QuickActionProps } from "@/interfaces/QuickActionButton.type";
import { DEFAULT_ESTIMATED_LIST_SIZE } from "@/constants/general";
import BQuickActionButton from "../molecules/BQuickAction";

export default function BQuickAction({
    buttonProps,
    isHorizontal = true,
    showsHorizontalScrollIndicator = false,
    showsVerticalScrollIndicator = false,
    containerStyle
}: QuickActionProps) {
    return (
        <View style={containerStyle}>
            <FlashList
                estimatedItemSize={DEFAULT_ESTIMATED_LIST_SIZE}
                contentContainerStyle={{ paddingLeft: layout.pad.lg }}
                showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                horizontal={isHorizontal}
                data={buttonProps}
                renderItem={BQuickActionButton}
                keyExtractor={(_, index) => index?.toString()}
            />
        </View>
    );
}
