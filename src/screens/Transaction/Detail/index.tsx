import * as React from "react";
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Share
} from "react-native";
import {
    StackActions,
    useNavigation,
    useRoute
} from "@react-navigation/native";
import {
    BDivider,
    BPic,
    BProductCard,
    BSpacer,
    BCompanyMapCard,
    BProjectDetailCard,
    BNestedProductCard,
    BDepositCard
} from "@/components";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { colors, fonts, layout } from "@/constants";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { ScrollView } from "react-native-gesture-handler";
import {
    beautifyPhoneNumber,
    getAvailableDepositProject
} from "@/utils/generalFunc";
import moment from "moment";
import { LOCATION, TRANSACTION_DETAIL } from "@/navigation/ScreenNames";
import crashlytics from "@react-native-firebase/crashlytics";
import { getVisitationOrderByID } from "@/actions/OrderActions";
import { QuotationRequests } from "@/interfaces/CreatePurchaseOrder";
import { PO_METHOD_LIST } from "@/constants/dropdown";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import ReactNativeBlobUtil from "react-native-blob-util";
import RNPrint from "react-native-print";
import { resScale } from "@/utils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

const styles = StyleSheet.create({
    modalFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: layout.mainPad,
        borderTopColor: colors.border,
        borderTopWidth: resScale(0.5)
        // flex: 1,
        // backgroundColor: "blue"
    },
    footerButton: {
        flex: 0.3,
        alignItems: "center"
    },
    footerButtonText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.sm
    },
    parent: {
        flex: 1
    },
    flexRow: {
        flexDirection: "row"
    },
    leftSide: {
        flex: 1
    },
    icon: {
        alignSelf: "center"
    },
    containerLastOrder: {
        padding: layout.pad.lg,
        borderRadius: layout.radius.md,
        backgroundColor: colors.tertiary,
        borderColor: colors.border.default,
        borderWidth: 1
    },
    titleLastOrder: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.sm,
        color: colors.text.darker
    },
    valueLastOrder: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[600],
        fontSize: fonts.size.sm,
        marginLeft: layout.pad.xl
    },
    contentDetail: {
        padding: layout.mainPad,
        flex: 1
    },
    partText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[600],
        fontSize: fonts.size.md
    }
});

function ListProduct(
    item: any,
    index: number,
    selectedType: string,
    quantity: number | undefined,
    isPoData: boolean
) {
    /* eslint-disable @typescript-eslint/naming-convention */
    const {
        ReqProduct,
        Product,
        offering_price,
        offeringPrice,
        unit,
        total_price,
        totalPrice,
        requestedQuantity,
        category
    } = item;
    /* eslint-enable @typescript-eslint/naming-convention */
    let displayName = "";
    let pricePerlVol;
    if (ReqProduct) {
        displayName = `${
            ReqProduct?.product?.category?.parent
                ? `${ReqProduct?.product?.category?.parent?.name} `
                : ""
        }${ReqProduct?.product?.displayName} ${
            ReqProduct?.product?.category
                ? ReqProduct?.product?.category?.name
                : ""
        }`;
        pricePerlVol = ReqProduct?.offeringPrice;
    } else if (Product) {
        displayName = `${
            Product?.category?.parent?.name
                ? `${Product?.category?.parent?.name} `
                : Product?.category?.parent?.na
                ? `${Product?.category?.parent?.na} `
                : ""
        }${Product?.displayName} ${
            Product?.category ? Product?.category?.name : ""
        }`;
        pricePerlVol = offering_price || offeringPrice;
    } else {
        displayName = `${
            category?.parent ? `${category?.parent?.name} ` : ""
        }${displayName} ${category ? category?.name : ""}`;
        pricePerlVol = offering_price || offeringPrice;
    }

    return (
        <View key={index}>
            <BProductCard
                name={displayName}
                pricePerVol={pricePerlVol}
                volume={quantity || requestedQuantity || quantity || 0}
                totalPrice={
                    isPoData
                        ? requestedQuantity * (ReqProduct?.offeringPrice || 0)
                        : ReqProduct
                        ? ReqProduct?.totalPrice
                        : total_price || totalPrice
                }
                unit={ReqProduct?.product ? ReqProduct?.product?.unit : unit}
                hideTotal={
                    !(selectedType !== "Jadwal" && selectedType !== "DO")
                }
                hidePricePerVolume={
                    !(selectedType !== "Jadwal" && selectedType !== "DO")
                }
            />
            <BSpacer size="extraSmall" />
        </View>
    );
}

function TransactionDetail() {
    const navigation = useNavigation();
    const route = useRoute<RootStackScreenProps>();
    const data = route?.params?.data;
    const selectedType = route?.params?.type;
    const dispatch = useDispatch<AppDispatch>();
    const [expandData, setExpandData] = React.useState<any[]>([]);
    const [downloadFiles, setDownloadFiles] = React.useState<any>(null);

    useHeaderTitleChanged({
        title: route?.params?.title ? route?.params?.title : "-"
    });

    React.useEffect(() => {
        crashlytics().log(TRANSACTION_DETAIL);
    }, []);

    React.useEffect(() => {
        if (selectedType === "SO") {
            if (data?.PurchaseOrderDocs) {
                setDownloadFiles({
                    letter: data?.PurchaseOrderDocs?.find(
                        (v: any) => v?.type === "BRIK_SIGNED"
                    )
                });
            }
        } else if (selectedType === "Deposit") {
            if (data?.PaymentFiles) {
                // TODO: need to change the type to download the deposit files
                setDownloadFiles({
                    letter: data?.PaymentFiles?.find((v: any) => v?.type === "")
                });
            }
        } else if (data?.QuotationLetterFiles) {
            setDownloadFiles({
                pos: data?.QuotationLetterFiles?.find(
                    (v: any) => v?.type === "POS"
                ),
                letter: data?.QuotationLetterFiles?.find(
                    (v: any) => v?.type === "LETTER"
                )
            });
        }
    }, [data]);

    const onPressLocation = (lat: number, lon: number) => {
        navigation.navigate(LOCATION, {
            coordinate: {
                latitude: Number(lat), // -6.1993922
                longitude: Number(lon) // 106.7626047
            },
            isReadOnly: true,
            from: TRANSACTION_DETAIL
        });
    };

    const gotoSPHPage = async () => {
        try {
            let getData;
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpText: "Mendapatkan data SPH",
                    highlightedText: "detail",
                    outsideClickClosePopUp: false
                })
            );
            getData = await getVisitationOrderByID(data.QuotationLetter.id);
            getData = getData.data.data;
            dispatch(closePopUp());
            navigation.dispatch(
                StackActions.replace(TRANSACTION_DETAIL, {
                    title: getData ? getData.number : "N/A",
                    data: getData,
                    type: selectedType
                })
            );
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        "Terjadi error saat pengambilan SPH data",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    const arrayQuotationLetter = () => {
        const arrayQuote: QuotationRequests[] = [];
        arrayQuote.push(data?.QuotationLetter?.QuotationRequest);
        return arrayQuote;
    };

    const onExpand = (index: number, productData: any) => {
        let newExpandedData;
        const isExisted = expandData?.findIndex(
            (val) => val?.id === productData?.id
        );
        if (isExisted === -1) {
            newExpandedData = [...expandData, productData];
        } else {
            newExpandedData = expandData.filter(
                (val) => val?.id !== productData?.id
            );
        }
        setExpandData(newExpandedData);
    };

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
    async function printRemotePDF(
        url?: string,
        printError?: (errorMessage: string | unknown) => void
    ) {
        try {
            if (!url) {
                throw new Error("error url missing");
            }
            await RNPrint.print({
                filePath: url
            });
        } catch (error) {
            printError(error?.message);
        }
    }
    const shareFunc = async (url?: string) => {
        try {
            if (!url) throw new Error("no url");
            await Share.share({
                url: url.replace(/\s/g, "%20"),
                message: `Link PDF ${selectedType} ${
                    data?.Company?.name ? data?.Company.name : data?.Pic?.name
                }, ${url.replace(/\s/g, "%20")}`
            });
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        `Terjadi error saat share Link PDF ${selectedType}`,
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    const renderRequestedProducts = () => {
        const productData = data?.QuotationRequest?.RequestedProducts
            ? data?.QuotationRequest?.RequestedProducts
            : data?.PoProducts
            ? data?.PoProducts
            : data?.SaleOrder?.PoProduct?.RequestedProduct
            ? data?.SaleOrder?.PoProduct?.RequestedProduct
            : data?.Schedule?.SaleOrder?.PoProduct?.RequestedProduct;

        if (productData?.length > 0) {
            return productData.map((item, index) =>
                ListProduct(
                    item,
                    index,
                    selectedType,
                    selectedType === "PO" || selectedType === "SO"
                        ? data?.requestedQuantity
                        : data?.quantity
                        ? data?.quantity
                        : data?.Schedule?.quantity,
                    data?.PoProducts?.length > 0
                )
            );
        }
        return ListProduct(productData, 0, selectedType, data?.quantity, false);
    };

    const renderProductList = () => {
        if (
            data?.QuotationRequest?.RequestedProducts ||
            data?.PoProducts ||
            data?.SaleOrder?.PoProduct?.RequestedProduct ||
            data?.Schedule?.SaleOrder?.PoProduct?.RequestedProduct
        ) {
            return (
                <>
                    <Text style={styles.partText}>Produk</Text>
                    <BSpacer size="extraSmall" />
                    {renderRequestedProducts()}
                    <BSpacer size="small" />
                </>
            );
        }
        return null;
    };
    const renderPic = () => {
        let picData =
            data?.Pic || data?.project?.Pic || data?.Account?.Project?.mainPic;

        if (selectedType === "SPH") {
            picData =
                data?.QuotationRequest?.Pic ||
                data?.QuotationRequest?.project?.Pic;
        }

        if (picData) {
            return (
                <>
                    <Text style={styles.partText}>PIC</Text>
                    <BSpacer size="extraSmall" />
                    <BPic
                        name={picData?.name}
                        position={picData?.position}
                        phone={beautifyPhoneNumber(picData?.phone)}
                        email={picData?.email}
                    />
                    <BSpacer size="small" />
                </>
            );
        }
        return null;
    };

    return (
        <SafeAreaView style={styles.parent}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {(data?.project?.LocationAddress ||
                    data?.project?.ShippingAddress ||
                    data?.QuotationRequest?.project?.LocationAddress ||
                    data?.QuotationRequest?.project?.ShippingAddress ||
                    data?.Account?.Project?.ShippingAddress) && (
                    <BCompanyMapCard
                        onPressLocation={() =>
                            onPressLocation(
                                data?.QuotationRequest?.project?.ShippingAddress
                                    ? data?.QuotationRequest?.project
                                          ?.ShippingAddress.lat
                                    : data?.project?.ShippingAddress
                                    ? data?.project?.ShippingAddress.lat
                                    : data?.Account?.Project?.ShippingAddress
                                          .lat
                                    ? data?.Account?.Project?.ShippingAddress
                                          .lat
                                    : null,
                                data?.QuotationRequest?.project?.ShippingAddress
                                    .lon
                                    ? data?.QuotationRequest?.project
                                          ?.ShippingAddress.lon
                                    : data?.project?.ShippingAddress
                                    ? data?.project?.ShippingAddress.lon
                                    : data?.Account?.Project?.ShippingAddress
                                          .lon
                                    ? data?.Account?.Project?.ShippingAddress
                                          .lon
                                    : null
                            )
                        }
                        disabled={
                            data?.project?.ShippingAddress?.lat === null ||
                            data?.project?.ShippingAddress?.lon === null ||
                            data?.QuotationRequest?.project?.ShippingAddress
                                .lat === null ||
                            data?.QuotationRequest?.project?.ShippingAddress
                                .lon === null ||
                            data?.Account?.Project?.ShippingAddress.lon === null
                        }
                        companyName={
                            data?.project?.displayName ||
                            data?.QuotationRequest?.project?.displayName ||
                            data?.Account?.Customer?.displayName
                        }
                        location={
                            data?.QuotationRequest?.project?.ShippingAddress
                                .line1
                                ? data?.QuotationRequest?.project
                                      ?.ShippingAddress.line1
                                : data?.project?.ShippingAddress.line1
                                ? data?.project?.ShippingAddress.line1
                                : data?.Account?.Project?.ShippingAddress.line1
                                ? data?.Account?.Project?.ShippingAddress.line1
                                : "-"
                        }
                    />
                )}
                <View style={styles.contentDetail}>
                    {renderPic()}
                    <Text style={styles.partText}>Rincian</Text>
                    <BSpacer size="extraSmall" />
                    <BProjectDetailCard
                        status={data?.status || data?.QuotationRequest?.status}
                        paymentMethod={
                            selectedType === "SPH" ||
                            selectedType === "PO" ||
                            selectedType === "SO"
                                ? !data?.paymentType &&
                                  !data?.QuotationRequest?.paymentType
                                    ? "N/A"
                                    : data?.paymentType === "CBD" ||
                                      data?.QuotationRequest?.paymentType ===
                                          "CBD"
                                    ? "Cash"
                                    : "Debit"
                                : undefined
                        }
                        expiredDate={
                            data?.expiredDate || data?.expiryDate
                                ? moment(
                                      data?.expiredDate || data?.expiryDate
                                  ).format("DD MMMM yyyy")
                                : "-"
                        }
                        projectName={
                            selectedType === "SPH" ||
                            selectedType === "PO" ||
                            selectedType === "SO"
                                ? data?.project?.projectName ||
                                  data?.QuotationRequest?.project
                                      ?.projectName ||
                                  data?.Account?.Project?.name
                                : undefined
                        }
                        productionTime={
                            selectedType === "DO"
                                ? data?.date
                                    ? moment(data?.date).format(
                                          "DD MMM yyyy HH:mm"
                                      )
                                    : "-"
                                : data?.createdAt
                                ? moment(data?.createdAt).format(
                                      "DD MMM yyyy HH:mm"
                                  )
                                : "-"
                        }
                        quotation={
                            selectedType === "PO" || selectedType === "SO"
                                ? data?.QuotationLetter
                                : undefined
                        }
                        nominal={data?.value ? data?.value : data?.amount}
                        paymentDate={
                            data?.datePayment
                                ? moment(data?.datePayment).format(
                                      "DD MMM yyyy"
                                  )
                                : data?.paymentDate
                                ? moment(data?.paymentDate).format(
                                      "DD MMM yyyy"
                                  )
                                : undefined
                        }
                        deliveryDate={
                            selectedType === "Jadwal" && data?.date
                                ? moment(data?.date).format("DD MMM yyyy")
                                : undefined
                        }
                        deliveryTime={
                            selectedType === "Jadwal" && data?.date
                                ? moment(data?.date).format("HH:mm")
                                : undefined
                        }
                        deliveredQty={data?.deliveredQuantity}
                        scheduleMethod={data?.pouringMethod}
                        gotoSPHPage={() => gotoSPHPage()}
                        tmNumber={route?.params?.vehicleName}
                        driverName={route?.params?.driverName}
                        consecutive={
                            selectedType === "Jadwal"
                                ? data?.consecutive
                                : undefined
                        }
                        technical={
                            selectedType === "Jadwal"
                                ? data?.withTechnician
                                : undefined
                        }
                        useBEStatus={selectedType !== "SPH"}
                    />
                    <BSpacer size="small" />
                    {selectedType === "Deposit" && data?.PurchaseOrder ? (
                        <BNestedProductCard
                            withoutHeader={false}
                            data={arrayQuotationLetter()}
                            expandData={expandData}
                            onExpand={onExpand}
                            withoutSeparator
                            poNumber={data?.PurchaseOrder?.number}
                        />
                    ) : (
                        <>{renderProductList()}</>
                    )}
                    {((selectedType === "Deposit" && data?.PurchaseOrder) ||
                        selectedType === "Jadwal") && (
                        <>
                            <BDivider />
                            <BSpacer size="small" />
                            <BDepositCard
                                firstSectionText={
                                    selectedType === "Jadwal"
                                        ? data?.project?.Customer
                                              ?.paymentType === "CBD" ||
                                          data?.project?.Customer
                                              ?.paymentType === null ||
                                          data?.project?.Customer
                                              ?.paymentType === undefined
                                            ? "Deposit"
                                            : "Kredit"
                                        : data?.project?.Customer
                                              ?.paymentType === "CBD" ||
                                          data?.project?.Customer
                                              ?.paymentType === null ||
                                          data?.project?.Customer
                                              ?.paymentType === undefined
                                        ? "Deposit Awal"
                                        : "Kredit Awal"
                                }
                                firstSectionValue={
                                    selectedType === "Jadwal"
                                        ? getAvailableDepositProject(
                                              data.project,
                                              true
                                          )
                                        : data?.PurchaseOrder?.totalDeposit
                                        ? data?.PurchaseOrder?.totalDeposit
                                        : 0
                                }
                                secondSectionText={
                                    selectedType === "Jadwal"
                                        ? data?.products &&
                                          data?.products.length > 0
                                            ? data?.products[0].displayName
                                            : "-"
                                        : data?.project?.Customer
                                              ?.paymentType === "CBD" ||
                                          data?.project?.Customer
                                              ?.paymentType === null ||
                                          data?.project?.Customer
                                              ?.paymentType === undefined
                                        ? "Tambahan Deposit"
                                        : "Tambahan Kredit"
                                }
                                secondSectionValue={
                                    selectedType === "Jadwal"
                                        ? data?.products &&
                                          data?.products.length > 0
                                            ? data?.products[0].totalPrice
                                            : 0
                                        : data?.value
                                        ? data?.value
                                        : 0
                                }
                                thirdSectionText={
                                    selectedType === "Jadwal"
                                        ? data?.project?.Customer
                                              ?.paymentType === "CBD" ||
                                          data?.project?.Customer
                                              ?.paymentType === null ||
                                          data?.project?.Customer
                                              ?.paymentType === undefined
                                            ? "Est. Sisa Deposit"
                                            : "Est. Sisa Kredit"
                                        : data?.project?.Customer
                                              ?.paymentType === "CBD" ||
                                          data?.project?.Customer
                                              ?.paymentType === null ||
                                          data?.project?.Customer
                                              ?.paymentType === undefined
                                        ? "Deposit Akhir"
                                        : "Kredit Akhir"
                                }
                                isSum={selectedType !== "Jadwal"}
                            />
                        </>
                    )}
                </View>
                {downloadFiles && (
                    <View style={styles.modalFooter}>
                        {downloadFiles?.pos && (
                            <TouchableOpacity
                                style={styles.footerButton}
                                onPress={() =>
                                    printRemotePDF(
                                        downloadFiles.pos?.File?.url,
                                        (errorMessage: string | unknown) => {
                                            dispatch(
                                                openPopUp({
                                                    popUpText:
                                                        errorMessage ||
                                                        `Gagal print ${selectedType}`,
                                                    popUpType: "error",
                                                    outsideClickClosePopUp: true
                                                })
                                            );
                                        }
                                    )
                                }
                            >
                                <MaterialCommunityIcons
                                    name="printer"
                                    size={resScale(25)}
                                    color={colors.primary}
                                />
                                <Text style={styles.footerButtonText}>
                                    Print
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={styles.footerButton}
                            onPress={() =>
                                shareFunc(downloadFiles?.letter?.File?.url)
                            }
                        >
                            <MaterialCommunityIcons
                                name="share-variant-outline"
                                size={resScale(25)}
                                color={colors.primary}
                            />
                            <Text style={styles.footerButtonText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.footerButton}
                            onPress={() =>
                                downloadPdf({
                                    url: downloadFiles?.letter?.File?.url,
                                    title: data?.number,
                                    downloadPopup: () => {
                                        dispatch(
                                            openPopUp({
                                                popUpText: `Berhasil mendownload ${selectedType}`,
                                                popUpType: "success",
                                                outsideClickClosePopUp: true
                                            })
                                        );
                                    },
                                    downloadError: (err) => {
                                        dispatch(
                                            openPopUp({
                                                popUpText:
                                                    err ||
                                                    `Gagal mendownload ${selectedType}`,
                                                popUpType: "error",
                                                outsideClickClosePopUp: true
                                            })
                                        );
                                    }
                                })
                            }
                        >
                            <Feather
                                name="download"
                                size={resScale(25)}
                                color={colors.primary}
                            />
                            <Text style={styles.footerButtonText}>
                                Download
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default TransactionDetail;
