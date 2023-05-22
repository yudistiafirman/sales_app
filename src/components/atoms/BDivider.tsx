import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { colors } from "@/constants";

const baseStyle = {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: colors.textInput.inActive
};

function BDivider(styles: StyleProp<ViewStyle>) {
    return <View style={[baseStyle, styles]} />;
}

export default BDivider;
