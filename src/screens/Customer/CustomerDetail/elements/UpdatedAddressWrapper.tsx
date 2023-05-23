import { BText } from "@/components";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import { resScale } from "@/utils";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

function UpdatedAddressWrapper({ address }: { address: string }) {
    return (
        <View style={styles.filledAddressContainer}>
            <View style={styles.filledAddressInnerContainer}>
                {address ? (
                    <>
                        <BText numberOfLines={1} style={styles.mainAddress}>
                            {address.split(",")[0]}
                        </BText>
                        <BText numberOfLines={1} style={styles.secondAddress}>
                            {address}
                        </BText>
                    </>
                ) : (
                    <BText numberOfLines={1} style={styles.mainAddress}>
                        -
                    </BText>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    filledAddressContainer: {
        backgroundColor: colors.tertiary,
        borderRadius: layout.radius.md,
        width: "100%",
        borderWidth: 2,
        borderColor: colors.border.default
    },
    filledAddressInnerContainer: {
        flex: 1,
        marginVertical: layout.pad.ml,
        marginLeft: layout.pad.lg
    },
    mainAddress: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.sm,
        color: colors.text.darker,
        marginBottom: layout.pad.xs
    },
    secondAddress: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.xs,
        color: `${colors.pitchBlack}50`,
        marginBottom: layout.pad.sm
    },
    changeAddressBtn: {
        width: resScale(104),
        height: resScale(24),
        borderWidth: 1,
        borderColor: colors.textInput.placeHolder,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: layout.radius.sm
    },
    changeAddressText: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.sm,
        color: colors.text.medium
    }
});

export default UpdatedAddressWrapper;
