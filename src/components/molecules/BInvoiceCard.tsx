import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import formatCurrency from "@/utils/formatCurrency";
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

type IBInvoiceCard = {
    invoiceNo: string;
    companyName: string;
    amount: number;
    paymentStatus: string;
    paymentMethod: string;
    dueDateDays: string;
    billingDate: string;
    pastDueDateDays: string;
    dueDate: string;
};

function BInvoiceCard({
    invoiceNo,
    companyName,
    amount,
    paymentStatus,
    paymentMethod,
    dueDateDays,
    billingDate,
    pastDueDateDays,
    dueDate
}: IBInvoiceCard) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{invoiceNo}</Text>
                    <Text style={styles.title}>
                        Rp. {formatCurrency(amount)}{" "}
                    </Text>
                </View>
                <BSpacer size="verySmall" />
                <Text style={styles.company}>{companyName}</Text>
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
                            {paymentStatus}
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
                            {paymentMethod}
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
                            {dueDateDays} hari
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
                            {billingDate}
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
                            {pastDueDateDays} hari
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
                            {dueDate}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default BInvoiceCard;
