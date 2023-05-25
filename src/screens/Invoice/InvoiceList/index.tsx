import { BContainer, BSearchBar, BSpacer } from "@/components";
import BFilterSort from "@/components/molecules/BFilterSort";
import { colors, layout } from "@/constants";
import { resScale } from "@/utils";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderColor: colors.border.lightGrayishBlue,
        flex: 1
    },
    outlineSearchBar: {
        borderWidth: 1,
        borderRadius: layout.radius.md,
        borderColor: colors.border.lightGrayishBlue
    },
    headerComponent: {
        padding: layout.pad.lg,
        borderColor: colors.border.lightGrayishBlue,
        borderBottomWidth: 1
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
    return (
        <View style={styles.container}>
            <FlashList
                data={[]}
                renderItem={() => <View />}
                estimatedItemSize={200}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={renderInvoiceListHeader}
                ListHeaderComponentStyle={styles.headerComponent}
            />
        </View>
    );
}

export default InvoiceList;
