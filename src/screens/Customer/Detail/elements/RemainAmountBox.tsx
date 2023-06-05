import { BDivider, BSpacer, BText } from "@/components";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import formatCurrency from "@/utils/formatCurrency";
import React from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: colors.border.default,
        borderRadius: layout.radius.md,
        backgroundColor: colors.tertiary,
        flex: 1
    },
    innerContainer: {
        paddingVertical: layout.pad.xs + layout.pad.md,
        alignItems: "center"
    },
    divider: {
        borderColor: colors.border.default,
        borderBottomWidth: 1,
        width: "85%",
        marginHorizontal: layout.pad.lg
    },
    title: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.sm,
        color: `${colors.pitchBlack}50`
    },
    firstAmount: {
        fontFamily: font.family.montserrat[600],
        fontSize: font.size.md,
        color: colors.text.darker
    }
});

interface IRemainingAmountBox {
    title: string;
    firstAmount: number;
    secondAmount?: number;
}

function RemainingAmountBox({
    title,
    firstAmount,
    secondAmount
}: IRemainingAmountBox) {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <BText style={styles.title}>{title}</BText>
                {secondAmount === undefined && <BSpacer size="extraSmall" />}

                <BText style={styles.firstAmount}>
                    {formatCurrency(firstAmount)}
                </BText>
                {secondAmount !== undefined && <View style={styles.divider} />}

                {secondAmount !== undefined && (
                    <BText style={styles.title}>
                        {formatCurrency(secondAmount)}
                    </BText>
                )}
            </View>
        </View>
    );
}

export default RemainingAmountBox;
