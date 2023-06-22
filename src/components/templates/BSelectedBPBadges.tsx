import * as React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { colors, fonts, layout } from "@/constants";
import { Badge } from "react-native-paper";
import { BatchingPlant } from "@/models/BatchingPlant";
import BSpacer from "../atoms/BSpacer";

const styles = StyleSheet.create({
    text: {
        color: colors.text.darker,
        fontSize: fonts.size.lg,
        fontFamily: fonts.family.montserrat[600],
        textAlign: "center",
        alignSelf: "center"
    },
    view: {
        flex: 1
    },
    badges: {
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        backgroundColor: colors.status.orange,
        fontSize: fonts.size.xs,
        paddingHorizontal: layout.pad.md,
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[500]
    }
});

interface BSelectedBPBadgesProps {
    title: string;
    selectedBP: BatchingPlant;
    alignLeft?: boolean;
}

function BSelectedBPBadges({
    title,
    selectedBP,
    alignLeft = false
}: BSelectedBPBadgesProps) {
    return (
        <View style={[styles.view]}>
            <View
                style={[
                    {
                        width: Dimensions.get("window").width - 140
                    }
                ]}
            >
                <Text
                    numberOfLines={2}
                    style={[
                        styles.text,
                        alignLeft && {
                            textAlign: "left",
                            alignSelf: "flex-start"
                        }
                    ]}
                >
                    {title}
                </Text>
            </View>
            <BSpacer size="verySmall" />
            <View style={[{ width: Dimensions.get("window").width - 140 }]}>
                <Badge
                    style={[
                        styles.badges,
                        alignLeft && { alignSelf: "flex-start" },
                        selectedBP?.name?.toLowerCase().includes("legok") && {
                            backgroundColor: colors.status.lightBlue
                        }
                    ]}
                >
                    {selectedBP?.name}
                </Badge>
            </View>
        </View>
    );
}

export default BSelectedBPBadges;
