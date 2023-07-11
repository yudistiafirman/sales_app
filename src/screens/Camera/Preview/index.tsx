import crashlytics from "@react-native-firebase/crashlytics";
import {
    StackActions,
    useFocusEffect,
    useNavigation,
    useRoute
} from "@react-navigation/native";
import moment from "moment";
import * as React from "react";
import {
    StyleProp,
    ViewStyle,
    View,
    Image,
    StyleSheet,
    DeviceEventEmitter
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import Pdf from "react-native-pdf";
import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import { updateDeliveryOrder } from "@/actions/OrderActions";
import { BButtonPrimary, BHeaderIcon } from "@/components";
import { layout } from "@/constants";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import LocalFileType from "@/interfaces/LocalFileType";
import EntryType from "@/models/EnumModel";
import { UpdateDeliverOrder } from "@/models/updateDeliveryOrder";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import {
    CAMERA,
    CREATE_DEPOSIT,
    CREATE_VISITATION,
    FORM_SO,
    GALLERY_DEPOSIT,
    GALLERY_OPERATION,
    GALLERY_SO,
    GALLERY_VISITATION,
    IMAGE_PREVIEW,
    PO,
    SUBMIT_FORM,
    driversFileType,
    securityDispatchFileType,
    securityReturnFileType,
    wbsInFileType,
    wbsOutFileType
} from "@/navigation/ScreenNames";
import {
    resetAllStepperFocused,
    updateDataVisitation
} from "@/redux/reducers/VisitationReducer";
import { setImageURLS } from "@/redux/reducers/cameraReducer";
import {
    onChangeProjectDetails,
    resetInputsValue,
    setAllOperationPhoto,
    setOperationPhoto
} from "@/redux/reducers/operationReducer";
import {
    onUpdateSOID,
    onUpdateSONumber,
    setAllSOPhoto,
    setSOPhoto
} from "@/redux/reducers/salesOrder";
import { RootState } from "@/redux/store";
import { resScale } from "@/utils";
import { hasLocationPermission } from "@/utils/permissions";
import { safetyCheck } from "@/utils/generalFunc";
import { uploadFileImage } from "@/actions/CommonActions";

const styles = StyleSheet.create({
    parent: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: "black",
        width: "100%"
    },
    image: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
    conButton: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: layout.pad.lg
    },
    buttonOne: {
        flex: 1,
        paddingEnd: layout.pad.md
    },
    buttonTwo: {
        flex: 1.5,
        paddingStart: layout.pad.md
    }
});

function ContinueIcon() {
    return <Entypo name="chevron-right" size={resScale(24)} color="#FFFFFF" />;
}

function Preview({ style }: { style?: StyleProp<ViewStyle> }) {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute<RootStackScreenProps>();
    const assignStyle = React.useMemo(() => style, [style]);
    const photo = route?.params?.photo?.path;
    const picker = route?.params?.picker;
    const navigateTo = route?.params?.navigateTo;
    const operationAddedStep = route?.params?.operationAddedStep;
    const operationTempData = route?.params?.operationTempData;
    const closeButton = route?.params?.closeButton;
    const existingVisitation = route?.params?.existingVisitation;
    const soNumber = route?.params?.soNumber;
    const soID = route?.params?.soID;
    const photoTitle = route?.params?.photoTitle;
    const visitationData = useSelector((state: RootState) => state.visitation);
    const operationData = useSelector((state: RootState) => state.operation);
    const authState = useSelector((state: RootState) => state.auth);
    let latlongResult = "";

    useHeaderTitleChanged({
        title: `Foto ${photoTitle}`,
        selectedBP: authState.selectedBatchingPlant,
        hideBPBadges: true
    });

    useCustomHeaderLeft({
        customHeaderLeft: closeButton ? (
            <BHeaderIcon
                size={resScale(23)}
                onBack={() => navigation.goBack()}
                iconName="x"
            />
        ) : undefined
    });

    React.useEffect(() => {
        crashlytics().log(IMAGE_PREVIEW);
    }, []);

    const getCurrentLocation = async () => {
        const opt = {
            showLocationDialog: true,
            forceRequestLocation: true
            // timeout:INFINITY,
            // maximumAge:INFINITY,
            // accuracy: { ios: "hundredMeters", android: "balanced" },
            // enableHighAccuracy: false,
            // distanceFilter:0,
        };
        const getCurrentPosition = () =>
            new Promise((resolve, error) =>
                Geolocation.getCurrentPosition(resolve, error, opt)
            );

        try {
            const response = await getCurrentPosition();
            const { coords } = response;
            const { longitude, latitude } = coords;
            return { longitude, latitude };
        } catch (error) {
            throw new Error(error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            hasLocationPermission().then((result) => {
                if (result) {
                    getCurrentLocation().then((longlat) => {
                        latlongResult =
                            safetyCheck(longlat?.latitude) &&
                            safetyCheck(longlat?.longitude)
                                ? `${longlat?.latitude}, ${longlat?.longitude}`
                                : "";
                    });
                }
            });
        }, [])
    );

    const getTypeOfImagePayload = () => {
        if (navigateTo) {
            if (
                navigateTo !== CREATE_DEPOSIT &&
                navigateTo !== GALLERY_VISITATION &&
                navigateTo !== GALLERY_DEPOSIT &&
                navigateTo !== PO &&
                navigateTo !== EntryType.DRIVER &&
                navigateTo !== EntryType.DISPATCH &&
                navigateTo !== EntryType.RETURN &&
                navigateTo !== EntryType.IN &&
                navigateTo !== EntryType.OUT &&
                navigateTo !== GALLERY_OPERATION &&
                navigateTo !== FORM_SO &&
                navigateTo !== GALLERY_SO
            ) {
                return "COVER";
            }
            return "GALLERY";
        }
        return "GALLERY";
    };

    const onArrivedDriver = async () => {
        try {
            const payload = {} as UpdateDeliverOrder;
            payload.status = "ARRIVED";
            const responseUpdateDeliveryOrder = await updateDeliveryOrder(
                payload,
                operationTempData?.deliveryOrderId ||
                    operationData?.projectDetails?.deliveryOrderId
            );

            if (responseUpdateDeliveryOrder?.data?.success) {
                // do nothing
                console.log("SUCCESS ARRIVED");
            } else {
                // do nothing
                console.log("FAILED ARRIVED");
            }
        } catch (error) {
            // do nothing
            console.log("FAILED ARRIVED, ", error);
        }
    };

    const uploadEachPhoto = async (
        type: string,
        file: LocalFileType | undefined
    ) => {
        const photoFilestoUpload: any[] = [];
        const tempFile = { ...file?.file };
        tempFile?.uri?.replace("file:", "file://");
        photoFilestoUpload.push(tempFile);
        const payload = {} as UpdateDeliverOrder;

        const responseFile = await uploadFileImage(
            photoFilestoUpload,
            "Update Delivery Order"
        );
        const newFileData = responseFile?.data?.data?.map((v, i) => ({
            fileId: v?.id,
            type
        }));
        payload.doFiles = newFileData;
        await updateDeliveryOrder(
            payload,
            operationData?.projectDetails?.deliveryOrderId
        );
    };

    const savePhoto = () => {
        const imagePayloadType: "COVER" | "GALLERY" = getTypeOfImagePayload();
        const photoName = photo?.split("/")?.pop();
        const pdfName = picker?.name;
        const photoNameParts = photoName?.split(".");
        let photoType =
            photoNameParts && photoNameParts?.length > 0
                ? photoNameParts[photoNameParts.length - 1]
                : "";

        if (photoType === "jpg") {
            photoType = "jpeg";
        }

        let localFile: LocalFileType | undefined;
        if (photo) {
            localFile = {
                file: {
                    uri: `file:${photo}`,
                    type: `image/${photoType}`,
                    name: photoName,
                    longlat: latlongResult,
                    datetime: moment(new Date()).format("DD/MM/yyyy HH:mm:ss")
                },
                isFromPicker: false,
                type: imagePayloadType,
                attachType:
                    navigateTo === EntryType.DRIVER ||
                    navigateTo === EntryType.DISPATCH ||
                    navigateTo === EntryType.RETURN ||
                    navigateTo === EntryType.IN ||
                    navigateTo === EntryType.OUT
                        ? operationAddedStep
                        : undefined
            };
        } else if (picker) {
            localFile = {
                file: {
                    uri: picker?.uri,
                    type: picker?.type,
                    name: pdfName,
                    longlat: latlongResult,
                    datetime: moment(new Date()).format("DD/MM/yyyy HH:mm:ss")
                },
                isFromPicker: true,
                type: imagePayloadType,
                attachType:
                    navigateTo === EntryType.DRIVER ||
                    navigateTo === EntryType.DISPATCH ||
                    navigateTo === EntryType.RETURN ||
                    navigateTo === EntryType.IN ||
                    navigateTo === EntryType.OUT
                        ? operationAddedStep
                        : undefined
            };
        }

        if (
            navigateTo === EntryType.DRIVER ||
            navigateTo === EntryType.DISPATCH ||
            navigateTo === EntryType.RETURN ||
            navigateTo === EntryType.IN ||
            navigateTo === EntryType.OUT
        ) {
            if (operationTempData) {
                dispatch(resetInputsValue());
                dispatch(
                    onChangeProjectDetails({
                        projectDetails: operationTempData
                    })
                );
            }
        }

        if (navigateTo === FORM_SO) {
            dispatch(onUpdateSONumber({ number: soNumber }));
            dispatch(onUpdateSOID({ id: soID }));
            dispatch(setAllSOPhoto({ file: [{ file: null }] }));
        }

        if (photo) DeviceEventEmitter.emit("Camera.preview", photo);
        else DeviceEventEmitter.emit("Camera.preview", picker);
        let images: any[] = [];
        switch (navigateTo) {
            case CREATE_VISITATION: {
                dispatch(
                    setImageURLS({ file: localFile, source: CREATE_VISITATION })
                );
                if (
                    visitationData?.images &&
                    visitationData?.images?.length > 0
                )
                    images = [{ file: null }];
                images?.push(localFile);
                dispatch(
                    updateDataVisitation({ type: "images", value: images })
                );
                dispatch(resetAllStepperFocused());
                navigation.goBack();
                navigation.dispatch(
                    StackActions.replace(navigateTo, { existingVisitation })
                );
                return;
            }
            case PO: {
                dispatch({
                    type: "addImages",
                    value: localFile
                });
                navigation.dispatch(StackActions.replace(navigateTo));
                return;
            }
            case EntryType.DISPATCH: {
                const newPhotoFiles: LocalFileType[] = [];
                operationData?.photoFiles?.forEach((item) => {
                    let selectedItem: LocalFileType | undefined = { ...item };
                    if (selectedItem?.attachType === operationAddedStep) {
                        selectedItem = localFile;
                    }

                    if (selectedItem) newPhotoFiles?.push(selectedItem);
                });
                dispatch(setAllOperationPhoto({ file: newPhotoFiles }));

                navigation.dispatch(StackActions.pop(2));
                switch (photoTitle) {
                    case "DO":
                        uploadEachPhoto(securityDispatchFileType[0], localFile);
                        navigation.navigate(SUBMIT_FORM, {
                            operationType: EntryType.DISPATCH
                        });
                        break;
                    case "Driver":
                        uploadEachPhoto(securityDispatchFileType[1], localFile);
                        break;
                    case "No Polisi TM":
                        uploadEachPhoto(securityDispatchFileType[2], localFile);
                        break;
                    case "Segel":
                        uploadEachPhoto(securityDispatchFileType[3], localFile);
                        break;
                    case "Kondom":
                        uploadEachPhoto(securityDispatchFileType[4], localFile);
                        break;
                    default:
                        break;
                }
                return;
            }
            case EntryType.DRIVER: {
                const newPhotoFiles: LocalFileType[] = [];
                operationData?.photoFiles?.forEach((item) => {
                    let selectedItem: LocalFileType | undefined = { ...item };
                    if (selectedItem?.attachType === operationAddedStep) {
                        selectedItem = localFile;
                    }

                    if (selectedItem) newPhotoFiles?.push(selectedItem);
                });
                dispatch(setAllOperationPhoto({ file: newPhotoFiles }));

                navigation.dispatch(StackActions.pop(2));
                switch (photoTitle) {
                    case "Tiba di lokasi":
                        uploadEachPhoto(driversFileType[0], localFile);
                        onArrivedDriver();
                        navigation.navigate(SUBMIT_FORM, {
                            operationType: EntryType.DRIVER
                        });
                        break;
                    case "Dalam gentong isi":
                        uploadEachPhoto(driversFileType[1], localFile);
                        break;
                    case "Tuang beton":
                        uploadEachPhoto(driversFileType[2], localFile);
                        break;
                    case "Cuci gentong":
                        uploadEachPhoto(driversFileType[3], localFile);
                        break;
                    case "DO":
                        uploadEachPhoto(driversFileType[4], localFile);
                        break;
                    case "Penerima":
                        uploadEachPhoto(driversFileType[5], localFile);
                        break;
                    case "Penambahan air":
                        uploadEachPhoto(driversFileType[6], localFile);
                        break;
                    case "Tambahan":
                        uploadEachPhoto(driversFileType[7], localFile);
                        break;
                    default:
                        break;
                }
                return;
            }
            case EntryType.IN: {
                const newPhotoFiles: LocalFileType[] = [];
                operationData?.photoFiles?.forEach((item) => {
                    let selectedItem: LocalFileType | undefined = { ...item };
                    if (selectedItem?.attachType === operationAddedStep) {
                        selectedItem = localFile;
                    }

                    if (selectedItem) newPhotoFiles?.push(selectedItem);
                });
                dispatch(setAllOperationPhoto({ file: newPhotoFiles }));

                navigation.dispatch(StackActions.pop(2));
                switch (photoTitle) {
                    case "DO":
                        uploadEachPhoto(wbsInFileType[0], localFile);
                        navigation.navigate(SUBMIT_FORM, {
                            operationType: EntryType.IN
                        });
                        break;
                    case "Hasil":
                        uploadEachPhoto(wbsInFileType[1], localFile);
                        break;
                    default:
                        break;
                }
                return;
            }
            case EntryType.OUT: {
                const newPhotoFiles: LocalFileType[] = [];
                operationData?.photoFiles?.forEach((item) => {
                    let selectedItem: LocalFileType | undefined = { ...item };
                    if (selectedItem?.attachType === operationAddedStep) {
                        selectedItem = localFile;
                    }

                    if (selectedItem) newPhotoFiles?.push(selectedItem);
                });
                dispatch(setAllOperationPhoto({ file: newPhotoFiles }));

                navigation.dispatch(StackActions.pop(2));
                switch (photoTitle) {
                    case "DO":
                        uploadEachPhoto(wbsOutFileType[0], localFile);
                        navigation.navigate(SUBMIT_FORM, {
                            operationType: EntryType.OUT
                        });
                        break;
                    case "Hasil":
                        uploadEachPhoto(wbsOutFileType[1], localFile);
                        break;
                    default:
                        break;
                }
                return;
            }
            case EntryType.RETURN: {
                const newPhotoFiles: LocalFileType[] = [];
                operationData?.photoFiles?.forEach((item) => {
                    let selectedItem: LocalFileType | undefined = { ...item };
                    if (selectedItem?.attachType === operationAddedStep) {
                        selectedItem = localFile;
                    }

                    if (selectedItem) newPhotoFiles?.push(selectedItem);
                });
                dispatch(setAllOperationPhoto({ file: newPhotoFiles }));

                navigation.dispatch(StackActions.pop(2));
                switch (photoTitle) {
                    case "DO":
                        uploadEachPhoto(securityReturnFileType[0], localFile);
                        navigation.navigate(SUBMIT_FORM, {
                            operationType: EntryType.RETURN
                        });
                        break;
                    case "Kondisi TM":
                        uploadEachPhoto(securityReturnFileType[1], localFile);
                        break;
                    default:
                        break;
                }
                return;
            }
            case FORM_SO: {
                dispatch(setSOPhoto({ file: localFile }));
                navigation.dispatch(StackActions.pop(2));
                navigation.navigate(navigateTo);
                return;
            }
            case GALLERY_SO: {
                dispatch(setSOPhoto({ file: localFile }));
                navigation.dispatch(StackActions.pop(2));
                return;
            }
            case CREATE_DEPOSIT: {
                dispatch(
                    setImageURLS({ file: localFile, source: CREATE_DEPOSIT })
                );
                navigation.goBack();
                navigation.dispatch(StackActions.replace(navigateTo));
                return;
            }
            case GALLERY_VISITATION: {
                dispatch(
                    setImageURLS({ file: localFile, source: CREATE_VISITATION })
                );
                if (
                    visitationData?.images &&
                    visitationData?.images?.length > 0
                )
                    images = [...visitationData.images];
                images?.push(localFile);
                dispatch(
                    updateDataVisitation({ type: "images", value: images })
                );
                navigation.dispatch(StackActions.pop(2));
                return;
            }
            case GALLERY_DEPOSIT: {
                dispatch(
                    setImageURLS({ file: localFile, source: CREATE_DEPOSIT })
                );
                navigation.dispatch(StackActions.pop(2));
                return;
            }
            case GALLERY_OPERATION: {
                dispatch(
                    setOperationPhoto({
                        file: localFile,
                        withoutAddButton: false
                    })
                );
                navigation.dispatch(StackActions.pop(2));
                return;
            }
            default: {
                dispatch(setImageURLS({ file: localFile }));
                navigation.goBack();
                navigation.dispatch(StackActions.replace(navigateTo));
            }
        }
    };

    return (
        <View style={[assignStyle, styles.parent]}>
            <View style={styles.container}>
                {photo && (
                    <Image
                        source={{ uri: `file:${photo}` }}
                        style={styles.image}
                    />
                )}
                {picker && picker.type === "application/pdf" && (
                    <Pdf style={styles.image} source={{ uri: picker?.uri }} />
                )}
                {picker &&
                    (picker.type === "image/jpeg" ||
                        picker.type === "image/png") && (
                        <Image
                            source={{ uri: picker?.uri }}
                            style={styles.image}
                        />
                    )}
            </View>
            <View style={styles.conButton}>
                <View style={styles.buttonOne}>
                    <BButtonPrimary
                        title="Ulangi"
                        isOutline
                        emptyIconEnable
                        onPress={() => navigation.goBack()}
                    />
                </View>
                <View style={styles.buttonTwo}>
                    <BButtonPrimary
                        title="Lanjut"
                        onPress={savePhoto}
                        rightIcon={ContinueIcon}
                    />
                </View>
            </View>
        </View>
    );
}

export default Preview;
