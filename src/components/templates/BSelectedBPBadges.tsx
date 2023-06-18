import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, layout } from "@/constants";
import BSpacer from "../atoms/BSpacer";
import PillStatus from "../molecules/BVisitationCard/elements/PillStatus";

const styles = StyleSheet.create({
    text: {
        color: colors.text.darker,
        fontSize: fonts.size.lg,
        fontFamily: fonts.family.montserrat[600]
    },
    view: {
        justifyContent: "center",
        alignItems: "center"
    }
});

interface BSelectedBPBadgesProps {
    title: string;
    bpName: string;
    alignLeft?: boolean;
}

function BSelectedBPBadges({
    title,
    bpName,
    alignLeft = false
}: BSelectedBPBadgesProps) {
    return (
        <View style={[styles.view, alignLeft && { alignItems: "flex-start" }]}>
            <Text style={styles.text}>{title}</Text>
            <BSpacer size="verySmall" />
            <PillStatus pilStatus={bpName} color={colors.tertiary} />
        </View>
    );
}

export default BSelectedBPBadges;
