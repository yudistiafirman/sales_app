import crashlytics from "@react-native-firebase/crashlytics";
import {
    useNavigation,
    StackActions,
    useFocusEffect
} from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import * as React from "react";
import { BackHandler, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileImage } from "@/actions/CommonActions";
import { uploadSOSignedDocs } from "@/actions/OrderActions";
import {
    BBackContinueBtn,
    BForm,
    BGallery,
    BHeaderIcon,
    BSpacer,
    PopUpQuestion
} from "@/components";
import { colors, layout } from "@/constants";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import { Input } from "@/interfaces";
import { UploadSOSigned } from "@/models/SOSigned";
import { CAMERA, FORM_SO, GALLERY_SO } from "@/navigation/ScreenNames";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { removeSOPhoto, resetSOState } from "@/redux/reducers/salesOrder";
import { AppDispatch, RootState } from "@/redux/store";
import { resScale } from "@/utils";

function FormSO() {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const soData = useSelector((state: RootState) => state.salesOrder);
    const [isPopupVisible, setPopupVisible] = React.useState(false);

    const inputs: Input[] = [
        {
            label: "No. Sales Order",
            isRequire: false,
            isError: false,
            type: "textInput",
            value: soData.selectedPONumber,
            isInputDisable: true,
            disableColor: colors.textInput.disabled
        }
    ];

    const actionBackButton = (popupVisible = false) => {
        if (popupVisible) {
            if (soData.photoFiles) {
                setPopupVisible(true);
            } else {
                navigation.goBack();
            }
        } else {
            setPopupVisible(false);
            navigation.goBack();
        }
    };

    useCustomHeaderLeft({
        customHeaderLeft: (
            <BHeaderIcon
                size={resScale(23)}
                onBack={() => {
                    actionBackButton(true);
                }}
                iconName="x"
            />
        )
    });

    const addMorePict = () => {
        navigation.dispatch(
            StackActions.push(CAMERA, {
                photoTitle: "/ File SO yang telah di TTD",
                navigateTo: GALLERY_SO,
                closeButton: true,
                disabledDocPicker: false,
                disabledGalleryPicker: false
            })
        );
    };

    const onSubmit = async () => {
        try {
            dispatch(
                openPopUp({
                    popUpType: "loading",
                    popUpTitle: "",
                    popUpText: "Mengupload Dokumen SO",
                    outsideClickClosePopUp: false
                })
            );
            const photoFilestoUpload = soData.photoFiles
                .filter((v) => v.file !== null)
                .map((photo) => ({
                    ...photo.file,
                    uri: photo?.file?.uri?.replace("file:", "file://")
                }));
            const responseFiles = await uploadFileImage(
                photoFilestoUpload,
                "SO Signed"
            );
            if (
                responseFiles.data.success &&
                responseFiles.data.success !== false
            ) {
                const payload = {} as UploadSOSigned;
                const newFileData = responseFiles.data.data.map((v, i) => ({
                    fileId: v.id,
                    type: "BRIK_SIGNED"
                }));
                payload.poDocs = newFileData;
                const responseSOSigned = await uploadSOSignedDocs(
                    payload,
                    soData.selectedID
                );

                if (
                    responseSOSigned.data.success &&
                    responseSOSigned.data.success !== false
                ) {
                    dispatch(resetSOState());
                    dispatch(
                        openPopUp({
                            popUpType: "success",
                            popUpText: "SO\nBerhasil ditandatangani oleh klien",
                            highlightedText: "SO",
                            outsideClickClosePopUp: true
                        })
                    );
                    if (navigation.canGoBack()) {
                        navigation.dispatch(StackActions.popToTop());
                    }
                } else {
                    dispatch(closePopUp());
                    dispatch(
                        openPopUp({
                            popUpType: "error",
                            highlightedText: "SO",
                            popUpText:
                                responseFiles.data.message ||
                                "SO\nGagal diupload",
                            outsideClickClosePopUp: true
                        })
                    );
                }
            } else {
                dispatch(closePopUp());
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        highlightedText: "SO",
                        popUpText:
                            responseFiles.data.message || "SO\nGagal diupload",
                        outsideClickClosePopUp: true
                    })
                );
            }
        } catch (error) {
            dispatch(closePopUp());
            dispatch(
                openPopUp({
                    popUpType: "error",
                    highlightedText: "SO",
                    popUpText: error?.message || "SO\nGagal diupload",
                    outsideClickClosePopUp: true
                })
            );
        }
    };

    const deleteImages = (i: number) => {
        dispatch(removeSOPhoto({ index: i }));
    };

    React.useEffect(() => {
        crashlytics().log(FORM_SO);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                actionBackButton(true);
                return true;
            };
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                backAction
            );
            return () => backHandler.remove();
        }, [])
    );

    const filteredPhotoFiles = soData.photoFiles?.filter(
        (it) => it?.file !== null
    );
    return (
        <View style={{ flex: 1, padding: layout.pad.lg }}>
            <FlashList
                estimatedItemSize={1}
                data={[1]}
                renderItem={() => <BSpacer size="verySmall" />}
                ListHeaderComponent={
                    <>
                        <BGallery
                            addMorePict={addMorePict}
                            picts={soData.photoFiles}
                            removePict={deleteImages}
                        />
                        <BSpacer size="extraSmall" />
                        <BForm titleBold="500" inputs={inputs} />
                    </>
                }
            />
            <BBackContinueBtn
                onPressContinue={onSubmit}
                onPressBack={() => actionBackButton(true)}
                isContinueIcon={false}
                continueText="Upload"
                backText="Kembali"
                disableContinue={!(filteredPhotoFiles?.length > 0)}
            />
            <PopUpQuestion
                isVisible={isPopupVisible}
                setIsPopupVisible={() => actionBackButton(false)}
                actionButton={() => {
                    setPopupVisible(false);
                }}
                cancelText="Keluar"
                actionText="Lanjutkan"
                desc="Progres pembuatan SO Anda sudah tersimpan."
                text="Apakah Anda yakin ingin keluar?"
            />
        </View>
    );
}

export default FormSO;
