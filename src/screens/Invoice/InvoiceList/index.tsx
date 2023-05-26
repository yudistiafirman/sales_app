import { BSearchBar, BSpacer } from "@/components";
import BFilterSort from "@/components/molecules/BFilterSort";
import BInvoiceCard from "@/components/molecules/BInvoiceCard";
import { colors, layout } from "@/constants";
import { resScale } from "@/utils";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderColor: colors.border.default,
        flex: 1
    },
    outlineSearchBar: {
        borderWidth: 1,
        borderRadius: layout.radius.md,
        borderColor: colors.border.default
    },
    headerComponent: {
        padding: layout.pad.lg,
        borderColor: colors.border.default
    }
});

function InvoiceList() {
    const renderInvoiceListHeader = () => (
        <>
            <BSearchBar
                outlineStyle={styles.outlineSearchBar}
                placeholder="Cari Invoice"
                textInputStyle={{ minHeight: resScale(42) }}
                left={
                    <TextInput.Icon
                        size={layout.pad.xl}
                        disabled
                        icon="magnify"
                    />
                }
            />
            <BSpacer size="small" />
            <BFilterSort
                onPressSort={() => console.log("sort pressed")}
                onPressFilter={() => console.log("filter pressed")}
            />
            <BSpacer size="verySmall" />
        </>
    );

    const renderInvoiceCard = useCallback(({ item, index }) => {
        const invoiceNo = "INV/202332394";
        const companyName = "PD Prakasa Wibowo (Persero) Tbk";
        const amount = 14391328;
        const paymentStatus = "Tagihan diterima";
        const paymentMethod = "Pembayaran Credit";
        const dueDateDays = "45";
        const billingDate = "1 Jan 2023";
        const pastDueDateDays = "45";
        const dueDate = "1 Jan 2023";
        return (
            <BInvoiceCard
                invoiceNo={invoiceNo}
                companyName={companyName}
                amount={amount}
                paymentStatus={paymentStatus}
                paymentMethod={paymentMethod}
                dueDateDays={dueDateDays}
                billingDate={billingDate}
                pastDueDateDays={pastDueDateDays}
                dueDate={dueDate}
            />
        );
    }, []);
    return (
        <View style={styles.container}>
            <FlashList
                data={[1]}
                renderItem={renderInvoiceCard}
                estimatedItemSize={10}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={renderInvoiceListHeader}
                ListHeaderComponentStyle={styles.headerComponent}
            />
        </View>
    );
}

export default InvoiceList;
