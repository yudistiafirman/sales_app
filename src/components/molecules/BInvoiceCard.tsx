import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import formatCurrency from "@/utils/formatCurrency";
import { TouchableOpacity } from "react-native-gesture-handler";
import { resScale } from "@/utils";
import BSpacer from "../atoms/BSpacer";
import BInvoiceCommonFooter, { IFooterItems } from "./BInvoiceCommonFooter";

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
        fontSize: font.size.md
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
    onPressCard: () => void;
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
    bgColor,
    onPressCard
}: IBInvoiceCard) {
    const renderInvoiceCardFooter = () => {
        const footerItems = [
            {
                itemTitle: "Jatuh Tempo",
                itemValue: dueDateDays
            },
            {
                itemTitle: "Tanggal Tagih",
                itemValue: billingDate
            },
            {
                itemTitle: "Lewat Jatuh Tempo",
                itemValue: pastDueDateDays,
                itemTextStyles: {
                    ...styles.title,
                    color: pastDueDateDaysColor,
                    fontSize: font.size.xs
                }
            },
            {
                itemTitle: "Tanggal Jatuh Tempo",
                itemValue: dueDate
            }
        ];

        return <BInvoiceCommonFooter footerItems={footerItems} />;
    };

    return (
        <TouchableOpacity
            onPress={onPressCard}
            style={[styles.container, { backgroundColor: bgColor }]}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text
                        numberOfLines={1}
                        style={[styles.title, { maxWidth: layout.pad.xxl * 4 }]}
                    >
                        {invoiceNo}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[styles.title, { maxWidth: resScale(160) }]}
                    >
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
                {paymentMethod.toUpperCase() === "CREDIT"
                    ? renderInvoiceCardFooter()
                    : null}
            </View>
        </TouchableOpacity>
    );
}

export default BInvoiceCard;
