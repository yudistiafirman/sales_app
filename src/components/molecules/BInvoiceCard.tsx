import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import formatCurrency from "@/utils/formatCurrency";
import BSpacer from "../atoms/BSpacer";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: layout.pad.lg,
        borderTopWidth: 1,

        borderColor: colors.border.default
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
        backgroundColor: colors.border.default
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
    paymentMethodTitle: {
        fontFamily: font.family.montserrat[800],
        fontSize: font.size.xs,
        color: colors.primary
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
    projectName: string;
    amount: number;
    paymentStatus: string;
    paymentMethod: "Credit" | "Cash" | string | number;
    dueDateDays: string;
    billingDate: string;
    pastDueDateDays: string;
    pastDueDateDaysColor: string;
    dueDate: string;
    bgColor: string;
};

function BInvoiceCard({
    invoiceNo,
    companyName,
    projectName,
    amount,
    paymentStatus,
    paymentMethod,
    dueDateDays,
    billingDate,
    pastDueDateDays,
    pastDueDateDaysColor,
    dueDate,
    bgColor
}: IBInvoiceCard) {
    const renderInvoiceCardFooter = () => (
        <>
            <BSpacer size="small" />

            <View style={[styles.dateContainer]}>
                <View style={styles.dateItem}>
                    <Text style={styles.paymentItemTitle}>Jatuh Tempo</Text>
                    <BSpacer size="extraSmall" />
                    <Text style={[styles.title, { fontSize: font.size.xs }]}>
                        {dueDateDays}
                    </Text>
                </View>
                <View style={styles.dateItem}>
                    <Text style={styles.paymentItemTitle}>Tanggal Tagih</Text>
                    <BSpacer size="extraSmall" />
                    <Text style={[styles.title, { fontSize: font.size.xs }]}>
                        {billingDate}
                    </Text>
                </View>
                <View style={styles.dateItem}>
                    <Text style={styles.paymentItemTitle}>
                        Lewat Jatuh Tempo
                    </Text>
                    <BSpacer size="extraSmall" />
                    <Text
                        style={[
                            styles.title,
                            {
                                fontSize: font.size.xs,
                                color: pastDueDateDaysColor
                            }
                        ]}
                    >
                        {pastDueDateDays}
                    </Text>
                </View>
                <View style={styles.dateItem}>
                    <Text style={styles.paymentItemTitle}>
                        Tanggal Jatuh Tempo
                    </Text>
                    <BSpacer size="extraSmall" />
                    <Text style={[styles.title, { fontSize: font.size.xs }]}>
                        {dueDate}
                    </Text>
                </View>
            </View>
        </>
    );
    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{invoiceNo}</Text>
                    <Text style={styles.title}>
                        {`IDR ${formatCurrency(amount)}`}
                    </Text>
                </View>
                <BSpacer size="verySmall" />
                <Text style={styles.company}>{companyName}</Text>
                <BSpacer size="verySmall" />
                <Text style={styles.company}>{projectName}</Text>
            </View>
            <BSpacer size="extraSmall" />
            <View style={styles.divider} />
            <BSpacer size="extraSmall" />
            <View style={styles.footer}>
                <View style={styles.paymentContainer}>
                    <View style={styles.paymentItem}>
                        <Text style={styles.paymentItemTitle}>Status :</Text>
                        <BSpacer size="verySmall" />
                        <Text style={styles.paymentItemValue}>
                            {paymentStatus}
                        </Text>
                    </View>
                    <View style={styles.paymentItem}>
                        <Text style={styles.paymentItemTitle}>Metode :</Text>
                        <BSpacer size="verySmall" />
                        <Text style={styles.paymentMethodTitle}>
                            Pembayaran {paymentMethod}
                        </Text>
                    </View>
                </View>
                {paymentMethod === "Credit" ? renderInvoiceCardFooter() : null}
            </View>
        </View>
    );
}

export default BInvoiceCard;
