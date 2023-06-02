import { ProgressBar } from "@react-native-community/progress-bar-android";
import { useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { useDispatch } from "react-redux";
import { resScale } from "@/utils";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { Input } from "@/interfaces";
import { colors, fonts, layout } from "@/constants";
import { BContainer, BForm, BLabel, BSpacer } from "@/components";
import {
    getSphDocuments,
    postProjectDoc,
    uploadFileImage
} from "@/actions/CommonActions";

const styles = StyleSheet.create({
    container: { flex: 1 },
    between: { flexDirection: "row", justifyContent: "space-between" },
    fontW500: {
        color: colors.text.darker,
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.md
    },
    documentProggress: {},
    fileInputShimmer: {
        width: resScale(330),
        height: resScale(30),
        borderRadius: layout.radius.md
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

export default function RequiredDocuments() {
    const dispatch = useDispatch();
    const route = useRoute();

    const { docs, projectId } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [reqDocuments, setReqDocuments] = useState<DocResponse>({});
    const [docState, setDocState] = useState<{ [key: string]: any }>({});
    const [docLoadingState, setDocLoadingState] = useState<{
        [key: string]: {
            loading: boolean;
            error: boolean;
            errorMessage: string;
        };
    }>({});
    const [filledDocsCount, totalDocsCount] = useMemo((): number[] => {
        let count = 0;
        let totalProperties = 0;

        if (docState)
            Object.keys(docState).forEach((key) => {
                totalProperties += 1;
                if (Object.prototype.hasOwnProperty.call(docState, key)) {
                    if (docState[key]) {
                        count += 1;
                    }
                }
            });
        return [count, totalProperties];
    }, [docState]);

    const getDocument = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getSphDocuments().catch((err) => Error(err));

            if (response?.data?.success && response?.data?.success !== false) {
                setDocState(() => {
                    const newDocState: { [key: string]: any } = {};

                    response?.data?.data.credit.forEach((doc) => {
                        newDocState[doc.id] = null;
                    });
                    response?.data?.data.cbd.forEach((doc) => {
                        newDocState[doc.id] = null;
                    });

                    if (docs && Array.isArray(docs)) {
                        docs.forEach((doc) => {
                            if (doc.documentId in newDocState) {
                                newDocState[doc.documentId] = doc;
                            }
                        });
                    }

                    return newDocState;
                });
                setDocLoadingState(() => {
                    const newdocLoadingState: {
                        [key: string]: {
                            loading: boolean;
                            error: boolean;
                            errorMessage: string;
                        };
                    } = {};

                    response?.data?.data.credit.forEach((doc) => {
                        newdocLoadingState[doc.id] = {
                            loading: false,
                            error: false,
                            errorMessage: ""
                        };
                    });
                    response?.data?.data.cbd.forEach((doc) => {
                        newdocLoadingState[doc.id] = {
                            loading: false,
                            error: false,
                            errorMessage: ""
                        };
                    });

                    return newdocLoadingState;
                });

                setReqDocuments(response?.data?.data);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            "Terjadi error saat pengambilan data document",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            setIsLoading(false);
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message ||
                        "Terjadi error saat pengambilan data document",
                    outsideClickClosePopUp: true
                })
            );
        }
    }, []);

    useEffect(() => {
        getDocument();
    }, []);

    const uploadFile = useCallback(async (documentId: string, file: any) => {
        try {
            setDocLoadingState((curr) => ({
                ...curr,
                [documentId]: {
                    ...curr[documentId],
                    loading: true,
                    error: false,
                    errorMessage: ""
                }
            }));
            let photoResponse;
            if (file && file.length > 0)
                photoResponse = await uploadFileImage(
                    [file],
                    "customerDetail"
                ).catch((err) => Error(err));

            const payloadProjectDoc = {
                documentId,
                fileId:
                    photoResponse && photoResponse?.data?.data?.length > 0
                        ? photoResponse?.data?.data[0].id
                        : "",
                projectId // hardcode di atas,
            };

            const response = await postProjectDoc(payloadProjectDoc).catch(
                (err) => Error(err)
            );
            setDocLoadingState((curr) => ({
                ...curr,
                [documentId]: {
                    ...curr[documentId],
                    loading: false,
                    error: !(
                        response?.data?.success &&
                        response?.data?.success !== false
                    ),
                    errorMessage:
                        response?.data?.success &&
                        response?.data?.success !== false
                            ? ""
                            : "Upload error"
                }
            }));
        } catch (error) {
            const messsage = error?.message || "Upload error";
            setDocLoadingState((curr) => ({
                ...curr,
                [documentId]: {
                    ...curr[documentId],
                    loading: false,
                    error: true,
                    errorMessage: messsage
                }
            }));
        }
    }, []);

    const files = useMemo(() => {
        type FileInputType = {
            label: string;
            type: string;
            isRequire: boolean;
            key: string;
        };
        const fileInputCredit: FileInputType[] = [];
        const fileInputCbd: FileInputType[] = [];
        reqDocuments?.credit?.forEach((doc) => {
            const input = {
                label: doc.name,
                type: "fileInput",
                isRequire: doc.is_required,
                key: doc.id
            };
            fileInputCredit.push(input);
        });
        reqDocuments?.cbd?.forEach((doc) => {
            const input = {
                label: doc.name,
                type: "fileInput",
                isRequire: doc.is_required,
                key: doc.id
            };
            fileInputCbd.push(input);
        });
        return [fileInputCredit, fileInputCbd];
    }, [reqDocuments]);

    const inputsData: Input[] = useMemo(() => {
        const fileInputsCredit: Input[] = [];
        const filesInputsCBD: Input[] = [];

        const [fileInputCredit, fileInputCbd] = files;

        fileInputCredit.forEach((each) => {
            const inputFile: Input = {
                ...each,
                value: docState[each.key],
                onChange: (data: any) => {
                    if (!data) return;
                    setDocState((curr) => ({
                        ...curr,
                        [each.key]: {
                            ...data,
                            name: each.key.trim() + data.name
                        }
                    }));
                    uploadFile(each.key, data);
                },
                loading: docLoadingState[each.key].loading,
                isError: docLoadingState[each.key].error,
                customerErrorMsg: docLoadingState[each.key].errorMessage
            };
            fileInputsCredit.push(inputFile);
        });
        fileInputCbd.forEach((each) => {
            const inputFile: Input = {
                ...each,
                value: docState[each.key],
                onChange: (data: any) => {
                    if (!data) return;
                    setDocState((curr) => ({
                        ...curr,
                        [each.key]: {
                            ...data,
                            name: each.key.trim() + data.name
                        }
                    }));
                    uploadFile(each.key, data);
                },
                loading: docLoadingState[each.key].loading,
                isError: docLoadingState[each.key].error,
                customerErrorMsg: docLoadingState[each.key].errorMessage
            };
            filesInputsCBD.push(inputFile);
        });
        return [fileInputsCredit, filesInputsCBD];
    }, [files, docState, docLoadingState, uploadFile]);

    const [fileInputsCredit, filesInputsCBD] = inputsData;

    return (
        <BContainer>
            <View style={styles.documentProggress}>
                <View style={styles.between}>
                    <Text style={styles.fontW500}>Kelengkapan Dokumen</Text>
                    <Text style={styles.fontW500}>
                        {filledDocsCount}/{totalDocsCount}
                    </Text>
                </View>
                <ProgressBar
                    styleAttr="Horizontal"
                    indeterminate={false}
                    progress={
                        filledDocsCount / totalDocsCount
                            ? filledDocsCount / totalDocsCount
                            : 0
                    }
                    color={colors.primary}
                />
            </View>
            <BSpacer size="small" />
            <BLabel label="Cash Before Delivery" isRequired />
            <BSpacer size="extraSmall" />
            <BForm titleBold="500" inputs={filesInputsCBD} />
            <BSpacer size="extraSmall" />
            <BLabel label="Credit" isRequired />
            <BSpacer size="extraSmall" />
            <BForm titleBold="500" inputs={fileInputsCredit} />
            {isLoading && (
                <View>
                    <ShimmerPlaceHolder style={styles.fileInputShimmer} />
                    <BSpacer size="extraSmall" />
                    <ShimmerPlaceHolder style={styles.fileInputShimmer} />
                </View>
            )}
        </BContainer>
    );
}
