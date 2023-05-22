import { StyleSheet } from "react-native";
import { layout } from "@/constants";
import colors from "@/constants/colors";
import { resScale } from "@/utils";

const TabBarStyle = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: resScale(56),
        borderTopWidth: 1,
        borderColor: colors.border.grey
    },
    icon: {
        height: resScale(24),
        width: resScale(24),
        marginBottom: layout.pad.sm
    }
});

export default TabBarStyle;
