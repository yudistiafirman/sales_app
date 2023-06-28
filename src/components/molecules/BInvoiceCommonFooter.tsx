import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native";
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
            flex: 1,
            alignItems: "center"
        }
    });

    return (
        <>
            <BSpacer size="small" />
            <View style={[styles.container]}>
                {footerItems &&
                    footerItems?.length > 0 &&
                    footerItems?.map((v, i) => (
                        <React.Fragment key={i}>
                            <View
                                style={[styles.item, { ...v.itemViewStyles }]}
                            >
                                <ScrollView horizontal>
                                    <Text
                                        style={[
                                            styles.itemTitle,
                                            { ...v.itemTitleStyles }
                                        ]}
                                    >
                                        {v?.itemTitle}
                                    </Text>
                                </ScrollView>
                                <BSpacer size="extraSmall" />
                                <ScrollView horizontal>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.title,
                                            {
                                                // maxWidth: resScale(70),
                                                fontSize: font.size.xs,
                                                ...v.itemTextStyles
                                            }
                                        ]}
                                    >
                                        {v?.itemValue}
                                    </Text>
                                </ScrollView>
                            </View>
                            <BSpacer size="verySmall" />
                        </React.Fragment>
                    ))}
            </View>
        </>
    );
}

export default BInvoiceCommonFooter;
