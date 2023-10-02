import crashlytics from "@react-native-firebase/crashlytics";
import {
    useNavigation,
    useRoute,
    useIsFocused,
    StackActions,
    useFocusEffect
} from "@react-navigation/native";
import * as React from "react";
import { Animated, SafeAreaView, StyleSheet, View } from "react-native";
import {
    Camera,
    CameraDevice,
    useCameraDevices,
    useFrameProcessor
} from "react-native-vision-camera";
import { useDispatch, useSelector } from "react-redux";
import { BHeaderIcon } from "@/components";
import useCustomHeaderLeft from "@/hooks/useCustomHeaderLeft";
import useHeaderTitleChanged from "@/hooks/useHeaderTitleChanged";
import { RootStackScreenProps } from "@/navigation/CustomStateComponent";
import { CAMERA, PO, IMAGE_PREVIEW } from "@/navigation/ScreenNames";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { AppDispatch, RootState } from "@/redux/store";
import { resScale } from "@/utils";
import { hasCameraPermissions } from "@/utils/permissions";
import { DEBOUNCE_SEARCH } from "@/constants/general";
import HeaderButton from "./elements/HeaderButton";
import CameraButton from "./elements/CameraButton";

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
    const [pause, setPause] = React.useState(false);
    const { isFirstTimeOpenCamera } = poState.currentState.context;
    const navigateTo = route?.params?.navigateTo;
    const closeButton = route?.params?.closeButton;
    const photoTitle = route?.params?.photoTitle;
    const existingVisitation = route?.params?.existingVisitation;
    const operationAddedStep = route?.params?.operationAddedStep;
    const operationTempData = route?.params?.operationTempData;
    const soNumber = route?.params?.soNumber;
    const soID = route?.params?.soID;
    const isVideo = route?.params?.isVideo;
    const disabledDocPicker =
        route?.params?.disabledDocPicker !== undefined
            ? route?.params?.disabledDocPicker
            : true;
    const disabledGalleryPicker =
        route?.params?.disabledGalleryPicker !== undefined
            ? route?.params?.disabledGalleryPicker
            : true;
    const devices = useCameraDevices();

    useHeaderTitleChanged({
        title: isVideo === true ? `Video ${photoTitle}` : `Foto ${photoTitle}`,
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

    const getDevice = (): CameraDevice | undefined =>
        isFrontCamera ? devices?.front : devices?.back;

    const showCameraError = (errorText: string) => {
        dispatch(
            openPopUp({
                popUpType: "error",
                popUpText: errorText,
                outsideClickClosePopUp: true
            })
        );
    };

    const pauseVideo = async () => {
        await setPause(true);
        await camera?.current?.pauseRecording();
    };

    const onResumeVideo = async () => {
        await setPause(false);
        await camera?.current?.resumeRecording();
    };

    const stopVideo = async () => {
        setIsRecording(false);
        await camera?.current?.stopRecording();
    };

    const takePhoto = async () => {
        if (camera === undefined || camera?.current === undefined) {
            showCameraError("Camera not Found");
        } else {
            try {
                const takenPhoto = await camera?.current?.takeSnapshot({
                    flash: enableFlashlight ? "on" : "off",
                    quality: 70
                });

                animateElement();

                navigation.navigate(IMAGE_PREVIEW, {
                    capturedFile: takenPhoto,
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

    const recordVideo = () => {
        setIsRecording(true);
        camera?.current?.startRecording({
            flash: enableFlashlight ? "on" : "off",

            onRecordingFinished: (video) => {
                stopVideo();
                setPause(false);

                setTimeout(() => {
                    navigation.navigate(IMAGE_PREVIEW, {
                        capturedFile: video,
                        picker: undefined,
                        isVideo,
                        photoTitle,
                        navigateTo,
                        closeButton,
                        existingVisitation,
                        operationAddedStep,
                        operationTempData,
                        soID,
                        soNumber
                    });
                }, 200);
            },

            onRecordingError: (error) => console.log("ini error", error)
        });
    };

    const onFileSelect = (data: any) => {
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
    };

    const isFocused = useIsFocused();

    React.useEffect(() => {
        crashlytics().log(CAMERA);
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            hasCameraPermissions();
        }, [])
    );

    return (
        <View style={styles.parent}>
            <SafeAreaView style={styles.container}>
                <View style={styles.containerCamera}>
                    <View style={{ flex: 1 }}>
                        {getDevice() !== undefined && (
                            <Camera
                                ref={camera}
                                style={styles.camera}
                                device={getDevice()}
                                isActive={isFocused}
                                photo
                                video={isVideo}
                                enableHighQualityPhotos={!!enableHighQuality}
                                enableZoomGesture
                                hdr={!!enableHDR}
                                lowLightBoost={enableLowBoost}
                            />
                        )}
                    </View>
                    <HeaderButton
                        onPressSwitchCamera={() => {
                            onSwitchCamera(!isFrontCamera);
                        }}
                        onPressFlashlight={() =>
                            onEnableFlashlight(!enableFlashlight)
                        }
                        onPressHDR={() => onEnableHDR(!enableHDR)}
                        onPressHighQuality={() =>
                            onEnableHighQuality(!enableHighQuality)
                        }
                        onPressLowBoost={() =>
                            onEnableLowBoost(!enableLowBoost)
                        }
                        enableSwitchCamera={isFrontCamera}
                        enableLowBoost={enableLowBoost}
                        enableHighQuality={enableHighQuality}
                        enableFlashlight={enableFlashlight}
                        enableHDR={enableHDR}
                    />
                    <CameraButton
                        resumeVideo={onResumeVideo}
                        takePhoto={takePhoto}
                        recordVideo={recordVideo}
                        isVideo={isVideo}
                        stopRecordingVideo={stopVideo}
                        isRecording={isRecording}
                        pauseVideo={pauseVideo}
                        isPause={pause}
                        onGalleryPress={(data) => onFileSelect(data)}
                        onDocPress={(data) => onFileSelect(data)}
                        disabledDocPicker={disabledDocPicker}
                        disabledGalleryPicker={disabledGalleryPicker}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

export default CameraScreen;
