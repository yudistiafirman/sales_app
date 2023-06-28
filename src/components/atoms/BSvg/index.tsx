import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { resScale } from "@/utils";
import SvgFiles from "./svgFile";

interface SvgProps {
    svgName: string;
    color?: string;
    type?: "fill" | "stroke" | "color";
    width?: number | string;
    height?: number | string;
    widthHeight?: number | string;
    style?: StyleProp<ViewStyle>;
}

function BSvg({
    svgName,
    width,
    height,
    widthHeight,
    color,
    type,
    style
}: SvgProps) {
    if (!svgName) return <View />;
    const I = SvgFiles[svgName as keyof typeof SvgFiles];
    const assignType: string = svgName?.startsWith("Ic")
        ? String(type || "stroke")
        : "img";
    const assignColor = String(color || "#010206");
    const assignWidth: string | number = widthHeight || width || resScale(25);
    const assignHeight: string | number = widthHeight || height || resScale(25);
    return (
        <View style={[{ width: assignWidth, height: assignHeight }, style]}>
            <I
                width={assignWidth}
                height={assignHeight}
                fill={assignType === "fill" ? assignColor : undefined}
                stroke={assignType === "stroke" ? assignColor : undefined}
                color={assignType === "color" ? assignColor : undefined}
            />
        </View>
    );
}

export default BSvg;
