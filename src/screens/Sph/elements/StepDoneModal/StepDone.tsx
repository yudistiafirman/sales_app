import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Share,
    Platform,
    Linking
} from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import Modal from "react-native-modal";
import RNPrint from "react-native-print";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { resScale } from "@/utils";
import { RootState } from "@/redux/store";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { resetSPHState } from "@/redux/reducers/SphReducer";
import { postSphResponseType } from "@/interfaces";
import { colors, fonts, layout } from "@/constants";
import {
    BPic,
    BProductCard,
    BSpacer,
    BCompanyMapCard,
    BProjectDetailCard
} from "@/components";
import LabelSuccess from "./elements/LabelSuccess";

const styles = StyleSheet.create({
    modal: { margin: 0 },
    modalStyle: {
        flex: 1,
        justifyContent: "space-between"
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: layout.pad.md
    },
    modalTitle: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: layout.pad.lg,
        paddingVertical: layout.pad.md
    },
    modalFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingVertical: layout.mainPad,
        borderTopColor: colors.border,
        borderTopWidth: resScale(0.5)
    },
    headerText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[700],
        fontSize: fonts.size.lg
    },
    modalContent: {
        flex: 1
    },
    labelSuccess: {
        backgroundColor: colors.chip.green,
        paddingHorizontal: layout.pad.lg,
        paddingVertical: layout.pad.md
    },
    labelText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.xs
    },
    company: {
        backgroundColor: colors.tertiary,
        padding: layout.mainPad
    },
    companyText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.md
    },
    partText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[600],
        fontSize: fonts.size.md
    },
    contentDetail: {
        padding: layout.mainPad,
        flex: 1
    },
    summary: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[300],
        fontSize: fonts.size.sm
    },
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    footerButton: {
        flex: 0.3,
        alignItems: "center"
    },
    footerButtonText: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.sm
    }
});

type StepDoneType = {
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    sphResponse: postSphResponseType | null;
};
const paymentMethod: {
    CBD: "Cash";
    CREDIT: "Credit";
    "": "-";
} = {
    CBD: "Cash",
    CREDIT: "Credit",
    "": "-"
};

type DownloadType = {
    url?: string;
    title?: string;
    downloadPopup: () => void;
    downloadError: (errorMessage: string | unknown) => void;
};

function Separator() {
    return <BSpacer size="extraSmall" />;
}

function downloadPdf({
    url,
    title,
    downloadPopup,
    downloadError
}: DownloadType) {
    const { dirs } = ReactNativeBlobUtil.fs;
    const downloadTitle = title
        ? `${title} berhasil di download`
        : "PDF sph berhasil di download";
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
                      description: "SPH PDF",
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
}

async function printRemotePDF(
    printError: (errorMessage: string | unknown) => void,
    url?: string
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

const openAddressOnMap = (label, lat, lng) => {
    const scheme = Platform.select({
        ios: "maps:0,0?q=",
        android: "geo:0,0?q="
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
};

export default function StepDone({
    isModalVisible,
    setIsModalVisible,
    sphResponse
}: StepDoneType) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const sphState = useSelector((state: RootState) => state.sph);
    const stateCompanyName = sphState.selectedCompany?.Company?.name
        ? sphState.selectedCompany?.Company.name
        : sphState.selectedPic?.name;
    const locationState = sphState.isBillingAddressSame
        ? sphState.selectedCompany?.LocationAddress.line1
        : sphState?.billingAddress.addressAutoComplete.formattedAddress;
    const locationObj = sphState.isBillingAddressSame
        ? sphState.selectedCompany
        : sphState?.billingAddress.addressAutoComplete;

    const shareFunc = async (url?: string) => {
        try {
            if (!url) throw new Error("no url");
            await Share.share({
                url: url.replace(/\s/g, "%20"),
                message: `Link PDF SPH ${stateCompanyName}, ${url.replace(
                    /\s/g,
                    "%20"
                )}`
            });
        } catch (error) {
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        "Terjadi error saat share Link PDF SPH",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    return (
        <Modal
            backdropOpacity={1}
            backdropColor="white"
            hideModalContentWhileAnimating
            coverScreen
            isVisible={isModalVisible}
            style={[
                styles.modal,
                Platform.OS !== "android" && { marginTop: layout.pad.xxl }
            ]}
        >
            <View style={styles.modalStyle}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                            setIsModalVisible((curr) => !curr);
                            dispatch(resetSPHState());
                        }}
                    >
                        <MaterialCommunityIcons
                            name="close"
                            size={resScale(25)}
                            color="#000000"
                        />
                    </TouchableOpacity>
                    <View style={styles.modalTitle}>
                        <Text style={styles.headerText} numberOfLines={1}>
                            {sphResponse?.number}
                        </Text>
                    </View>
                </View>
                <View style={styles.modalContent}>
                    <LabelSuccess sphId={sphResponse?.number} />
                    <BCompanyMapCard
                        companyName={stateCompanyName}
                        location={locationState}
                        onPressLocation={() => {
                            openAddressOnMap(
                                stateCompanyName,
                                locationObj?.locationAddress?.lat,
                                locationObj?.locationAddress?.lon
                            );
                        }}
                        disabled={
                            locationObj?.locationAddress?.lat === null ||
                            locationObj?.locationAddress?.lon === null
                        }
                    />
                    <View style={styles.contentDetail}>
                        <Text style={styles.partText}>PIC</Text>
                        <BSpacer size="extraSmall" />
                        <BPic {...sphState.selectedPic} />
                        <BSpacer size="extraSmall" />
                        <Text style={styles.partText}>Rincian</Text>
                        <BSpacer size="extraSmall" />
                        <BProjectDetailCard
                            productionTime={sphResponse?.createdTime}
                            expiredDate={sphResponse?.expiryTime}
                            status="Diterbitkan"
                            paymentMethod={paymentMethod[sphState.paymentType]}
                            projectName={sphState.selectedCompany?.name}
                        />
                        <BSpacer size="extraSmall" />
                        <Text style={styles.partText}>Produk</Text>
                        <BSpacer size="extraSmall" />
                        <FlashList
                            estimatedItemSize={10}
                            renderItem={({ item }) => (
                                <BProductCard
                                    name={item.product.name}
                                    pricePerVol={+item.sellPrice}
                                    volume={+item.volume}
                                    totalPrice={+item.totalPrice}
                                />
                            )}
                            data={sphState?.chosenProducts}
                            keyExtractor={(item) => item.productId}
                            ItemSeparatorComponent={Separator}
                        />
                    </View>
                </View>
                <View style={styles.modalFooter}>
                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={() =>
                            printRemotePDF((errorMessage: string | unknown) => {
                                dispatch(
                                    openPopUp({
                                        popUpText:
                                            errorMessage || "Gagal print SPH",
                                        popUpType: "error",
                                        outsideClickClosePopUp: true
                                    })
                                );
                            }, sphResponse?.thermalLink)
                        }
                    >
                        <MaterialCommunityIcons
                            name="printer"
                            size={resScale(25)}
                            color={colors.primary}
                        />
                        <Text style={styles.footerButtonText}>Print</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.footerButton}
                        onPress={() => shareFunc(sphResponse?.letterLink)}
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
                                url: sphResponse?.letterLink,
                                title: sphResponse?.number,
                                downloadPopup: () => {
                                    dispatch(
                                        openPopUp({
                                            popUpText:
                                                "Berhasil mendownload SPH",
                                            popUpType: "success",
                                            outsideClickClosePopUp: true
                                        })
                                    );
                                },
                                downloadError: (err) => {
                                    dispatch(
                                        openPopUp({
                                            popUpText:
                                                err || "Gagal mendownload SPH",
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
                        <Text style={styles.footerButtonText}>Download</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
