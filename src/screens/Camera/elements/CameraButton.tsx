import * as React from "react";
import { StyleProp, ViewStyle, View, StyleSheet, Text } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BSpacer, BSvg } from "@/components";
import SvgNames from "@/components/atoms/BSvg/svgName";
import { colors, layout } from "@/constants";
import { resScale } from "@/utils";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Feathericon from "react-native-vector-icons/Feather";
import { convertTimeString } from "@/utils/generalFunc";

const styles = StyleSheet.create({
    flexFull: {
        flex: 1
    },
    roundedViewButton: {
        height: resScale(40),
        width: resScale(40),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.text.secondary,
        borderRadius: layout.radius.xl
    },
    optionButton: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        alignSelf: "center",
        flex: 1,
        flexDirection: "row"
    },
    galleryView: {
        alignSelf: "flex-start",
        flex: 1
    },
    gallery: {
        alignItems: "center",
        alignSelf: "flex-start",
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: layout.pad.xxl,
        paddingTop: layout.pad.md
    },
    docView: {
        alignSelf: "flex-end",
        flex: 1
    },
    doc: {
        alignItems: "center",
        alignSelf: "flex-end",
        justifyContent: "center",
        flex: 1,
        paddingHorizontal: layout.pad.xxl,
        paddingTop: layout.pad.md
    },
    playPauseBtn: {
        alignItems: "flex-start",
        alignSelf: "flex-start",
        justifyContent: "center",
        flex: 2,
        paddingHorizontal: layout.pad.xxl,
        paddingTop: layout.pad.md
    },
    videoDuration: {
        alignItems: "center",
        alignSelf: "flex-end",
        justifyContent: "space-between",
        flex: 1,
        paddingHorizontal: layout.pad.xxl,
        paddingTop: layout.pad.md,
        flexDirection: "row"
    },
    cameraBtn: {
        // position: 'absolute',
        height: resScale(120),
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black"
    },
    outerShutter: {
        // flex: 1,
        borderRadius: layout.radius.xl + layout.radius.md,
        height: resScale(68),
        width: resScale(68),
        borderWidth: resScale(4),
        borderColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: layout.pad.lg,
        marginTop: layout.pad.lg
    },
    innerShutter: {
        borderRadius: layout.radius.xl + layout.radius.md,
        height: resScale(58),
        width: resScale(58)
    },
    videoInnerShutter: {
        height: resScale(58),
        width: resScale(58),
        borderRadius: layout.radius.xl + layout.radius.md,
        backgroundColor: colors.danger
    },
    stopVideoInnerShutter: {
        height: resScale(20),
        width: resScale(20),
        backgroundColor: colors.danger
    }
});

type ConfigType = {
    style?: StyleProp<ViewStyle>;
    takePhoto: () => void;
    recordVideo: () => void;
    stopRecordingVideo?: () => void;
    onDocPress?: (data: any) => void;
    onGalleryPress?: (data: any) => void;
    disabledGalleryPicker?: boolean;
    disabledDocPicker?: boolean;
    flashModeEnable?: boolean;
    isVideo?: boolean;
    isRecording?: boolean;
};

function CameraButton({
    style,
    takePhoto,
    recordVideo,
    onDocPress,
    onGalleryPress,
    stopRecordingVideo,
    disabledGalleryPicker = true,
    disabledDocPicker = true,
    flashModeEnable = false,
    isVideo = false,
    isRecording = false
}: ConfigType) {
    const timer = React.useRef();
    const [videoDuration, setVideoDuration] = React.useState(0);
    const selectFile = React.useCallback(
        async (typeDocument: "IMAGE" | "DOC") => {
            try {
                const res = await DocumentPicker.pickSingle({
                    type:
                        typeDocument === "IMAGE"
                            ? ["image/png", "image/jpg", "image/jpeg"]
                            : [DocumentPicker.types.pdf],
                    allowMultiSelection: false
                });
                if (typeDocument === "IMAGE") onGalleryPress(res);
                else onDocPress(res);
            } catch (err) {
                if (!DocumentPicker.isCancel(err)) {
                    throw err;
                }
            }
        },
        [onDocPress, onGalleryPress]
    );

    const startTimer = () => {
        timer.current = setInterval(() => {
            setVideoDuration((prev) => prev + 1);
        }, 1000);
    };
    const stopTimer = () => {
        if (timer.current) clearInterval(timer.current);
    };

    const onRecordVideo = () => {
        setVideoDuration(0);
        startTimer();

        setTimeout(() => {
            recordVideo();
        }, 500);
    };

    const onStopRecordingVideo = () => {
        if (stopRecordingVideo) {
            stopTimer();
            stopRecordingVideo();
        }
    };

    const renderTakePhotoBtn = () => (
        <TouchableOpacity onPress={takePhoto}>
            <View style={styles.outerShutter}>
                <View style={styles.innerShutter} />
            </View>
        </TouchableOpacity>
    );

    const renderRecordVideoBtn = () => (
        <TouchableOpacity
            onPress={isRecording ? onStopRecordingVideo : onRecordVideo}
        >
            <View style={styles.outerShutter}>
                <View
                    style={
                        isRecording
                            ? [styles.stopVideoInnerShutter]
                            : styles.videoInnerShutter
                    }
                />
            </View>
        </TouchableOpacity>
    );

    const renderCaptureButton = () => {
        if (isVideo) {
            return renderRecordVideoBtn();
        }
        return renderTakePhotoBtn();
    };

    return (
        <View style={[styles.cameraBtn, style]}>
            <View style={styles.optionButton}>
                {!disabledGalleryPicker && (
                    <View style={styles.flexFull}>
                        <View style={styles.gallery}>
                            <TouchableOpacity
                                style={styles.roundedViewButton}
                                onPress={() => selectFile("IMAGE")}
                            >
                                <BSvg
                                    widthHeight={resScale(20)}
                                    svgName={SvgNames.IC_GALLERY_PICKER}
                                    color={colors.white}
                                    type="color"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {!disabledDocPicker && (
                    <View style={styles.flexFull}>
                        <View style={styles.doc}>
                            <TouchableOpacity
                                style={styles.roundedViewButton}
                                onPress={() => selectFile("DOC")}
                            >
                                <BSvg
                                    widthHeight={resScale(20)}
                                    svgName={SvgNames.IC_DOC_PICKER}
                                    color={colors.white}
                                    type="color"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {isVideo && isRecording && (
                    <View style={styles.flexFull}>
                        <View style={[styles.videoDuration]}>
                            <Text style={{ color: colors.danger }}>●</Text>
                            <BSpacer size="extraSmall" />
                            <Text style={{ color: colors.white }}>
                                {convertTimeString(videoDuration)}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
            {renderCaptureButton()}
        </View>
    );
}

export default CameraButton;
