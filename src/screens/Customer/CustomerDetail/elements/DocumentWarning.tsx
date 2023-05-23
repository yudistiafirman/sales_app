import { colors, fonts, layout } from "@/constants";
import {
    CUSTOMER_DETAIL_TITLE,
    CUSTOMER_DOCUMENT,
    DOCUMENTS
} from "@/navigation/ScreenNames";
import { resScale } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
    labelWarning: {
        backgroundColor: colors.status.offYellow,
        paddingHorizontal: layout.pad.lg,
        paddingVertical: layout.pad.md,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    labelText: {
        color: colors.text.secYellow,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.xs,
        flex: 0.9
    },
    outlineButton: {
        borderColor: colors.primary,
        borderWidth: resScale(1),
        borderRadius: layout.radius.md,
        paddingVertical: layout.pad.sm,
        paddingHorizontal: layout.pad.md,
        justifyContent: "center"
    },
    buttonText: {
        color: colors.primary,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.xs
    }
});

function DocumentWarning({
    docs,
    customerId,
    customerType
}: {
    docs?: Docs[];
    customerId?: string;
    customerType: "INDIVIDU" | "COMPANY";
}) {
    const navigation = useNavigation();
    return (
        <View style={styles.labelWarning}>
            <Text style={styles.labelText}>
                Ada dokumen pelanggan yang belum dilengkapi.
            </Text>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(CUSTOMER_DOCUMENT, {
                        docs,
                        customerId,
                        customerType
                    })
                }
                style={styles.outlineButton}
            >
                <Text style={styles.buttonText}>Lengkapi Dokumen</Text>
            </TouchableOpacity>
        </View>
    );
}

export default DocumentWarning;
