import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, layout } from "@/constants";
import { Badge } from "react-native-paper";
import BSpacer from "../atoms/BSpacer";

const styles = StyleSheet.create({
    text: {
        color: colors.text.darker,
        fontSize: fonts.size.lg,
        fontFamily: fonts.family.montserrat[600]
    },
    view: {
        justifyContent: "center",
        alignItems: "center"
    },
    badges: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: colors.status.orange,
        fontSize: fonts.size.xs,
        paddingHorizontal: layout.pad.md,
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[400]
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
            <Badge
                style={[
                    styles.badges,
                    alignLeft && { alignSelf: "flex-start" },
                    bpName.toLowerCase().includes("legok") && {
                        backgroundColor: colors.status.lightBlue
                    }
                ]}
            >
                {bpName}
            </Badge>
        </View>
    );
}

export default BSelectedBPBadges;
