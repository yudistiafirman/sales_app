import crashlytics from "@react-native-firebase/crashlytics";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useDispatch, useSelector } from "react-redux";
import { BContainer, BForm, BSpacer } from "@/components";
import { colors, fonts, layout } from "@/constants";
import font from "@/constants/fonts";
import { Input } from "@/interfaces";
import { SPH } from "@/navigation/ScreenNames";
import { fetchSphDocuments } from "@/redux/async-thunks/commonThunks";
import {
    setStepperFocused,
    updatePaymentBankGuarantee,
    updatePaymentType,
    updateRequiredDocuments
} from "@/redux/reducers/SphReducer";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import cbd from "@/assets/icon/Visitation/cbd.png";
import credit from "@/assets/icon/Visitation/credit.png";
import { SphContext } from "../context/SphContext";
import BBackContinueBtn from "../../../../components/molecules/BBackContinueBtn";

const style = StyleSheet.create({
    fileInputShimmer: {
        width: resScale(330),
        height: resScale(30),
        borderRadius: layout.radius.md
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "column"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    backButtonContainer: {
        width: "30%"
    },
    continueButtonContainer: {
        width: "40%"
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    redStar: {
        color: colors.primary
    },
    checkboxLabel: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: font.size.md,
        color: colors.textInput.input
    }
});

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

type DocumentType = {
    id: string;
    name: string;
    payment_type: "CBD" | "CREDIT";
    is_required: boolean;
};

type DocResponse = {
    cbd: DocumentType[];
    credit: DocumentType[];
};

export default function ThirdStep() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [fileKeys, setFileKeys] = useState<
        { key: string; label: string; isRequired: boolean }[]
    >([]);
    const [documents, setDocuments] = useState<{ [key: string]: any }>({});
    const [sphDocuments, setSphDocuments] = useState<DocResponse>({
        cbd: [],
        credit: []
    });
    const [, stateUpdate, setCurrentPosition] = useContext(SphContext);
    const { paymentType, paymentRequiredDocuments, paymentBankGuarantee } =
        useSelector((state: RootState) => state.sph);

    const checkboxInputs: Input[] = [
        {
            label: "Bersedia untuk menyediakan Bank Guarantee",
            type: "checkbox",
            isRequire: true,
            isError: paymentBankGuarantee === false,
            customerErrorMsg: "Pastikan pelanggan menyediakan Bank Guarantee",
            checkbox: {
                value: paymentBankGuarantee,
                onValueChange: (value) => {
                    dispatch(updatePaymentBankGuarantee(value));
                }
            }
        }
    ];

    useEffect(() => {
        crashlytics().log(`${SPH}-Step3`);

        if (paymentType) {
            const objKey: {
                CREDIT: "credit";
                CBD: "cbd";
            } = {
                CREDIT: "credit",
                CBD: "cbd"
            };
            const key: "cbd" | "credit" = objKey[paymentType];

            if (sphDocuments[key]) {
                if (sphDocuments[key].length) {
                    const newFileKeys = sphDocuments[key].map((doc) => ({
                        key: doc.id,
                        label: doc.name,
                        isRequired: doc.is_required
                    }));
                    const documentObj: { [key: string]: any } = {};
                    sphDocuments[key].forEach((doc) => {
                        documentObj[doc.id] = null;
                    });
                    const parentReqDocKeys =
                        paymentRequiredDocuments &&
                        Object.keys(paymentRequiredDocuments);
                    const localReqDocKeys =
                        documentObj && Object.keys(documentObj);
                    const parentDocString = JSON.stringify(parentReqDocKeys);
                    const localDocString = JSON.stringify(localReqDocKeys);

                    if (
                        parentDocString === localDocString &&
                        parentReqDocKeys.length > 0
                    ) {
                        setDocuments(paymentRequiredDocuments);
                    } else {
                        setDocuments(documentObj);
                    }
                    setFileKeys(newFileKeys);
                }
            }
        }
    }, [sphDocuments, paymentType]);

    async function getDocument() {
        try {
            setIsLoading(true);
            const response: DocResponse = await dispatch(
                fetchSphDocuments()
            ).unwrap();

            if (paymentType) {
                const objKey: {
                    CREDIT: "credit";
                    CBD: "cbd";
                } = {
                    CREDIT: "credit",
                    CBD: "cbd"
                };
                const key: "cbd" | "credit" = objKey[paymentType];
                if (response[key]) {
                    if (response[key].length) {
                        const newFileKeys = response[key].map((doc) => ({
                            key: doc.id,
                            label: doc.name,
                            isRequired: doc.is_required
                        }));
                        const documentObj: { [key: string]: any } = {};
                        response[key].forEach((doc) => {
                            documentObj[doc.id] = null;
                        });
                        const parentReqDocKeys =
                            paymentRequiredDocuments &&
                            Object.keys(paymentRequiredDocuments);
                        const localReqDocKeys =
                            documentObj && Object.keys(documentObj);
                        const parentDocString =
                            JSON.stringify(parentReqDocKeys);
                        const localDocString = JSON.stringify(localReqDocKeys);

                        if (
                            parentDocString === localDocString &&
                            parentReqDocKeys.length > 0
                        ) {
                            setDocuments(paymentRequiredDocuments);
                        } else {
                            setDocuments(documentObj);
                        }
                        setFileKeys(newFileKeys);
                    }
                }
            }
            setSphDocuments(response);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        "Terjadi error saat pengambilan data SPH Documents",
                    outsideClickClosePopUp: true
                })
            );
        }
    }

    useEffect(() => {
        getDocument();
    }, []);

    useEffect(() => {
        dispatch(updateRequiredDocuments(documents));
    }, [documents]);
    const inputsData2: Input[] = useMemo(() => {
        const inputs: Input[] = [
            {
                label: "Tipe Pembayaran",
                isRequire: true,
                isError: !paymentType,
                type: "cardOption",
                value: paymentType,
                options: [
                    {
                        title: "Cash Before Delivery",
                        icon: cbd,
                        value: "CBD",
                        onChange: () => {
                            dispatch(updatePaymentType("CBD"));
                        }
                    },
                    {
                        title: "Credit",
                        icon: credit,
                        value: "CREDIT",
                        onChange: () => {
                            dispatch(updatePaymentType("CREDIT"));
                        }
                    }
                ]
            }
        ];
        fileKeys.forEach((key) => {
            inputs.push({
                label: key.label,
                onChange: (data: any) => {
                    if (data) {
                        setDocuments((curr) => ({
                            ...curr,
                            [key.key]: {
                                ...data,
                                name: key.key.trim() + data.name.trim()
                            }
                        }));
                    }
                },
                type: "fileInput",
                value: paymentRequiredDocuments?.[key.key],
                isRequire: key.isRequired,
                isError: key.isRequired
                    ? !paymentRequiredDocuments?.[key.key]
                    : false
            });
        });
        return inputs;
    }, [fileKeys, documents, paymentRequiredDocuments, paymentType]);
    return (
        <BContainer>
            <View style={style.container}>
                <ScrollView>
                    <View pointerEvents={isLoading ? "none" : "auto"}>
                        <BForm titleBold="500" inputs={inputsData2} />
                    </View>
                    {isLoading && (
                        <View>
                            <ShimmerPlaceHolder
                                style={style.fileInputShimmer}
                            />
                            <BSpacer size="extraSmall" />
                            <ShimmerPlaceHolder
                                style={style.fileInputShimmer}
                            />
                        </View>
                    )}
                </ScrollView>

                <View>
                    {paymentType === "CREDIT" && (
                        <BForm
                            titleBold="500"
                            inputs={checkboxInputs}
                            spacer="extraSmall"
                        />
                    )}
                    <BSpacer size="small" />
                    <BBackContinueBtn
                        onPressBack={() => setCurrentPosition(1)}
                        onPressContinue={() => {
                            if (setCurrentPosition) {
                                dispatch(setStepperFocused(3));
                                setCurrentPosition(3);
                            }
                        }}
                        disableContinue={
                            !(
                                paymentType &&
                                (paymentType === "CREDIT"
                                    ? paymentBankGuarantee
                                    : true)
                            ) || isLoading
                        }
                        loadingContinue={isLoading}
                    />
                </View>
            </View>
        </BContainer>
    );
}
