import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { layout } from "@/constants";
import colors from "@/constants/colors";
import font from "@/constants/fonts";
import resScale from "@/utils/resScale";
import VisitationCount from "./VisitationCount";

const style = StyleSheet.create({
    targetCount: {
        height: resScale(40),
        justifyContent: "center",
        alignItems: "center"
    },

    countText: {
        fontFamily: font.family.montserrat[300],
        fontSize: font.size.md,
        color: colors.black
    },

    shimmerStyle: {
        borderRadius: layout.radius.md
    }
});

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type TopVisitationType = {
    maxVisitation: number;
    currentVisitaion: number;
    isLoading: boolean;
};

export default function TopVisitation({
    maxVisitation,
    currentVisitaion,
    isLoading
}: TopVisitationType) {
    return (
        <View style={style.targetCount}>
            <ShimmerPlaceHolder style={style.shimmerStyle} visible={!isLoading}>
                <Text style={style.countText}>
                    Jumlah Kunjungan:{" "}
                    <VisitationCount
                        maxVisitation={maxVisitation}
                        currentVisitaion={currentVisitaion}
                    />
                </Text>
            </ShimmerPlaceHolder>
        </View>
    );
}
