import { BChip, BSpacer, BSvg, BTouchableText } from "@/components";
import SvgNames from "@/components/atoms/BSvg/svgName";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import useCustomHeaderRight from "@/hooks/useCustomHeaderRight";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: layout.pad.lg,
        borderTopWidth: 1,
        borderColor: colors.border.default
    },
    touchableText: {
        fontFamily: font.family.montserrat[700],
        fontSize: font.size.sm,
        color: colors.primary
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        fontFamily: font.family.montserrat[400],
        fontSize: font.size.md,
        color: colors.text.darker
    },
    title: {
        fontFamily: font.family.montserrat[500],
        color: colors.text.darker,
        fontSize: font.size.sm
    }
});

function InvoiceDetail() {
    const route = useRoute<RootStackScreenProps>();

    useCustomHeaderRight({
        customHeaderRight: (
            <BTouchableText
                onPress={() => console.log("unduh pressed")}
                title="Unduh Tagihan"
                textStyle={styles.touchableText}
            />
        )
    });

    useHeaderTitleChanged({
        title: route?.params?.invoiceNo ? route?.params?.invoiceNo : "-"
    });
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Status</Text>
                <BChip
                    type="default"
                    textColor={colors.text.blue}
                    titleWeight="700"
                    backgroundColor={colors.status.lightBlue}
                >
                    Lunas
                </BChip>
            </View>
            <BSpacer size="extraSmall" />
            <View style={styles.textContainer}>
                <Text style={styles.text}>Pelanggan</Text>
                <BTouchableText
                    onPress={() => console.log("unduh pressed")}
                    title="PT. Coba"
                    endIcon={
                        <BSvg
                            svgName={SvgNames.IC_EXPORT}
                            width={layout.pad.ml}
                            style={{ marginLeft: layout.pad.sm }}
                            height={layout.pad.ml}
                            type="fill"
                            color={colors.white}
                        />
                    }
                    textStyle={[
                        styles.touchableText,
                        { fontFamily: font.family.montserrat[500] }
                    ]}
                />
            </View>
            <BSpacer size="extraSmall" />
            <View style={styles.textContainer}>
                <Text style={styles.text}>Metode Pembayaran</Text>
                <BChip
                    type="default"
                    textColor={colors.text.blue}
                    titleWeight="700"
                    backgroundColor={colors.status.lightBlue}
                >
                    Tunai
                </BChip>
            </View>
        </View>
    );
}

export default InvoiceDetail;
