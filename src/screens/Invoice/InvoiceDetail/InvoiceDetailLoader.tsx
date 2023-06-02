import React from "react";
import { BContainer, BSpacer } from "@/components";
import { layout } from "@/constants";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
function InvoiceDetailLoader() {
    const styles = StyleSheet.create({
        completeDocument: {
            height: layout.pad.xxl,
            width: "100%"
        },
        justifyBetween: {
            flexDirection: "row",
            justifyContent: "space-between"
        },
        name: {
            width: layout.pad.xxl,
            height: layout.pad.lg
        },
        npwp: {
            width: layout.pad.xxl * 2,
            height: layout.pad.lg
        },
        pic: {
            width: "100%",
            height: layout.pad.xl * 2,
            borderRadius: layout.radius.md
        },
        billingAddress: {
            height: layout.pad.xl,
            width: "100%",
            borderRadius: layout.radius.md
        }
    });

    return (
        <View>
            <BContainer>
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.name} />
                    <ShimmerPlaceholder style={styles.name} />
                </View>
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.npwp} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.name} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.npwp} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.npwp} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="large" />
                <View style={styles.justifyBetween}>
                    <View>
                        <ShimmerPlaceholder style={styles.name} />
                        <BSpacer size="extraSmall" />
                        <ShimmerPlaceholder style={styles.name} />
                    </View>
                    <View>
                        <ShimmerPlaceholder style={styles.name} />
                        <BSpacer size="extraSmall" />
                        <ShimmerPlaceholder style={styles.name} />
                    </View>
                    <View>
                        <ShimmerPlaceholder style={styles.name} />
                        <BSpacer size="extraSmall" />
                        <ShimmerPlaceholder style={styles.name} />
                    </View>
                    <View>
                        <ShimmerPlaceholder style={styles.name} />
                        <BSpacer size="extraSmall" />
                        <ShimmerPlaceholder style={styles.name} />
                    </View>
                </View>
                <BSpacer size="large" />
                <BSpacer size="small" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.pic} />
                </View>
                <BSpacer size="large" />
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.pic} />
                </View>
                <BSpacer size="large" />
                <BSpacer size="large" />

                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.npwp} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.npwp} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.npwp} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.npwp} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="medium" />
                <View style={styles.justifyBetween}>
                    <ShimmerPlaceholder style={styles.npwp} />
                    <ShimmerPlaceholder style={styles.npwp} />
                </View>
                <BSpacer size="medium" />
            </BContainer>
        </View>
    );
}

export default InvoiceDetailLoader;
