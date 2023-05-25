import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BSpacer from "../atoms/BSpacer";
import BChip from "../atoms/BChip";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: layout.pad.lg,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border.lightGrayishBlue
    },
    header: {
        flex: 0.5
    },
    footer: {
        flex: 0.5
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        fontFamily: font.family.montserrat[600],
        color: colors.text.darker,
        fontSize: font.size.lg
    },
    company: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.xs,
        color: colors.text.shadowGray
    },
    divider: {
        height: 1,
        backgroundColor: colors.border.lightGrayishBlue
    },
    paymentContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    paymentItem: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    paymentItemTitle: {
        fontFamily: font.family.montserrat[500],
        fontSize: font.size.xs,
        color: colors.text.shadowGray
    },
    paymentItemValue: {
        fontFamily: font.family.montserrat[600],
        fontSize: font.size.xs,
        color: colors.text.blue
    },
    dateContainer: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between"
    },
    dateItem: {
        alignItems: "center"
    }
});

function BInvoiceCard() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>INV/202332394</Text>
                    <Text style={styles.title}>Rp. 14.391.328 </Text>
                </View>
                <BSpacer size="verySmall" />
                <Text style={styles.company}>
                    PD Prakasa Wibowo (Persero) Tbk
                </Text>
            </View>
            <BSpacer size="extraSmall" />
            <View style={styles.divider} />
            <BSpacer size="extraSmall" />
            <View style={styles.footer}>
                <View style={styles.paymentContainer}>
                    <View style={styles.paymentItem}>
                        <Text style={styles.paymentItemTitle}>
                            Pembayaran :
                        </Text>
                        <BSpacer size="verySmall" />
                        <Text style={styles.paymentItemValue}>
                            Tagihan Diterima
                        </Text>
                    </View>
                    <View style={styles.paymentItem}>
                        <Text style={styles.paymentItemTitle}>Metode :</Text>
                        <BSpacer size="verySmall" />
                        <BChip
                            type="header"
                            backgroundColor={colors.status.lightBlue}
                            textColor={colors.text.blue}
                            titleWeight="800"
                        >
                            Pembayaran Kredit
                        </BChip>
                    </View>
                </View>
                <BSpacer size="small" />
                <View style={styles.dateContainer}>
                    <View style={styles.dateItem}>
                        <Text style={styles.paymentItemTitle}>Jatuh Tempo</Text>
                        <BSpacer size="extraSmall" />
                        <Text
                            style={[styles.title, { fontSize: font.size.xs }]}
                        >
                            45 hari
                        </Text>
                    </View>
                    <View style={styles.dateItem}>
                        <Text style={styles.paymentItemTitle}>
                            Tanggal Tagih
                        </Text>
                        <BSpacer size="extraSmall" />
                        <Text
                            style={[styles.title, { fontSize: font.size.xs }]}
                        >
                            1 Jan 2023
                        </Text>
                    </View>
                    <View style={styles.dateItem}>
                        <Text style={styles.paymentItemTitle}>
                            Lewat Jatuh Tempo
                        </Text>
                        <BSpacer size="extraSmall" />
                        <Text
                            style={[styles.title, { fontSize: font.size.xs }]}
                        >
                            45 hari
                        </Text>
                    </View>
                    <View style={styles.dateItem}>
                        <Text style={styles.paymentItemTitle}>
                            Tanggal Jatuh Tempo
                        </Text>
                        <BSpacer size="extraSmall" />
                        <Text
                            style={[styles.title, { fontSize: font.size.xs }]}
                        >
                            45 hari
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default BInvoiceCard;
