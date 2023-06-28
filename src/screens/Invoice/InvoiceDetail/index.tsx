import { BChip, BSpacer, BSvg, BTouchableText } from "@/components";
import SvgNames from "@/components/atoms/BSvg/svgName";
import BInvoiceCommonFooter, {
    IFooterItems
} from "@/components/molecules/BInvoiceCommonFooter";
import { colors, layout } from "@/constants";
import font from "@/constants/fonts";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getOneInvoice } from "@/actions/FinanceActions";
import { useDispatch, useSelector } from "react-redux";
import { openPopUp } from "@/redux/reducers/modalReducer";
import {
    formatRawDateToMonthDateYear,
    formatRawDateToMonthDateYearWithSlashed,
    translatePaymentStatus
} from "@/utils/generalFunc";

import formatCurrency from "@/utils/formatCurrency";
import { InvoiceDetailTypeData } from "@/models/Invoice";
import { CUSTOMER_DETAIL } from "@/navigation/ScreenNames";
import { resScale } from "@/utils";
import ReactNativeBlobUtil from "react-native-blob-util";
import { RootState } from "@/redux/store";
import InvoiceDetailLoader from "./InvoiceDetailLoader";

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
        flex: 1
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
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [invoiceDetailData, setInvoiceDetailData] =
        useState<InvoiceDetailTypeData | null>(null);
    const authState = useSelector((state: RootState) => state.auth);

    type DownloadType = {
        url?: string;
        title?: string;
        downloadPopup: () => void;
        downloadError: (errorMessage: string | unknown) => void;
    };

    const downloadPdf = ({
        url,
        title,
        downloadPopup,
        downloadError
    }: DownloadType) => {
        if (!url) {
            downloadError(undefined);
            return null;
        }
        const { dirs } = ReactNativeBlobUtil.fs;
        const downloadTitle = title
            ? `${title} berhasil di download`
            : "PDF berhasil di download";
        ReactNativeBlobUtil.config(
            Platform.OS === "android"
                ? {
                      // add this option that makes response data to be stored as a file,
                      // this is much more performant.
                      fileCache: true,
                      path: dirs.DocumentDir,
                      addAndroidDownloads: {
                          useDownloadManager: true,
                          notification: true,
                          title: downloadTitle,
                          description: `${selectedType} PDF`,
                          mediaScannable: true
                      }
                  }
                : { fileCache: true }
        )
            .fetch("GET", url, {
                // some headers ..
            })
            .then((res) => {
                // the temp file path
                downloadPopup();
            })
            .catch((err) => {
                downloadError(err.message);
            });

        return null;
    };
    // useCustomHeaderRight({
    //     customHeaderRight: (
    //         <BTouchableText
    //             onPress={() =>
    //                 downloadPdf({
    //                     url: invoiceDetailData?.File?.url,
    //                     title: route.params.invoiceNo,
    //                     downloadPopup: () => {
    //                         dispatch(
    //                             openPopUp({
    //                                 popUpText: `Berhasil mendownload`,
    //                                 popUpType: "success",
    //                                 outsideClickClosePopUp: true
    //                             })
    //                         );
    //                     },
    //                     downloadError: (err) => {
    //                         dispatch(
    //                             openPopUp({
    //                                 popUpText: err || `Gagal mendownload`,
    //                                 popUpType: "error",
    //                                 outsideClickClosePopUp: true
    //                             })
    //                         );
    //                     }
    //                 })
    //             }
    //             title="Unduh Tagihan"
    //             textStyle={styles.touchableText}
    //         />
    //     )
    // });

    useHeaderTitleChanged({
        title: route?.params?.invoiceNo ? route?.params?.invoiceNo : "-",
        selectedBP: authState.selectedBatchingPlant
    });

    const getOneInvoiceData = async () => {
        try {
            setLoading(true);
            const invoiceId = route?.params?.invoiceId;

            const response = await getOneInvoice(invoiceId);
            if (response?.data?.success) {
                setLoading(false);
                setInvoiceDetailData(response?.data?.data);
            } else {
                setLoading(false);
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        highlightedText: "Error",
                        popUpText: "Error Saat Mengambil Data Customer detail",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            setLoading(false);
            dispatch(
                openPopUp({
                    popUpType: "error",
                    highlightedText: "Error",
                    popUpText: error?.message
                        ? error?.message
                        : "Error Saat Mengambil Data Customer detail",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    const defineFlexGrowth = () => {
        let flex = 0;
        if (
            invoiceDetailData?.DeliveryOrders &&
            invoiceDetailData?.paymentType
        ) {
            if (
                invoiceDetailData?.paymentType === "CREDIT" &&
                invoiceDetailData?.DeliveryOrders.length > 0
            ) {
                flex = 0.6;
            } else if (invoiceDetailData?.paymentType === "CREDIT") {
                flex = 0.6;
            } else {
                flex = 0;
            }
        }
        return flex;
    };

    useEffect(() => {
        getOneInvoiceData();
    }, []);

    const renderListHorizontalDate = () => {
        const paymentDuration = invoiceDetailData?.paymentDuration
            ? `${invoiceDetailData?.paymentDuration} hari`
            : "-";
        const issuedDate = invoiceDetailData?.issuedDate
            ? formatRawDateToMonthDateYear(invoiceDetailData?.issuedDate)
            : "-";

        const dueDateDiffer = () => {
            let defaultTextDays = "-";
            if (
                invoiceDetailData?.dueDateDifference &&
                invoiceDetailData?.status !== "PAID"
            ) {
                defaultTextDays =
                    invoiceDetailData?.dueDateDifference?.toString();
                defaultTextDays += " hari";
            }
            return defaultTextDays;
        };

        const dueDateDifferColor = () => {
            let color = colors.text.darker;
            if (
                invoiceDetailData?.dueDateDifference &&
                invoiceDetailData?.status !== "PAID"
            ) {
                if (invoiceDetailData?.dueDateDifference < 0) {
                    color = colors.primary;
                } else if (
                    invoiceDetailData?.dueDateDifference >= 0 &&
                    invoiceDetailData?.dueDateDifference < 7
                ) {
                    color = colors.text.secYellow;
                } else {
                    color = colors.greenLantern;
                }
            }
            return color;
        };

        const footerItems = [
            {
                itemTitle: "Jatuh Tempo",
                itemValue: paymentDuration
            },
            {
                itemTitle: "Tanggal Tagih",
                itemValue: issuedDate,
                itemTextStyle: {
                    fontSize: font.size.sm
                }
            },
            {
                itemTitle: "Lewat Jatuh Tempo",
                itemValue: dueDateDiffer(),
                itemTextStyles: {
                    color: dueDateDifferColor()
                }
            },
            {
                itemTitle: "Tanggal Jatuh Tempo",
                itemValue: invoiceDetailData?.dueDate
                    ? formatRawDateToMonthDateYear(invoiceDetailData?.dueDate)
                    : "-"
            }
        ];

        return <BInvoiceCommonFooter footerItems={footerItems} />;
    };

    const renderDoCardFooter = (footerItems: IFooterItems[]) => (
        <BInvoiceCommonFooter footerItems={footerItems} />
    );

    const renderDoCard = useCallback((item) => {
        const doNumber = item?.number ? item?.number : "-";
        const doDate = item?.date
            ? formatRawDateToMonthDateYearWithSlashed(item?.date)
            : "-";
        const additionalPrice = item?.additionalPrice
            ? item?.additionalPrice
            : 0;

        const footerItems = [
            {
                itemTitle: "Produk",
                itemValue: item?.SO?.PoProd?.ReqProd?.Product?.displayName
                    ? item?.SO?.PoProd?.ReqProd?.Product?.displayName
                    : "-",
                itemTitleStyles: {
                    alignSelf: "flex-start"
                }
            },
            {
                itemTitle: "Volume",
                itemValue:
                    item?.quantity && item?.SO?.PoProd?.ReqProd?.Product?.unit
                        ? `${
                              item?.quantity
                          } ${item?.SO?.PoProd?.ReqProd?.Product?.unit?.toLowerCase()}`
                        : "-"
            },
            {
                itemTitle: "Harga Unit",
                itemValue: formatCurrency(
                    item?.SO?.PoProd?.ReqProd?.offeringPrice || 0
                )
            },
            {
                itemTitle: "Ekstra",
                itemValue: formatCurrency(additionalPrice)
            },
            {
                itemTitle: "Total",
                itemValue:
                    item?.SO?.PoProd?.ReqProd?.offeringPrice !== undefined &&
                    item?.quantity !== undefined &&
                    item?.additionalPrice !== undefined
                        ? formatCurrency(
                              (item?.quantity || 0) *
                                  (item?.SO?.PoProd?.ReqProd?.offeringPrice ||
                                      0) +
                                  (item?.additionalPrice || 0)
                          )
                        : 0,
                itemTitleStyles: { alignSelf: "flex-end" }
            }
        ];
        return (
            <View style={{ ...styles.cardContainer }}>
                <View style={styles.textContainer}>
                    <Text style={[styles.title]}>{doNumber}</Text>
                    <Text style={[styles.text, { fontSize: font.size.xs }]}>
                        {doDate}
                    </Text>
                </View>

                {renderDoCardFooter(footerItems)}
            </View>
        );
    }, []);

    const renderInvoiceDetailFooter = () => {
        const totalAmount = formatCurrency(invoiceDetailData?.total || 0);
        const amountPaid = formatCurrency(invoiceDetailData?.amountPaid || 0);
        const amountDue = formatCurrency(invoiceDetailData?.amountDue || 0);

        return (
            <View style={{ flex: 0.4 }}>
                <View style={[styles.textContainer]}>
                    <Text style={[styles.title, { fontSize: font.size.md }]}>
                        Jumlah Tagihan
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            {
                                fontSize: font.size.md,
                                fontFamily: font.family.montserrat[600],
                                maxWidth: resScale(160)
                            }
                        ]}
                    >
                        {totalAmount}
                    </Text>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>Jumlah Terbayar</Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            { fontSize: font.size.md, maxWidth: resScale(160) }
                        ]}
                    >
                        {amountPaid}
                    </Text>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={[styles.title, { fontSize: font.size.md }]}>
                        Jumlah Terhutang
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            {
                                fontSize: font.size.md,
                                fontFamily: font.family.montserrat[600],
                                maxWidth: resScale(160)
                            }
                        ]}
                    >
                        {amountDue}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return <InvoiceDetailLoader />;
    }

    return (
        <View style={{ flex: 1 }}>
            <View
                style={[
                    styles.container,
                    {
                        flex: defineFlexGrowth()
                    }
                ]}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Status</Text>
                    <BChip
                        type="default"
                        textColor={colors.text.blue}
                        titleWeight="700"
                        marginRight={0}
                        backgroundColor={colors.status.lightBlue}
                    >
                        {invoiceDetailData?.status
                            ? translatePaymentStatus(invoiceDetailData?.status)
                            : "-"}
                    </BChip>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>Pelanggan</Text>
                    <BTouchableText
                        onPress={() =>
                            navigation.navigate(CUSTOMER_DETAIL, {
                                id: invoiceDetailData?.Project?.Customer?.id
                            })
                        }
                        title={
                            invoiceDetailData?.Project?.Customer?.displayName
                                ? invoiceDetailData?.Project?.Customer
                                      ?.displayName
                                : "-"
                        }
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
                        {invoiceDetailData?.paymentType === "CREDIT"
                            ? "Credit"
                            : "Cash"}
                    </BChip>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>No. SPH </Text>
                    <Text style={[styles.title, { fontSize: font.size.md }]}>
                        -
                    </Text>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>No. Purchase Order (PO) </Text>
                    <Text style={[styles.title, { fontSize: font.size.md }]}>
                        -
                    </Text>
                </View>
                <BSpacer size="extraSmall" />
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>No. Sales Order (SO) </Text>
                    <Text style={[styles.title, { fontSize: font.size.md }]}>
                        -
                    </Text>
                </View>
                <BSpacer size="extraSmall" />
                <View style={styles.divider} />
                {invoiceDetailData?.paymentType === "CREDIT"
                    ? renderListHorizontalDate()
                    : null}
            </View>
            <View style={[styles.listDoContainer]}>
                <View style={[styles.textContainer]}>
                    <Text style={styles.text}>DO </Text>
                    <BSpacer size="medium" />
                    {invoiceDetailData?.DeliveryOrders &&
                    invoiceDetailData?.DeliveryOrders?.length > 0 ? (
                        <TouchableWithoutFeedback
                            onPress={() => setExpand(!expand)}
                        >
                            <Icon
                                name={expand ? "chevron-up" : "chevron-down"}
                                size={25}
                                color={colors.icon.darkGrey}
                            />
                        </TouchableWithoutFeedback>
                    ) : (
                        <Text>-</Text>
                    )}
                </View>
                {invoiceDetailData?.DeliveryOrders &&
                    invoiceDetailData?.DeliveryOrders?.length > 0 &&
                    expand && (
                        <View
                            style={{
                                flex:
                                    invoiceDetailData?.DeliveryOrders
                                        ?.length === 1
                                        ? 0.3
                                        : 0.6
                            }}
                        >
                            <FlashList
                                data={
                                    invoiceDetailData?.DeliveryOrders?.length >
                                    0
                                        ? invoiceDetailData?.DeliveryOrders
                                        : []
                                }
                                renderItem={({ item, index }) =>
                                    expand ? renderDoCard(item, index) : null
                                }
                                estimatedItemSize={10}
                            />
                        </View>
                    )}
                <View style={styles.divider} />
                <BSpacer size="extraSmall" />
                {renderInvoiceDetailFooter()}
            </View>
        </View>
    );
}

export default InvoiceDetail;
