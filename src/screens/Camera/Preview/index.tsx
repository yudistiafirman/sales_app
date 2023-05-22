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
import { LocalFileType } from "@/interfaces/LocalFileType";
import { ENTRY_TYPE } from "@/models/EnumModel";
import { updateDeliverOrder } from "@/models/updateDeliveryOrder";
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
    SUBMIT_FORM
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
    useHeaderTitleChanged({
        title: `Foto ${route?.params?.photoTitle}`
    });
    const _style = React.useMemo(() => style, [style]);
    const photo = route?.params?.photo?.path;
    const picker = route?.params?.picker;
    const navigateTo = route?.params?.navigateTo;
    const operationAddedStep = route?.params?.operationAddedStep;
    const operationTempData = route?.params?.operationTempData;
    const closeButton = route?.params?.closeButton;
    const existingVisitation = route?.params?.existingVisitation;
    const soNumber = route?.params?.soNumber;
    const soID = route?.params?.soID;
    const visitationData = useSelector((state: RootState) => state.visitation);
    const operationData = useSelector((state: RootState) => state.operation);
    let latlongResult = "";

    if (closeButton) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCustomHeaderLeft({
            customHeaderLeft: (
                <BHeaderIcon
                    size={resScale(23)}
                    onBack={() => navigation.goBack()}
                    iconName="x"
                />
            )
        });
    }

    React.useEffect(() => {
        crashlytics().log(IMAGE_PREVIEW);
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            hasLocationPermission().then((result) => {
                if (result) {
                    getCurrentLocation().then((longlat) => {
                        latlongResult = `${longlat.latitude}, ${longlat.longitude}`;
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
                navigateTo !== ENTRY_TYPE.DRIVER &&
                navigateTo !== ENTRY_TYPE.DISPATCH &&
                navigateTo !== ENTRY_TYPE.RETURN &&
                navigateTo !== ENTRY_TYPE.IN &&
                navigateTo !== ENTRY_TYPE.OUT &&
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
            const payload = {} as updateDeliverOrder;
            payload.status = "ARRIVED";
            const responseUpdateDeliveryOrder = await updateDeliveryOrder(
                payload,
                operationTempData?.deliveryOrderId ||
                    operationData?.projectDetails?.deliveryOrderId
            );

            if (responseUpdateDeliveryOrder.data.success) {
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

    const savePhoto = () => {
        const imagePayloadType: "COVER" | "GALLERY" = getTypeOfImagePayload();
        const photoName = photo?.split("/").pop();
        const pdfName = picker?.name;
        const photoNameParts = photoName?.split(".");
        let photoType =
            photoNameParts && photoNameParts.length > 0
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
                    navigateTo === ENTRY_TYPE.DRIVER
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
                    navigateTo === ENTRY_TYPE.DRIVER
                        ? operationAddedStep
                        : undefined
            };
        }

        if (
            navigateTo === ENTRY_TYPE.DRIVER ||
            navigateTo === ENTRY_TYPE.DISPATCH ||
            navigateTo === ENTRY_TYPE.RETURN ||
            navigateTo === ENTRY_TYPE.IN ||
            navigateTo === ENTRY_TYPE.OUT
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
            case CREATE_VISITATION:
                dispatch(
                    setImageURLS({ file: localFile, source: CREATE_VISITATION })
                );
                if (visitationData.images && visitationData.images.length > 0)
                    images = [{ file: null }];
                images.push(localFile);
                dispatch(
                    updateDataVisitation({ type: "images", value: images })
                );
                dispatch(resetAllStepperFocused());
                navigation.goBack();
                navigation.dispatch(
                    StackActions.replace(navigateTo, { existingVisitation })
                );
                return;
            case PO:
                dispatch({
                    type: "addImages",
                    value: localFile
                });
                navigation.dispatch(StackActions.replace(navigateTo));
                return;
            case ENTRY_TYPE.DISPATCH:
                dispatch(
                    setOperationPhoto({
                        file: localFile,
                        withoutAddButton: true
                    })
                );
                navigation.dispatch(StackActions.pop(2));
                if (!operationAddedStep || operationAddedStep === "") {
                    navigation.navigate(CAMERA, {
                        photoTitle: "Driver",
                        navigateTo,
                        operationAddedStep: "nopol",
                        operationTempData
                    });
                } else if (operationAddedStep === "nopol") {
                    navigation.navigate(CAMERA, {
                        photoTitle: "No Polisi TM",
                        navigateTo,
                        operationAddedStep: "segel",
                        operationTempData
                    });
                } else if (operationAddedStep === "segel") {
                    navigation.navigate(CAMERA, {
                        photoTitle: "Segel",
                        navigateTo,
                        operationAddedStep: "kondom",
                        operationTempData
                    });
                } else if (operationAddedStep === "kondom") {
                    navigation.navigate(CAMERA, {
                        photoTitle: "Kondom",
                        navigateTo,
                        operationAddedStep: "finished",
                        operationTempData
                    });
                } else if (operationAddedStep === "finished") {
                    navigation.navigate(SUBMIT_FORM, {
                        operationType: ENTRY_TYPE.DISPATCH
                    });
                }
                return;
            case ENTRY_TYPE.DRIVER:
                const newPhotoFiles: LocalFileType[] = [];
                operationData.photoFiles.forEach((item) => {
                    let selectedItem: LocalFileType | undefined = { ...item };
                    if (selectedItem.attachType === operationAddedStep) {
                        selectedItem = localFile;
                    }

                    if (selectedItem) newPhotoFiles.push(selectedItem);
                });
                dispatch(setAllOperationPhoto({ file: newPhotoFiles }));

                navigation.dispatch(StackActions.pop(2));
                if (operationAddedStep === "Tiba di lokasi") {
                    onArrivedDriver();
                    navigation.navigate(SUBMIT_FORM, {
                        operationType: ENTRY_TYPE.DRIVER
                    });
                }
                return;
            case ENTRY_TYPE.IN:
                dispatch(
                    setOperationPhoto({
                        file: localFile,
                        withoutAddButton: true
                    })
                );
                navigation.dispatch(StackActions.pop(2));
                if (!operationAddedStep || operationAddedStep === "") {
                    navigation.navigate(CAMERA, {
                        photoTitle: "Hasil",
                        navigateTo,
                        operationAddedStep: "finished",
                        operationTempData
                    });
                } else if (operationAddedStep === "finished") {
                    navigation.navigate(SUBMIT_FORM, {
                        operationType: ENTRY_TYPE.IN
                    });
                }
                return;
            case ENTRY_TYPE.OUT:
                dispatch(
                    setOperationPhoto({
                        file: localFile,
                        withoutAddButton: true
                    })
                );
                navigation.dispatch(StackActions.pop(2));
                if (!operationAddedStep || operationAddedStep === "") {
                    navigation.navigate(CAMERA, {
                        photoTitle: "Hasil",
                        navigateTo,
                        operationAddedStep: "finished",
                        operationTempData
                    });
                } else if (operationAddedStep === "finished") {
                    navigation.navigate(SUBMIT_FORM, {
                        operationType: ENTRY_TYPE.OUT
                    });
                }
                return;
            case ENTRY_TYPE.RETURN:
                dispatch(
                    setOperationPhoto({
                        file: localFile,
                        withoutAddButton: true
                    })
                );
                navigation.dispatch(StackActions.pop(2));
                if (!operationAddedStep || operationAddedStep === "") {
                    navigation.navigate(CAMERA, {
                        photoTitle: "Kondisi TM",
                        navigateTo,
                        operationAddedStep: "finished",
                        operationTempData
                    });
                } else if (operationAddedStep === "finished") {
                    navigation.navigate(SUBMIT_FORM, {
                        operationType: ENTRY_TYPE.RETURN
                    });
                }
                return;
            case FORM_SO:
                dispatch(setSOPhoto({ file: localFile }));
                navigation.dispatch(StackActions.pop(2));
                navigation.navigate(navigateTo);
                return;
            case GALLERY_SO:
                dispatch(setSOPhoto({ file: localFile }));
                navigation.dispatch(StackActions.pop(2));
                return;
            case CREATE_DEPOSIT:
                dispatch(
                    setImageURLS({ file: localFile, source: CREATE_DEPOSIT })
                );
                navigation.goBack();
                navigation.dispatch(StackActions.replace(navigateTo));
                return;
            case GALLERY_VISITATION:
                dispatch(
                    setImageURLS({ file: localFile, source: CREATE_VISITATION })
                );
                if (visitationData.images && visitationData.images.length > 0)
                    images = [...visitationData.images];
                images.push(localFile);
                dispatch(
                    updateDataVisitation({ type: "images", value: images })
                );
                navigation.dispatch(StackActions.pop(2));
                return;
            case GALLERY_DEPOSIT:
                dispatch(
                    setImageURLS({ file: localFile, source: CREATE_DEPOSIT })
                );
                navigation.dispatch(StackActions.pop(2));
                return;
            case GALLERY_OPERATION:
                dispatch(
                    setOperationPhoto({
                        file: localFile,
                        withoutAddButton: false
                    })
                );
                navigation.dispatch(StackActions.pop(2));
                return;
            default:
                dispatch(setImageURLS({ file: localFile }));
                navigation.goBack();
                navigation.dispatch(StackActions.replace(navigateTo));
        }
    };

    return (
        <View style={[_style, styles.parent]}>
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
