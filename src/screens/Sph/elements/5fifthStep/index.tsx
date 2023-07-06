import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Platform
} from "react-native";
import React, { useContext, useState } from "react";
import {
    BBackContinueBtn,
    BContainer,
    BForm,
    BPic,
    BSpacer,
    BProductCard,
    BVisitationCard
} from "@/components";
import { resScale } from "@/utils";
import { colors, fonts, layout } from "@/constants";
import {
    deliveryAndDistance,
    Input,
    postSphResponseType,
    requestedProductsType,
    shippingAddressType,
    sphOrderPayloadType,
    SphStateInterface
} from "@/interfaces";
import BSheetAddPic from "@/screens/Visitation/elements/second/BottomSheetAddPic";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import crashlytics from "@react-native-firebase/crashlytics";
import { SPH } from "@/navigation/ScreenNames";
import {
    updateSelectedCompany,
    updateSelectedPic,
    updateUploadedAndMappedRequiredDocs,
    updateUseHighway
} from "@/redux/reducers/SphReducer";
import { FlashList } from "@shopify/flash-list";
import { DEFAULT_ESTIMATED_LIST_SIZE } from "@/constants/general";
import {
    safetyCheck,
    shouldAllowSPHStateToContinue
} from "@/utils/generalFunc";
import { uploadFileImage } from "@/actions/CommonActions";
import { postSph } from "@/actions/OrderActions";
import StepDone from "../StepDoneModal/StepDone";
import { SphContext } from "../context/SphContext";
import ChoosePicModal from "../ChoosePicModal";

const style = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    picLable: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    picText: {
        fontFamily: fonts.family.montserrat[600],
        fontSize: fonts.size.md,
        color: colors.text.darker
    },
    gantiPicText: {
        fontFamily: fonts.family.montserrat[300],
        fontSize: fonts.size.sm,
        color: colors.primary
    },
    produkLabel: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border.altGrey,
        paddingBottom: layout.pad.sm
    }
});

function countNonNullValues(array) {
    let count = 0;
    if (array)
        for (let i = 0; i < array?.length; i += 1) {
            if (array[i] !== null) {
                count += 1;
            }
        }
    return count;
}

function payloadMapper(sphState: SphStateInterface) {
    const payload = {
        shippingAddress: {} as shippingAddressType,
        requestedProducts: [] as requestedProductsType[],
        delivery: {} as deliveryAndDistance,
        distance: {} as deliveryAndDistance,
        billingAddress: {}
    } as sphOrderPayloadType;
    const { selectedCompany, projectAddress } = sphState;
    const LocationAddress = selectedCompany?.LocationAddress;

    if (sphState?.chosenProducts && sphState?.chosenProducts?.length > 0) {
        // harcode m3
        payload.requestedProducts = sphState?.chosenProducts?.map(
            (product) => ({
                productId: product?.productId,
                categoryId: product?.categoryId,
                offeringPrice: product?.sellPrice
                    ? +product.sellPrice
                    : product?.additionalData?.delivery?.price,
                quantity: product?.volume && +product.volume,
                pouringMethod: product?.pouringMethod,
                productName: product?.product?.name,
                productUnit: "m3"
            })
        );

        payload.distance.id =
            sphState?.chosenProducts[0]?.additionalData?.distance?.id;
        payload.distance.price =
            sphState?.chosenProducts[0]?.additionalData?.distance?.price;

        if (sphState?.distanceFromLegok) {
            payload.distance.userDistance = Math.ceil(
                sphState?.distanceFromLegok || 0 / 1000
            );
        }
        // find highest delivery
        const deliveries: deliveryAndDistance[] = [];
        sphState?.chosenProducts?.forEach((prod) => {
            deliveries?.push(prod?.additionalData?.delivery);
        });
        const highestPrice = deliveries?.reduce((prev, curr) =>
            prev?.price > curr?.price ? prev : curr
        );
        payload.delivery = highestPrice;
    }

    if (LocationAddress) {
        if (LocationAddress?.id) {
            payload.shippingAddress.id = LocationAddress?.id;
        }
    }
    if (projectAddress) {
        if (projectAddress?.city) {
            payload.shippingAddress.city = projectAddress?.city;
        }
        if (projectAddress?.district) {
            payload.shippingAddress.district = projectAddress?.district;
        }
        if (safetyCheck(projectAddress?.lat)) {
            payload.shippingAddress.lat = projectAddress?.lat?.toString();
        }
        if (safetyCheck(projectAddress?.lon)) {
            payload.shippingAddress.lon = projectAddress?.lon?.toString();
        }
        if (projectAddress?.formattedAddress) {
            if (sphState?.useSearchAddress) {
                payload.shippingAddress.line1 = sphState?.searchedAddress;
            } else {
                payload.shippingAddress.line1 =
                    projectAddress?.formattedAddress;
            }
        }
        if (projectAddress?.rural) {
            payload.shippingAddress.rural = projectAddress?.rural;
        }
        if (projectAddress?.PostalId) {
            payload.shippingAddress.postalId = projectAddress?.PostalId;
        }
    }
    if (sphState?.paymentType) {
        payload.paymentType = sphState?.paymentType;
    }
    if (typeof sphState?.useHighway === "boolean") {
        payload.viaTol = sphState?.useHighway;
    }
    if (typeof sphState?.isBillingAddressSame === "boolean") {
        payload.isUseSameAddress = sphState?.isBillingAddressSame;
    }
    if (selectedCompany) {
        payload.projectId = selectedCompany?.id;
        if (selectedCompany?.Pics && selectedCompany?.Pics?.length > 0) {
            payload.picArr = selectedCompany?.Pics;
        } else {
            const newPicArr = [{ ...selectedCompany?.Pic, isSelected: true }];
            payload.picArr = newPicArr;
        }
    }
    if (typeof sphState?.paymentBankGuarantee === "boolean") {
        payload.isProvideBankGuarantee = sphState?.paymentBankGuarantee;
    }

    if (sphState?.isBillingAddressSame) {
        if (sphState?.selectedPic?.name) {
            payload.billingRecipientName = sphState?.selectedPic?.name;
        }
        if (sphState?.selectedPic?.phone) {
            payload.billingRecipientPhone = sphState?.selectedPic?.phone;
        }
    } else {
        if (sphState?.billingAddress?.name) {
            payload.billingRecipientName = sphState?.billingAddress?.name;
        }
        if (sphState?.billingAddress?.phone) {
            payload.billingRecipientPhone =
                sphState?.billingAddress?.phone?.toString();
        }
    }

    // }
    if (!sphState?.isBillingAddressSame) {
        if (sphState?.billingAddress?.addressAutoComplete) {
            if (
                sphState?.billingAddress?.addressAutoComplete?.formattedAddress
            ) {
                if (sphState?.useSearchedBillingAddress) {
                    payload.billingAddress.line1 =
                        sphState?.searchedBillingAddress;
                } else {
                    payload.billingAddress.line1 =
                        sphState?.billingAddress?.addressAutoComplete?.formattedAddress;
                }
            }
            if (sphState?.billingAddress?.addressAutoComplete?.PostalId) {
                payload.billingAddress.postalId =
                    sphState?.billingAddress?.addressAutoComplete?.PostalId;
            }
            if (
                safetyCheck(sphState?.billingAddress?.addressAutoComplete?.lat)
            ) {
                payload.billingAddress.lat =
                    sphState?.billingAddress?.addressAutoComplete?.lat;
            }
            if (
                safetyCheck(sphState?.billingAddress?.addressAutoComplete?.lon)
            ) {
                payload.billingAddress.lon =
                    sphState?.billingAddress?.addressAutoComplete?.lon;
            }
            if (sphState?.billingAddress?.addressAutoComplete?.rural) {
                payload.billingAddress.rural =
                    sphState?.billingAddress?.addressAutoComplete?.rural;
            }
            if (sphState?.billingAddress?.addressAutoComplete?.district) {
                payload.billingAddress.district =
                    sphState?.billingAddress?.addressAutoComplete?.district;
            }
            if (sphState?.billingAddress?.addressAutoComplete?.city) {
                payload.billingAddress.city =
                    sphState?.billingAddress?.addressAutoComplete?.city;
            }
        }
        if (sphState?.billingAddress?.fullAddress) {
            payload.billingAddress.line2 =
                sphState?.billingAddress?.fullAddress;
        }
    } else {
        payload.billingAddress = payload?.shippingAddress;
    }
    return payload;
}

export default function FifthStep() {
    const dispatch = useDispatch();
    const { isOrderLoading } = useSelector((state: RootState) => state.order);
    const { selectedBatchingPlant } = useSelector(
        (state: RootState) => state.auth
    );
    const [, stateUpdate, setCurrentPosition] = useContext(SphContext);
    const sphState = useSelector((state: RootState) => state.sph);

    const bottomSheetRef = React.useRef<BottomSheet>(null);

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isStepDoneVisible, setIsStepDoneVisible] = useState(false);
    const [madeSphData, setMadeSphData] = useState<postSphResponseType | null>(
        null
    );

    const inputsData: Input[] = [
        {
            label: "Menggunakan Jalan Tol?",
            isRequire: false,
            type: "switch",
            onChange: (val: boolean) => {
                dispatch(updateUseHighway(val));
            },
            value: sphState?.useHighway,
            labelStyle: {
                fontFamily: fonts.family.montserrat[400],
                fontSize: fonts.size.md
            }
        }
    ];

    React.useEffect(() => {
        crashlytics().log(`${SPH}-Step5`);
    }, []);

    function addPicHandler() {
        setIsModalVisible(false);
        bottomSheetRef?.current?.expand();
    }

    async function buatSph() {
        try {
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpText: "Menyimpan SPH",
                    outsideClickClosePopUp: false
                })
            );
            const payload = payloadMapper(sphState);
            const photoFiles = Object?.values(
                sphState?.paymentRequiredDocuments
            );
            const isNoPhotoToUpload = photoFiles?.every((val) => val === null);
            payload.projectDocs = [];
            payload.batchingPlantId = selectedBatchingPlant?.id;
            const validPhotoCount = countNonNullValues(photoFiles);
            if (
                ((!sphState?.uploadedAndMappedRequiredDocs ||
                    sphState?.uploadedAndMappedRequiredDocs?.length === 0) &&
                    !isNoPhotoToUpload) ||
                validPhotoCount >
                    sphState?.uploadedAndMappedRequiredDocs?.length
            ) {
                let photoResponse;
                if (photoFiles && photoFiles?.length > 0) {
                    photoResponse = await uploadFileImage(
                        photoFiles,
                        "sph"
                    ).catch((err) => Error(err));
                }

                const files: { documentId: string; fileId: string }[] = [];
                if (
                    photoResponse?.data?.success &&
                    photoResponse?.data?.success !== false
                ) {
                    photoResponse?.data?.data?.forEach((photo: any) => {
                        const photoName = photo?.name;
                        let foundPhoto;
                        if (sphState?.paymentRequiredDocuments)
                            Object?.keys(
                                sphState?.paymentRequiredDocuments
                            )?.forEach((documentId) => {
                                if (
                                    Object?.prototype?.hasOwnProperty?.call(
                                        sphState?.paymentRequiredDocuments,
                                        documentId
                                    )
                                ) {
                                    const photoData =
                                        sphState?.paymentRequiredDocuments[
                                            documentId
                                        ];
                                    if (photoData) {
                                        if (
                                            photoData?.name?.includes(photoName)
                                        ) {
                                            foundPhoto = documentId;
                                        }
                                    }
                                }
                            });
                        if (foundPhoto) {
                            files?.push({
                                documentId: foundPhoto,
                                fileId: photo?.id
                            });
                        }
                    });
                }
                const isFilePhotoNotNull = files?.every((val) => val === null);
                if (!isFilePhotoNotNull) {
                    payload.projectDocs = files;
                }
                dispatch(updateUploadedAndMappedRequiredDocs(files));
            } else if (!isNoPhotoToUpload) {
                const isFilePhotoNotNull =
                    sphState?.uploadedAndMappedRequiredDocs?.every(
                        (val) => val === null
                    );
                if (!isFilePhotoNotNull) {
                    payload.projectDocs =
                        sphState?.uploadedAndMappedRequiredDocs;
                }
            }
            const sphResponse = await postSph(payload).catch((err) =>
                Error(err)
            );
            if (
                sphResponse?.data?.success &&
                sphResponse?.data?.success !== false
            ) {
                setMadeSphData(sphResponse?.data?.data?.sph);
                dispatch(closePopUp());
                setTimeout(
                    () => setIsStepDoneVisible(true),
                    Platform.OS === "ios" ? 500 : 0
                );
            } else {
                dispatch(closePopUp());
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText: "Error Menyimpan SPH",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            const messageError = error?.message;
            dispatch(closePopUp());
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText: messageError || "Error Menyimpan SPH",
                    outsideClickClosePopUp: true
                })
            );
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BContainer>
                <StepDone
                    isModalVisible={isStepDoneVisible}
                    setIsModalVisible={setIsStepDoneVisible}
                    sphResponse={madeSphData}
                />
                <ChoosePicModal
                    isModalVisible={isModalVisible}
                    setIsModalVisible={setIsModalVisible}
                    openAddPic={() => addPicHandler()}
                    selectPic={(pic) => {
                        dispatch(updateSelectedPic(pic));
                        setIsModalVisible((curr) => !curr);
                    }}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, maxHeight: resScale(82) }}>
                        <BVisitationCard
                            item={{
                                name: sphState?.selectedCompany?.name
                                    ? sphState?.selectedCompany?.name
                                    : "-",
                                location:
                                    sphState?.selectedCompany?.LocationAddress
                                        .line1
                            }}
                            isRenderIcon={false}
                        />
                    </View>
                    <View>
                        <BSpacer size="extraSmall" />
                        <View style={style.picLable}>
                            <Text style={style.picText}>PIC</Text>
                            <TouchableOpacity
                                onPress={() =>
                                    setIsModalVisible((curr) => !curr)
                                }
                            >
                                <Text style={style.gantiPicText}>
                                    Ganti PIC
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <BSpacer size="verySmall" />
                        <BPic
                            name={sphState?.selectedPic?.name}
                            position={sphState?.selectedPic?.position}
                            phone={sphState?.selectedPic?.phone}
                            email={sphState?.selectedPic?.email}
                        />
                    </View>
                    <View>
                        <BSpacer size="extraSmall" />
                        <View style={style.produkLabel}>
                            <Text style={style.picText}>Produk</Text>
                        </View>
                        <BSpacer size="small" />
                    </View>
                    <FlashList
                        estimatedItemSize={DEFAULT_ESTIMATED_LIST_SIZE}
                        data={sphState?.chosenProducts}
                        renderItem={(item) => (
                            <>
                                <BProductCard
                                    name={item?.item?.product?.name}
                                    pricePerVol={
                                        item?.item?.sellPrice
                                            ? +item.item.sellPrice
                                            : undefined
                                    }
                                    volume={
                                        item?.item?.volume
                                            ? +item.item.volume
                                            : undefined
                                    }
                                    totalPrice={
                                        item?.item?.totalPrice
                                            ? +item.item.totalPrice
                                            : undefined
                                    }
                                />
                                <BSpacer size="small" />
                            </>
                        )}
                    />
                    <BSpacer size="extraSmall" />
                    <BForm titleBold="500" inputs={inputsData} />
                </View>
                <BBackContinueBtn
                    isContinueIcon={false}
                    continueText="Buat SPH"
                    onPressContinue={() => buatSph()}
                    onPressBack={() => setCurrentPosition(3)}
                />
                <BSheetAddPic
                    ref={bottomSheetRef}
                    initialIndex={-1}
                    addPic={(pic: any) => {
                        if (sphState?.selectedCompany) {
                            let newList;
                            if (sphState?.selectedCompany?.Pics)
                                newList = [...sphState.selectedCompany.Pics];
                            newList = [{ ...pic, isSelected: false }];
                            dispatch(
                                updateSelectedCompany({
                                    ...sphState?.selectedCompany,
                                    Pics: newList
                                })
                            );
                        }
                    }}
                />
            </BContainer>
        </SafeAreaView>
    );
}
