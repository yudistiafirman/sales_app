import { FlashList } from "@shopify/flash-list";
import * as React from "react";
import {
    StyleProp,
    ViewStyle,
    View,
    StyleSheet,
    ListRenderItem
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { resScale } from "@/utils";
import { colors, layout } from "@/constants";
import { BSpacer } from "@/components";

const styles = StyleSheet.create({
    cameraBtn: {
        top: 0,
        position: "absolute",
        right: 0,
        bottom: 0,
        alignItems: "flex-end"
    },
    photoIconContainer: {
        width: layout.pad.xl,
        height: layout.pad.xl,
        borderWidth: 1,
        borderColor: "white",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: `${colors.disabled}50`
    },
    container: {
        width: layout.pad.xl + layout.pad.md,
        height: "50%"
    }
});

type ConfigType = {
    style?: StyleProp<ViewStyle>;
    onPressSwitchCamera: () => void;
    onPressFlashlight: () => void;
    onPressHDR: () => void;
    onPressHighQuality: () => void;
    onPressLowBoost: () => void;
    enableFlashlight: boolean;
    enableHDR: boolean;
    enableHighQuality: boolean;
    enableLowBoost: boolean;
    enableSwitchCamera: boolean;
};

function HeaderButton({
    style,
    onPressSwitchCamera,
    enableSwitchCamera,
    onPressFlashlight,
    onPressHDR,
    enableFlashlight,
    enableHDR,
    onPressHighQuality,
    enableHighQuality,
    onPressLowBoost,
    enableLowBoost
}: ConfigType) {
    const cameraHeaderButtonValue = [
        {
            onPress: onPressSwitchCamera,
            iconName: enableSwitchCamera ? "camera-flip" : "camera-flip"
        },
        {
            onPress: onPressFlashlight,
            iconName: enableFlashlight ? "flash" : "flash-off"
        },
        {
            onPress: onPressHDR,
            iconName: enableHDR ? "hdr" : "hdr-off"
        },
        {
            onPress: onPressHighQuality,
            iconName: enableHighQuality
                ? "high-definition"
                : "standard-definition"
        },
        {
            onPress: onPressLowBoost,
            iconName: enableLowBoost
                ? "lightbulb-on-outline"
                : "lightbulb-off-outline"
        }
    ];

    const renderItem: ListRenderItem<{
        onPress: () => void;
        iconName: string;
    }> = React.useCallback(
        ({ item }) => (
            <>
                <BSpacer size="small" />
                <TouchableOpacity
                    style={styles.photoIconContainer}
                    onPress={item?.onPress}
                >
                    <MaterialCommunityIcons
                        name={item?.iconName}
                        color={colors.white}
                        size={resScale(20)}
                    />
                </TouchableOpacity>
            </>
        ),
        []
    );

    return (
        <View style={[styles.cameraBtn, style]}>
            <View style={styles.container}>
                <FlashList
                    estimatedItemSize={4}
                    renderItem={renderItem}
                    data={cameraHeaderButtonValue}
                    keyExtractor={(item, index) => index?.toString()}
                />
                <BSpacer size="medium" />
            </View>
        </View>
    );
}

export default HeaderButton;
