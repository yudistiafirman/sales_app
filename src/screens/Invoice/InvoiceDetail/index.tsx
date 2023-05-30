import { BChip, BSpacer, BSvg, BTouchableText } from "@/components";
import SvgNames from "@/components/atoms/BSvg/svgName";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import useCustomHeaderRight from "@/hooks/useCustomHeaderRight";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const styles = StyleSheet.create({
    container: {
        padding: layout.pad.lg,
        borderTopWidth: 1,
        borderColor: colors.border.default,
        flex: 0.4
    },
    touchableText: {
        fontFamily: font.family.montserrat[700],
        fontSize: font.size.sm,
        color: colors.primary
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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
    },
    divider: {
        height: 1,
        backgroundColor: colors.border.default
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

        justifyContent: "space-between"
    },
    dateItem: {
        alignItems: "center"
    },
    listDoContainer: {
        paddingLeft: layout.pad.lg,
        paddingRight: layout.pad.md,
        borderTopEndRadius: layout.radius.md,
        borderTopStartRadius: layout.radius.md,
        backgroundColor: colors.tertiary,
        borderColor: colors.border.default,
        borderWidth: 1
    }
});

function InvoiceDetail() {
    const route = useRoute<RootStackScreenProps>();
    const [expand, setExpand] = useState(true);

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

    const renderInvoiceCardFooter = () => (
        <>
            <BSpacer size="extraSmall" />

            <View style={[styles.dateContainer]}>
                <View style={styles.dateItem}>
                    <Text style={styles.paymentItemTitle}>Jatuh Tempo</Text>
                    <BSpacer size="extraSmall" />
                    <Text
                        style={[
                            styles.title,
                            {
                                fontSize: font.size.sm,
                                fontFamily: font.family.montserrat[600]
                            }
                        ]}
                    >
                        45 hari
                    </Text>
                </View>
                <View style={styles.dateItem}>
                    <Text style={styles.paymentItemTitle}>Tanggal Tagih</Text>
                    <BSpacer size="extraSmall" />
                    <Text
                        style={[
                            styles.title,
                            {
                                fontSize: font.size.sm,
                                fontFamily: font.family.montserrat[600]
                            }
                        ]}
                    >
                        01/04/2023
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
                                fontSize: font.size.sm,
                                color: colors.primary,
                                fontFamily: font.family.montserrat[600]
                            }
                        ]}
                    >
                        14 hari
                    </Text>
                </View>
                <View style={styles.dateItem}>
                    <Text style={styles.paymentItemTitle}>
                        Tanggal Jatuh Tempo
                    </Text>
                    <BSpacer size="extraSmall" />
                    <Text
                        style={[
                            styles.title,
                            {
                                fontSize: font.size.sm,
                                fontFamily: font.family.montserrat[600]
                            }
                        ]}
                    >
                        15/05/2023
                    </Text>
                </View>
            </View>
        </>
    );
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Status</Text>
                    <BChip
                        type="default"
                        textColor={colors.text.blue}
                        titleWeight="700"
                        marginRight={0}
                        backgroundColor={colors.status.lightBlue}
                    >
                        Lunas
                    </BChip>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>Pelanggan</Text>
                    <BTouchableText
                        onPress={() => console.log("unduh pressed")}
                        title="PT. Coba"
                        endIcon={
                            <BSvg
                                svgName={SvgNames.IC_EXPORT}
                                width={layout.pad.ml}
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
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>Metode Pembayaran</Text>
                    <BChip
                        type="default"
                        textColor={colors.text.blue}
                        titleWeight="700"
                        marginRight={0}
                        backgroundColor={colors.status.lightBlue}
                    >
                        Tunai
                    </BChip>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>No. SPH </Text>
                    <Text style={[styles.title, { fontSize: font.size.md }]}>
                        SPH/BRIK/2023/05/00064
                    </Text>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>No. Purchase Order (PO) </Text>
                    <Text style={[styles.title, { fontSize: font.size.md }]}>
                        PO/BRIK/2023/05/00064
                    </Text>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>No. Sales Order (SO) </Text>
                    <Text style={[styles.title, { fontSize: font.size.md }]}>
                        SO/BRIK/2023/05/00064
                    </Text>
                </View>
                <BSpacer size="extraSmall" />
                <View style={styles.divider} />
                {renderInvoiceCardFooter()}
            </View>
            <View style={styles.listDoContainer}>
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>DO </Text>
                    <TouchableWithoutFeedback
                        onPress={() => setExpand(!expand)}
                    >
                        <Icon
                            name={expand ? "chevron-up" : "chevron-down"}
                            size={25}
                            color={colors.icon.darkGrey}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </View>
    );
}

export default InvoiceDetail;
