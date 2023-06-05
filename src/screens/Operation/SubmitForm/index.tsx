import {
    BBackContinueBtn,
    BDivider,
    BForm,
    BGallery,
    BHeaderIcon,
    BLocationText,
    BSpacer,
    BVisitationCard
} from "@/components";
import { colors, fonts, layout } from "@/constants";
import { TM_CONDITION } from "@/constants/dropdown";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { Input } from "@/interfaces";
import { resScale } from "@/utils";
import {
    StackActions,
    useFocusEffect,
    useNavigation,
    useRoute
} from "@react-navigation/native";
import React, { useCallback, useLayoutEffect } from "react";
import {
    BackHandler,
    DeviceEventEmitter,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from "react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import {
    CAMERA,
    GALLERY_OPERATION,
    SUBMIT_FORM,
    TAB_DISPATCH_TITLE,
    TAB_RETURN_TITLE
} from "@/navigation/ScreenNames";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import EntryType from "@/models/EnumModel";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import {
    onChangeInputValue,
    removeDriverPhoto,
    removeOperationPhoto,
    resetOperationState,
    setAllOperationPhoto
} from "@/redux/reducers/operationReducer";
import { useKeyboardActive } from "@/hooks";
import moment from "moment";
import { UpdateDeliverOrder } from "@/models/updateDeliveryOrder";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { uploadFileImage } from "@/actions/CommonActions";
import { OperationFileType } from "@/interfaces/Operation";
import {
    updateDeliveryOrder,
    updateDeliveryOrderWeight
} from "@/actions/OrderActions";
import { FlashList } from "@shopify/flash-list";

const style = StyleSheet.create({
    flexFull: {
        flex: 1
    },
    leftIconStyle: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.md,
        color: colors.textInput.input
    },
    parent: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.white
    },
    top: {
        height: resScale(120),
        marginBottom: layout.pad.lg
    },
    headerTwo: {
        borderColor: colors.border.default
    },
    conButton: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: layout.pad.lg,
        bottom: 0
    },
    buttonOne: {
        width: "40%",
        paddingEnd: layout.pad.md
    },
    buttonTwo: {
        width: "60%",
        paddingStart: layout.pad.md
    }
});

function LeftIcon() {
    return <Text style={style.leftIconStyle}>+62</Text>;
}
const phoneNumberRegex = /^(?:0[0-9]{9,10}|[1-9][0-9]{7,11})$/;

function SubmitForm() {
    const route = useRoute<RootStackScreenProps>();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { userData } = useSelector((state: RootState) => state.auth);
    const operationData = useSelector((state: RootState) => state.operation);
    const { keyboardVisible } = useKeyboardActive();
    const operationType = route?.params?.operationType;
    const driversFileType = [
        OperationFileType.DO_DRIVER_ARRIVE_PROJECT,
        OperationFileType.DO_DRIVER_BNIB,
        OperationFileType.DO_DRIVER_UNBOXING,
        OperationFileType.DO_DRIVER_EMPTY,
        OperationFileType.DO_DRIVER_DO,
        OperationFileType.DO_DRIVER_RECEIPIENT,
        OperationFileType.DO_DRIVER_WATER,
        OperationFileType.DO_DRIVER_FINISH_PROJECT
    ];
    const wbsFileType = [
        operationType === EntryType.OUT
            ? OperationFileType.WB_OUT_DO
            : OperationFileType.DO_WEIGHT_IN,
        operationType === EntryType.OUT
            ? OperationFileType.WB_OUT_RESULT
            : OperationFileType.WEIGHT_IN
    ];

    const securityDispatchFileType = [
        OperationFileType.DO_SECURITY,
        OperationFileType.DO_DRIVER_SECURITY,
        OperationFileType.DO_LICENSE_SECURITY,
        OperationFileType.DO_SEAL_SECURITY,
        OperationFileType.DO_KONDOM_SECURITY
    ];
    const securityReturnFileType = [
        OperationFileType.DO_RETURN_SECURITY,
        OperationFileType.DO_RETURN_TRUCK_CONDITION_SECURITY
    ];

    const securityFileType =
        operationType === EntryType.DISPATCH
            ? securityDispatchFileType
            : securityReturnFileType;

    const enableLocationHeader =
        operationType === EntryType.DRIVER &&
        operationData.projectDetails.address &&
        operationData.projectDetails.address?.length > 0;

    const removedAddButtonImage = () => {
        switch (userData?.type) {
            case EntryType.WB: {
                if (operationData.photoFiles.length > 1) {
                    const tempImages = [
                        ...operationData.photoFiles.filter(
                            (it) => it.file !== null
                        )
                    ];
                    dispatch(setAllOperationPhoto({ file: tempImages }));
                }
                break;
            }
            case EntryType.SECURITY: {
                if (operationType === EntryType.DISPATCH) {
                    if (operationData.photoFiles.length > 4) {
                        const tempImages = [
                            ...operationData.photoFiles.filter(
                                (it) => it.file !== null
                            )
                        ];
                        dispatch(setAllOperationPhoto({ file: tempImages }));
                    }
                } else if (operationData.photoFiles.length > 1) {
                    const tempImages = [
                        ...operationData.photoFiles.filter(
                            (it) => it.file !== null
                        )
                    ];
                    dispatch(setAllOperationPhoto({ file: tempImages }));
                }
                break;
            }
            default: {
                break;
            }
        }
    };

    React.useEffect(() => {
        crashlytics().log(SUBMIT_FORM);
        DeviceEventEmitter.addListener("Camera.preview", () => {
            removedAddButtonImage();
        });

        return () => {
            DeviceEventEmitter.removeAllListeners("Camera.preview");
        };
    }, [operationData]);

    const getHeaderTitle = () => {
        switch (userData?.type) {
            case EntryType.BATCHER: {
                return "Produksi";
            }
            case EntryType.SECURITY: {
                if (operationType === EntryType.DISPATCH)
                    return TAB_DISPATCH_TITLE;
                return TAB_RETURN_TITLE;
            }
            case EntryType.DRIVER: {
                return "Penuangan";
            }
            case EntryType.WB: {
                return "Weigh Bridge";
            }
            default: {
                return "";
            }
        }
    };

    const handleDisableContinueButton = () => {
        const filteredPhoto = operationData.photoFiles?.filter(
            (it) => it.file !== null
        );
        let photos;
        if (filteredPhoto) photos = [...filteredPhoto];
        if (userData?.type === EntryType.DRIVER) {
            return (
                (photos && photos.length < 7) ||
                operationData.inputsValue.recepientName.length === 0 ||
                !phoneNumberRegex.test(
                    operationData.inputsValue.recepientPhoneNumber
                )
            );
        }
        if (userData?.type === EntryType.WB) {
            return (
                operationData.inputsValue.weightBridge.length === 0 ||
                (photos && photos.length < 2)
            );
        }
        if (operationType === EntryType.RETURN) {
            return (
                operationData.inputsValue.truckMixCondition.length === 0 ||
                (photos && photos.length < 2)
            );
        }
        if (operationType === EntryType.DISPATCH) {
            return photos && photos.length !== 5;
        }

        return undefined;
    };

    const handleBack = () => {
        DeviceEventEmitter.emit("Operation.refreshlist", true);
        navigation.dispatch(StackActions.pop());
    };

    const onSubmitData = async () => {
        try {
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpTitle: "",
                    popUpText: "Memperbarui Delivery Order",
                    outsideClickClosePopUp: false
                })
            );
            const payload = {} as UpdateDeliverOrder;
            const photoFilestoUpload = operationData.photoFiles
                ?.filter((v) => v.file !== null)
                ?.map((photo) => ({
                    ...photo.file,
                    uri: photo?.file?.uri?.replace("file:", "file://")
                }));

            let responseFiles;
            if (photoFilestoUpload && photoFilestoUpload.length > 0) {
                responseFiles = await uploadFileImage(
                    photoFilestoUpload,
                    "Update Delivery Order"
                );
            }
            if (
                responseFiles?.data?.success &&
                responseFiles?.data?.success !== false
            ) {
                let responseUpdateDeliveryOrder: any;
                if (userData?.type === EntryType.DRIVER) {
                    const newFileData = responseFiles?.data?.data?.map(
                        (v, i) => ({
                            fileId: v?.id,
                            type: driversFileType[i]
                        })
                    );
                    payload.doFiles = newFileData;
                    payload.recipientName =
                        operationData.inputsValue.recepientName;
                    payload.recipientNumber =
                        operationData.inputsValue.recepientPhoneNumber;
                    payload.status = "RECEIVED";
                    responseUpdateDeliveryOrder = await updateDeliveryOrder(
                        payload,
                        operationData.projectDetails.deliveryOrderId
                    );
                } else if (userData?.type === EntryType.WB) {
                    const newFileData = responseFiles?.data?.data?.map(
                        (v, i) => ({
                            fileId: v?.id,
                            type: wbsFileType[i]
                        })
                    );
                    payload.doFiles = newFileData;
                    payload.weight = operationData.inputsValue.weightBridge;
                    responseUpdateDeliveryOrder =
                        await updateDeliveryOrderWeight(
                            payload,
                            operationData.projectDetails.deliveryOrderId
                        );
                } else if (userData?.type === EntryType.SECURITY) {
                    const newFileData = responseFiles?.data?.data?.map(
                        (v, i) => ({
                            fileId: v?.id,
                            type: securityFileType[i]
                        })
                    );
                    payload.doFiles = newFileData;

                    if (operationType === EntryType.RETURN) {
                        payload.conditionTruck =
                            operationData.inputsValue.truckMixCondition;
                    }

                    responseUpdateDeliveryOrder = await updateDeliveryOrder(
                        payload,
                        operationData.projectDetails.deliveryOrderId
                    );
                }

                if (
                    responseUpdateDeliveryOrder?.data?.success &&
                    responseUpdateDeliveryOrder?.data?.success !== false
                ) {
                    dispatch(resetOperationState());
                    dispatch(
                        openPopUp({
                            popUpType: "success",
                            popUpText: "Berhasil Memperbarui Delivery Order",
                            outsideClickClosePopUp: true
                        })
                    );
                    if (navigation.canGoBack()) {
                        handleBack();
                    }
                } else {
                    dispatch(closePopUp());
                    dispatch(
                        openPopUp({
                            popUpType: "error",
                            popUpText:
                                responseFiles?.data?.message ||
                                "Error Memperbarui Delivery Order",
                            outsideClickClosePopUp: true
                        })
                    );
                }
            } else {
                dispatch(closePopUp());
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            responseFiles?.data?.message ||
                            "Error Memperbarui Delivery Order",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            dispatch(closePopUp());
            dispatch(
                openPopUp({
                    popUpType: "error",
                    popUpText:
                        error?.message || "Error Memperbarui Delivery Order",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    const renderHeaderLeft = useCallback(
        () => (
            <BHeaderIcon
                size={layout.pad.lg + layout.pad.md}
                iconName="arrow-left"
                marginRight={layout.pad.lg}
                onBack={handleBack}
            />
        ),
        [handleBack]
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackVisible: false,
            headerLeft: () => renderHeaderLeft()
        });
    }, [navigation, renderHeaderLeft]);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                handleBack();
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        }, [handleBack, operationData.photoFiles, userData?.type])
    );

    useHeaderTitleChanged({ title: getHeaderTitle() });

    const weightInputs: Input[] = [
        {
            label: "Berat",
            value: operationData.inputsValue.weightBridge,
            onChange: (e) => {
                const result = `${e}`;
                dispatch(
                    onChangeInputValue({
                        inputType: "weightBridge",
                        value: result
                    })
                );
            },
            isRequire: true,
            type: "quantity",
            quantityType: "kg",
            placeholder: "Masukkan berat",
            isError: !operationData.inputsValue.weightBridge,
            outlineColor: !operationData.inputsValue.weightBridge
                ? colors.text.errorText
                : undefined
        }
    ];

    const deliveryInputs: Input[] = [
        {
            label: "Nama Penerima",
            value: operationData.inputsValue.recepientName,
            onChange: (e) =>
                dispatch(
                    onChangeInputValue({
                        inputType: "recepientName",
                        value: e.nativeEvent.text
                    })
                ),
            isRequire: true,
            type: "textInput",
            placeholder: "Masukkan nama penerima",
            isError: !operationData.inputsValue.recepientName,
            outlineColor: !operationData.inputsValue.recepientName
                ? colors.text.errorText
                : undefined
        },
        {
            label: "No. Telp Penerima",
            value: operationData.inputsValue.recepientPhoneNumber,
            onChange: (e) => {
                dispatch(
                    onChangeInputValue({
                        inputType: "recepientPhoneNumber",
                        value: e.nativeEvent.text
                    })
                );
            },
            isError: !phoneNumberRegex.test(
                operationData.inputsValue.recepientPhoneNumber
            ),
            outlineColor: !phoneNumberRegex.test(
                operationData.inputsValue.recepientPhoneNumber
            )
                ? colors.text.errorText
                : undefined,
            isRequire: true,
            keyboardType: "numeric",
            type: "textInput",
            placeholder: "Masukkan nomor telp penerima",
            customerErrorMsg: "No. Telepon harus diisi sesuai format",
            LeftIcon: operationData.inputsValue.recepientPhoneNumber
                ? LeftIcon
                : undefined
        }
    ];

    const returnInputs: Input[] = [
        // {
        //   label: 'Ada Muatan Tersisa di Dalam TM?',
        //   value: '',
        //   type: 'checkbox',
        //   isRequire: false,
        //   checkbox: {
        //     value: operationData.inputsValue.truckMixHaveLoad,
        //     onValueChange: (e) => {
        //       dispatch(
        //         onChangeInputValue({ inputType: 'truckMixHaveLoad', value: e })
        //       );
        //     },
        //   },
        // },
        {
            label: "Kondisi TM",
            isRequire: true,
            isError: false,
            type: "dropdown",
            dropdown: {
                items: TM_CONDITION,
                placeholder: operationData.inputsValue.truckMixCondition
                    ? TM_CONDITION.find(
                          (it) =>
                              it.value ===
                              operationData.inputsValue.truckMixCondition
                      )?.label ?? ""
                    : "Pilih Kondisi TM",
                onChange: (value: any) => {
                    dispatch(
                        onChangeInputValue({
                            inputType: "truckMixCondition",
                            value
                        })
                    );
                }
            }
        }
    ];

    const deleteImages = useCallback(
        (i: number, attachType?: string) => {
            if (userData?.type === EntryType.DRIVER) {
                dispatch(removeDriverPhoto({ index: i, attachType }));
            } else {
                dispatch(removeOperationPhoto({ index: i }));
            }
        },
        [
            operationData.photoFiles,
            dispatch,
            removeOperationPhoto,
            removeDriverPhoto
        ]
    );

    const addMoreImages = useCallback(
        (attachType?: string) => {
            switch (userData?.type) {
                case EntryType.DRIVER: {
                    navigation.dispatch(
                        StackActions.push(CAMERA, {
                            photoTitle: attachType,
                            closeButton: true,
                            navigateTo: EntryType.DRIVER,
                            operationAddedStep: attachType
                        })
                    );
                    break;
                }
                case EntryType.SECURITY: {
                    if (operationType === EntryType.DISPATCH) {
                        navigation.dispatch(
                            StackActions.push(CAMERA, {
                                photoTitle: "Tambahan",
                                closeButton: true,
                                navigateTo: GALLERY_OPERATION
                            })
                        );
                    } else {
                        navigation.dispatch(
                            StackActions.push(CAMERA, {
                                photoTitle: "Tambahan",
                                closeButton: true,
                                navigateTo: GALLERY_OPERATION
                            })
                        );
                    }
                    break;
                }
                case EntryType.WB: {
                    navigation.dispatch(
                        StackActions.push(CAMERA, {
                            photoTitle: "Tambahan",
                            closeButton: true,
                            navigateTo: GALLERY_OPERATION
                        })
                    );
                    break;
                }
                default: {
                    break;
                }
            }
        },
        [operationData.photoFiles, dispatch]
    );

    return (
        <SafeAreaView style={style.parent}>
            <FlashList
                estimatedItemSize={1}
                data={[1]}
                contentContainerStyle={{
                    paddingHorizontal: layout.pad.lg,
                    paddingBottom: layout.pad.lg
                }}
                renderItem={() => <BSpacer size="verySmall" />}
                ListHeaderComponent={
                    <View style={style.flexFull}>
                        {enableLocationHeader && (
                            <BLocationText
                                location={operationData.projectDetails.address}
                            />
                        )}
                        <BSpacer size="extraSmall" />
                        <View style={style.top}>
                            <BVisitationCard
                                item={{
                                    name: operationData.projectDetails
                                        .projectName,
                                    location:
                                        operationData.projectDetails.address
                                }}
                                isRenderIcon={false}
                            />
                            <BVisitationCard
                                item={{
                                    name: operationData.projectDetails.doNumber,
                                    unit: `${operationData.projectDetails.requestedQuantity} m3`,
                                    time: `${moment(
                                        operationData.projectDetails
                                            .deliveryTime
                                    ).format("L")} | ${moment(
                                        operationData.projectDetails
                                            .deliveryTime
                                    ).format("hh:mm A")}`
                                }}
                                customStyle={{
                                    backgroundColor: colors.tertiary
                                }}
                                isRenderIcon={false}
                            />
                        </View>
                        <View>
                            <BDivider />
                            <BSpacer size="extraSmall" />
                        </View>
                        <View>
                            <BGallery
                                addMorePict={(attachType) =>
                                    addMoreImages(attachType)
                                }
                                removePict={(pos, attachType) =>
                                    deleteImages(pos, attachType)
                                }
                                picts={operationData.photoFiles}
                            />
                        </View>
                        <View style={style.flexFull}>
                            {(operationType === EntryType.DRIVER ||
                                operationType === EntryType.RETURN ||
                                operationType === EntryType.IN ||
                                operationType === EntryType.OUT) && (
                                <BSpacer size="small" />
                            )}
                            {operationType === EntryType.DRIVER && (
                                <BForm
                                    titleBold="500"
                                    inputs={deliveryInputs}
                                />
                            )}
                            {(operationType === EntryType.IN ||
                                operationType === EntryType.OUT) && (
                                <BForm titleBold="500" inputs={weightInputs} />
                            )}
                            {operationType === EntryType.RETURN && (
                                <View style={{ height: resScale(300) }}>
                                    <BForm
                                        titleBold="500"
                                        inputs={returnInputs}
                                        spacer="extraSmall"
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                }
            />

            {!keyboardVisible && (
                <View
                    style={{
                        paddingHorizontal: layout.pad.lg,
                        paddingBottom: layout.pad.lg
                    }}
                >
                    <BBackContinueBtn
                        onPressContinue={onSubmitData}
                        disableContinue={handleDisableContinueButton()}
                        onPressBack={handleBack}
                        continueText="Simpan"
                        isContinueIcon={false}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}

export default SubmitForm;
