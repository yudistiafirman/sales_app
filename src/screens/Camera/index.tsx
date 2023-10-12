import crashlytics from "@react-native-firebase/crashlytics";
import {
    useNavigation,
    useRoute,
    useIsFocused,
    StackActions,
    useFocusEffect
} from "@react-navigation/native";
import * as React from "react";
import {
    Animated,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ActivityIndicator
} from "react-native";
import {
    Camera,
    CameraDevice,
    useCameraDevice,
    useCameraDevices
} from "react-native-vision-camera";
import { useDispatch, useSelector } from "react-redux";
import { BHeaderIcon, BSpacer } from "@/components";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { CAMERA, PO, IMAGE_PREVIEW } from "@/navigation/ScreenNames";
import { closePopUp, openPopUp } from "@/redux/reducers/modalReducer";
import { AppDispatch, RootState } from "@/redux/store";
import { resScale } from "@/utils";
import {
    hasCameraPermissions,
    hasLocationPermission
} from "@/utils/permissions";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import Geolocation from "react-native-geolocation-service";

import moment from "moment";
import { getLocationCoordinates } from "@/actions/CommonActions";
import {
    ffmegLiveTimestampOverlayCommand,
    getCurrentTimestamp,
    getGmtPlus7UnixTime,
    replaceMP4videoPath,
    safetyCheck
} from "@/utils/generalFunc";
import { colors, fonts, layout } from "@/constants";
import hasMicrophonePermissions from "@/utils/permissions/microphonePersmission";
import { setTotalItems } from "@/redux/reducers/invoiceReducer";
import HeaderButton from "./elements/HeaderButton";
import CameraButton from "./elements/CameraButton";
import LiveTimeStamp from "./elements/LiveTimestamp";

const styles = StyleSheet.create({
    parent: {
        flex: 1,
        backgroundColor: "black"
    },
    container: {
        flex: 1
    },
    camera: {
        flex: 1
    },
    containerCamera: {
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "green"
    },
    cameraLoading: {
        flex: 1,
        justifyContent: "center"
    }
});

function CameraScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute<RootStackScreenProps>();
    const poState = useSelector((state: RootState) => state.purchaseOrder);
    const authState = useSelector((state: RootState) => state.auth);
    const [enableFlashlight, onEnableFlashlight] =
        React.useState<boolean>(false);
    const [isFrontCamera, onSwitchCamera] = React.useState<boolean>(false);
    const [enableHDR, onEnableHDR] = React.useState<boolean>(false);
    const [enableLowBoost, onEnableLowBoost] = React.useState<boolean>(false);
    const [enableHighQuality, onEnableHighQuality] =
        React.useState<boolean>(false);
    const [isRecording, setIsRecording] = React.useState(false);
    const { isFirstTimeOpenCamera } = poState.currentState.context;
    const navigateTo = route?.params?.navigateTo;
    const closeButton = route?.params?.closeButton;
    const photoTitle = route?.params?.photoTitle;
    const existingVisitation = route?.params?.existingVisitation;
    const operationAddedStep = route?.params?.operationAddedStep;
    const operationTempData = route?.params?.operationTempData;
    const soNumber = route?.params?.soNumber;
    const soID = route?.params?.soID;
    // const isVideo = route?.params?.isVideo;
    const disabledDocPicker =
        route?.params?.disabledDocPicker !== undefined
            ? route?.params?.disabledDocPicker
            : true;
    const disabledGalleryPicker =
        route?.params?.disabledGalleryPicker !== undefined
            ? route?.params?.disabledGalleryPicker
            : true;
    const devices = useCameraDevice(isFrontCamera ? "front" : "back");
    const [latlongResult, setLatlongResult] = React.useState("");
    const [formattedAddress, setFormattedAddress] = React.useState("");
    // const [localTime, setLocalTime] = React.useState(getGmtPlus7UnixTime);

    // const [currentTimestamp, setCurrentTimestamp] = React.useState(
    //     getCurrentTimestamp()
    // );
    const [isCameraLoading, setIsCameraLoading] = React.useState(false);
    // const interval = React.useRef();

    const showCameraError = (errorText: string) => {
        dispatch(
            openPopUp({
                popUpType: "error",
                popUpText: errorText,
                outsideClickClosePopUp: true
            })
        );
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
            const { latitude, longitude } = coords;
            const responseDetail = await getLocationCoordinates(
                longitude,
                latitude
            );
            const latlong =
                safetyCheck(latitude) && safetyCheck(longitude)
                    ? `${latitude}, ${longitude}`
                    : "";
            setLatlongResult(latlong);

            const addressTitle = safetyCheck(
                responseDetail?.data?.result?.formattedAddress
            )
                ? responseDetail?.data?.result?.formattedAddress?.split(",")[0]
                : "";

            setFormattedAddress(addressTitle);
            setIsCameraLoading(false);
        } catch (error) {
            showCameraError(error);
            setIsCameraLoading(false);
        }
    };

    useHeaderTitleChanged({
        // title: isVideo === true ? `Video ${photoTitle}` : `Foto ${photoTitle}`,
        title: `Foto ${photoTitle}`,
        selectedBP: authState.selectedBatchingPlant,
        hideBPBadges: true
    });

    const handleBack = React.useCallback(() => {
        if (navigateTo === PO) {
            if (isFirstTimeOpenCamera) {
                if (navigation.canGoBack()) {
                    dispatch({ type: "backToSavedPoFromCamera" });
                    navigation.dispatch(StackActions.popToTop());
                }
            } else {
                dispatch({ type: "backFromCamera" });
                navigation.goBack();
            }
        } else {
            navigation.goBack();
        }
    }, [dispatch, navigateTo, navigation, isFirstTimeOpenCamera]);

    useCustomHeaderLeft({
        customHeaderLeft: closeButton ? (
            <BHeaderIcon size={resScale(23)} onBack={handleBack} iconName="x" />
        ) : undefined
    });

    const camera = React.useRef<Camera>(null);
    const opacityAnimation = React.useRef(new Animated.Value(0))?.current;
    const animateElement = () => {
        Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start(() => {
            Animated.timing(opacityAnimation, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            }).start();
        });
    };

    // const stopVideo = async () => {
    //     setIsRecording(false);
    //     console.log("wkwkwk 0:: ", false);
    //     try {
    //         await camera?.current?.stopRecording();
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    const takePhoto = async () => {
        if (camera === undefined || camera?.current === undefined) {
            showCameraError("Camera not Found");
        } else {
            try {
                const takenPhoto = await camera?.current?.takePhoto({
                    flash: enableFlashlight ? "on" : "off",
                    qualityPrioritization: "speed",
                    enableShutterSound: false
                });

                animateElement();

                navigation.navigate(IMAGE_PREVIEW, {
                    capturedFile: takenPhoto,
                    latlongResult,
                    picker: undefined,
                    photoTitle,
                    navigateTo,
                    closeButton,
                    existingVisitation,
                    operationAddedStep,
                    operationTempData,
                    soID,
                    soNumber
                });
            } catch (error) {
                showCameraError("Camera Error");
            }
        }
    };

    // const recordVideo = React.useCallback(async () => {
    //     if (camera === undefined || camera?.current === undefined) {
    //         stopVideo();
    //         showCameraError("Camera not Found");
    //     } else {
    //         setIsRecording(true);
    //         console.log("wkwkwk 1:: ", true);
    //         await camera?.current?.startRecording({
    //             flash: enableFlashlight ? "on" : "off",
    //             onRecordingFinished: async (video) => {
    //                 setIsRecording(false);
    //                 console.log("wkwkwk 2:: ", false);
    //                 await dispatch(
    //                     openPopUp({
    //                         popUpType: "loading",
    //                         popUpText: "Video sedang di proses",
    //                         outsideClickClosePopUp: false
    //                     })
    //                 );

    //                 try {
    //                     await camera?.current?.stopRecording();
    //                 } catch (e) {
    //                     console.log(e);
    //                 }

    //                 const overlayCommand = ffmegLiveTimestampOverlayCommand(
    //                     video,
    //                     localTime.toString(),
    //                     formattedAddress,
    //                     latlongResult
    //                 );

    //                 await FFmpegKit.execute(overlayCommand);

    //                 await dispatch(closePopUp());

    //                 await navigation.navigate(IMAGE_PREVIEW, {
    //                     capturedFile: video,
    //                     picker: undefined,
    //                     latlongResult,
    //                     isVideo,
    //                     photoTitle,
    //                     navigateTo,
    //                     closeButton,
    //                     existingVisitation,
    //                     operationAddedStep,
    //                     operationTempData,
    //                     soID,
    //                     soNumber
    //                 });
    //             },

    //             onRecordingError: (error) => {
    //                 if (error.code === "capture/recording-in-progress") {
    //                     console.log(error);
    //                 } else {
    //                     setIsRecording(false);
    //                     console.log("wkwkwk 3:: ", false);
    //                     showCameraError(error.message);
    //                 }
    //             }
    //         });
    //     }
    // }, [isRecording]);

    const onFileSelect = (data: any) => {
        if (data !== null) {
            navigation.navigate(IMAGE_PREVIEW, {
                photo: undefined,
                picker: data,
                photoTitle,
                navigateTo,
                closeButton,
                existingVisitation,
                operationAddedStep,
                operationTempData,
                soID,
                soNumber
            });
        } else {
            setIsCameraLoading(true);
            setTimeout(() => {
                setIsCameraLoading(false);
            }, 500);
        }
    };

    const isFocused = useIsFocused();

    React.useEffect(() => {
        crashlytics().log(CAMERA);
        // if (isVideo) {
        //     clearInterval(interval.current);
        //     if (
        //         interval &&
        //         interval !== null &&
        //         interval.current &&
        //         interval.current !== null
        //     )
        //         interval.current = setInterval(() => {
        //             setCurrentTimestamp(getCurrentTimestamp());
        //             setLocalTime(getGmtPlus7UnixTime);
        //         }, 1000);
        // }

        // return () => clearInterval(interval.current);
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            setIsCameraLoading(true);
            hasCameraPermissions().then((response) => {
                if (response) {
                    hasLocationPermission().then((res) => {
                        if (res) {
                            getCurrentLocation();
                        }
                    });
                }
            });
        }, [])
    );

    if (isCameraLoading) {
        return (
            <View style={styles.cameraLoading}>
                <ActivityIndicator
                    size={layout.pad.xl}
                    color={colors.primary}
                />
            </View>
        );
    }

    return (
        <>
            {devices ? (
                <Camera
                    ref={camera}
                    isActive={isFocused}
                    photo
                    device={devices}
                    orientation="portrait"
                    style={StyleSheet.absoluteFill}
                    // video={isVideo}
                    // audio={isVideo}
                    enableZoomGesture
                    enableHighQualityPhotos={!!enableHighQuality}
                    hdr={!!enableHDR}
                    lowLightBoost={enableLowBoost}
                />
            ) : (
                <View />
            )}

            <HeaderButton
                onPressSwitchCamera={() => {
                    onSwitchCamera(!isFrontCamera);
                }}
                onPressFlashlight={() => onEnableFlashlight(!enableFlashlight)}
                onPressHDR={() => onEnableHDR(!enableHDR)}
                onPressHighQuality={() =>
                    onEnableHighQuality(!enableHighQuality)
                }
                onPressLowBoost={() => onEnableLowBoost(!enableLowBoost)}
                enableSwitchCamera={isFrontCamera}
                enableLowBoost={enableLowBoost}
                enableHighQuality={enableHighQuality}
                enableFlashlight={enableFlashlight}
                enableHDR={enableHDR}
            />
            {/* {isVideo && (
                <LiveTimeStamp
                    currentLocation={formattedAddress}
                    currentTimestamp={currentTimestamp}
                    latlong={latlongResult}
                />
            )} */}

            <CameraButton
                takePhoto={takePhoto}
                // recordVideo={recordVideo}
                // isVideo={isVideo}
                // stopRecordingVideo={stopVideo}
                // isRecording={isRecording}
                onGalleryPress={(data) => onFileSelect(data)}
                onDocPress={(data) => onFileSelect(data)}
                disabledDocPicker={disabledDocPicker}
                disabledGalleryPicker={disabledGalleryPicker}
            />
        </>
    );
}

export default CameraScreen;
