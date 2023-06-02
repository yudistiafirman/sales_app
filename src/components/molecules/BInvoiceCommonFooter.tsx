import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import font from "@/constants/fonts";
import { colors, layout } from "@/constants";
import { resScale } from "@/utils";
import BSpacer from "../atoms/BSpacer";

export interface IFooterItems {
    itemTitle?: string;
    itemValue?: string;
    itemViewStyles?: ViewStyle;
    itemTextStyles?: TextStyle;
    itemTitleStyles?: TextStyle;
}

interface IBInvoiceCommonFooter {
    footerItems: IFooterItems[];
}

function BInvoiceCommonFooter({ footerItems }: IBInvoiceCommonFooter) {
    const styles = StyleSheet.create({
        title: {
            fontFamily: font.family.montserrat[600],
            color: colors.text.darker,
            fontSize: font.size.md
        },

        itemTitle: {
            fontFamily: font.family.montserrat[500],
            fontSize: font.size.vs,
            color: colors.text.shadowGray
        },
        container: {
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between"
        },
        item: {
            alignItems: "center"
        }
    });

    return (
        <>
            <BSpacer size="small" />

            <View style={[styles.container]}>
                {footerItems.length > 0 &&
                    footerItems.map((v, i) => (
                        <View
                            key={i}
                            style={[styles.item, { ...v.itemViewStyles }]}
                        >
                            <Text
                                style={[
                                    styles.itemTitle,
                                    { ...v.itemTitleStyles }
                                ]}
                            >
                                {v.itemTitle}
                            </Text>
                            <BSpacer size="extraSmall" />
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.title,
                                    {
                                        maxWidth: resScale(70),
                                        fontSize: font.size.xs,
                                        ...v.itemTextStyles
                                    }
                                ]}
                            >
                                {v.itemValue}
                            </Text>
                        </View>
                    ))}
            </View>
        </>
    );
}

export default BInvoiceCommonFooter;
