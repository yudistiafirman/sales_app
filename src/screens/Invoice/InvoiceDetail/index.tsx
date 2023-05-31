import { BChip, BSpacer, BSvg, BTouchableText } from "@/components";
import SvgNames from "@/components/atoms/BSvg/svgName";
import BInvoiceCommonFooter from "@/components/molecules/BInvoiceCommonFooter";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import useCustomHeaderRight from "@/hooks/useCustomHeaderRight";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
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

    listDoContainer: {
        paddingLeft: layout.pad.lg,
        paddingRight: layout.pad.lg,
        borderTopEndRadius: layout.radius.lg,
        borderTopStartRadius: layout.radius.lg,
        backgroundColor: colors.tertiary,
        borderColor: colors.border.default,
        borderWidth: 1,
        flex: 0.6
    },
    cardContainer: {
        borderColor: colors.border.default,
        borderWidth: 2,
        borderRadius: layout.radius.md,
        paddingVertical: layout.pad.ml,
        paddingHorizontal: layout.pad.lg,
        backgroundColor: colors.white
    }
});

function InvoiceDetail() {
    const route = useRoute<RootStackScreenProps>();
    const [expand, setExpand] = useState(true);
    const doData = [1, 2, 3, 4, 5];

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

    const renderListHorizontalDate = () => {
        const footerItems = [
            {
                itemTitle: "Jatuh Tempo",
                itemValue: "45 hari",
                itemTextStyles: {
                    fontSize: font.size.sm
                }
            },
            {
                itemTitle: "Tanggal Tagih",
                itemValue: "01/04/2023",
                itemTextStyle: {
                    fontSize: font.size.sm
                }
            },
            {
                itemTitle: "Lewat Jatuh Tempo",
                itemValue: "14 Hari",
                itemTextStyles: {
                    fontSize: font.size.sm,
                    color: colors.primary
                }
            },
            {
                itemTitle: "Tanggal Jatuh Tempo",
                itemValue: "05/05/2023",
                itemTextStyles: {
                    fontSize: font.size.sm
                }
            }
        ];

        return <BInvoiceCommonFooter footerItems={footerItems} />;
    };

    const renderDoCardFooter = () => {
        const footerItems = [
            {
                itemTitle: "Produk",
                itemValue: "SC 3.5 NFA",
                itemTitleStyles: {
                    alignSelf: "flex-start"
                }
            },
            {
                itemTitle: "Volume",
                itemValue: "8 m3"
            },
            {
                itemTitle: "Harga Unit",
                itemValue: "14 Hari",
                itemTextStyles: {
                    color: colors.primary
                }
            },
            {
                itemTitle: "Ekstra",
                itemValue: "Rp. 0"
            },
            {
                itemTitle: "Total",
                itemValue: "Rp. 6.240.000",
                itemTitleStyles: { alignSelf: "flex-end" }
            }
        ];

        return <BInvoiceCommonFooter footerItems={footerItems} />;
    };

    const renderDoCard = () => (
        <View style={{ ...styles.cardContainer }}>
            <View style={styles.textContainer}>
                <Text style={[styles.title]}>Pelanggan</Text>
                <Text style={[styles.text, { fontSize: font.size.xs }]}>
                    01/04/2023
                </Text>
            </View>

            {renderDoCardFooter()}
        </View>
    );

    const renderInvoiceDetailFooter = () => (
        <View style={{ flex: 1, paddingBottom: layout.pad.ml }}>
            <BSpacer size="small" />
            <View style={styles.divider} />
            <BSpacer size="extraSmall" />
            <View style={[styles.textContainer]}>
                <Text style={styles.text}>SC 3.5 NFA 16 m3</Text>
                <Text style={[styles.title, { fontSize: font.size.md }]}>
                    Rp 12.480.000
                </Text>
            </View>
            <BSpacer size="extraSmall" />
            <View style={[styles.textContainer]}>
                <Text style={styles.text}>K-500 FA 19 m3</Text>
                <Text style={[styles.title, { fontSize: font.size.md }]}>
                    Rp 15.680.000
                </Text>
            </View>
            <BSpacer size="extraSmall" />
            <View style={[styles.textContainer]}>
                <Text style={[styles.title, { fontSize: font.size.md }]}>
                    Jumlah Tagihan
                </Text>
                <Text
                    style={[
                        styles.title,
                        {
                            fontSize: font.size.md,
                            fontFamily: font.family.montserrat[600]
                        }
                    ]}
                >
                    Rp 15.680.000
                </Text>
            </View>
            <BSpacer size="extraSmall" />
            <View style={[styles.textContainer]}>
                <Text style={styles.text}>Jumlah Terbayar</Text>
                <Text style={[styles.title, { fontSize: font.size.md }]}>
                    - Rp 28.160.000
                </Text>
            </View>
            <BSpacer size="extraSmall" />
            <View style={[styles.textContainer]}>
                <Text style={[styles.title, { fontSize: font.size.md }]}>
                    Jumlah Terhutang
                </Text>
                <Text
                    style={[
                        styles.title,
                        {
                            fontSize: font.size.md,
                            fontFamily: font.family.montserrat[600]
                        }
                    ]}
                >
                    Rp 0
                </Text>
            </View>
        </View>
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
                {renderListHorizontalDate()}
            </View>
            <View style={[styles.listDoContainer]}>
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>DO </Text>
                    <BSpacer size="extraSmall" />
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

                <FlashList
                    data={[1, 2, 3, 4]}
                    renderItem={() => (expand ? renderDoCard() : null)}
                    estimatedItemSize={20}
                    ListFooterComponent={renderInvoiceDetailFooter()}
                />
            </View>
        </View>
    );
}

export default InvoiceDetail;
