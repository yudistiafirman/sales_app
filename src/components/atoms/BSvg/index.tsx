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
    const _type: string = svgName.startsWith("Ic")
        ? String(type || "stroke")
        : "img";
    const _color = String(color || "#010206");
    const _width: string | number = widthHeight || width || resScale(25);
    const _height: string | number = widthHeight || height || resScale(25);
    return (
        <View style={[{ width: _width, height: _height }, style]}>
            <I
                width={_width}
                height={_height}
                fill={_type === "fill" ? _color : undefined}
                stroke={_type === "stroke" ? _color : undefined}
                color={_type === "color" ? _color : undefined}
            />
        </View>
    );
}

export default BSvg;
