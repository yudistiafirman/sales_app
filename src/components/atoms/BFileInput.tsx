import * as React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { resScale } from "@/utils";
import { AppDispatch } from "@/redux/store";
import { openPopUp } from "@/redux/reducers/modalReducer";
import { colors, fonts, layout } from "@/constants";
import BLabel from "./BLabel";

const style = StyleSheet.create({
    container: {
        backgroundColor: colors.offWhite,
        height: resScale(40),
        borderRadius: layout.radius.sm,
        padding: layout.pad.md,
        justifyContent: "space-between",
        flexDirection: "row"
    },
    textStyle: {
        fontFamily: fonts.family.montserrat[500],
        fontSize: fonts.size.md,
        color: colors.textInput.input
    },
    dashedBorder: {
        borderWidth: resScale(2),
        borderStyle: "dashed",
        borderColor: colors.border.altGrey
    },
    greenDot: {
        backgroundColor: "green",
        width: resScale(16),
        height: resScale(16),
        borderRadius: layout.radius.lg,
        justifyContent: "center",
        alignItems: "center"
    },
    redIcon: {
        backgroundColor: colors.primary,
        width: resScale(16),
        height: resScale(16),
        borderRadius: layout.radius.lg,
        justifyContent: "center",
        alignItems: "center"
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    }
});

// AntDesign
type BFileInputType = {
    onChange?: (e: any) => void;
    label: string;
    value: any;
    isLoading?: boolean;
    isError?: boolean;
    disabled?: boolean;
    isRequire?: boolean;
    sizeInNumber?: number;
    titleBold?:
        | "bold"
        | "400"
        | "normal"
        | "100"
        | "200"
        | "300"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900"
        | undefined;
};

function iconState(value: any, isLoading?: boolean, isError?: boolean) {
    if (!value) {
        return <AntDesign name="upload" size={resScale(15)} />;
    }
    if (isError) {
        return (
            <View style={style.redIcon}>
                <Ionicons name="close" size={15} color="#FFFFFF" />
            </View>
        );
    }
    if (isLoading) {
        return <ActivityIndicator size={resScale(15)} color={colors.primary} />;
    }
    if (value) {
        return (
            <View style={style.greenDot}>
                <Entypo size={13} name="check" color="#FFFFFF" />
            </View>
        );
    }
    return <></>;
}

export default function BFileInput({
    onChange,
    label,
    value,
    isLoading,
    isError,
    disabled,
    isRequire,
    sizeInNumber,
    titleBold
}: BFileInputType) {
    const dispatch = useDispatch<AppDispatch>();
    const selectFile = React.useCallback(async () => {
        // Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pickSingle({
                // Provide which type of file you want user to pick
                type: [
                    "image/png",
                    "image/jpg",
                    "image/jpeg",
                    DocumentPicker.types.pdf
                ],
                allowMultiSelection: false
                // There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
            });
            // Printing the log realted to the file
            // Setting the state to show single file attributes
            //   setSingleFile(res);
            if (onChange) {
                onChange(res);
            }
        } catch (err) {
            //   setSingleFile(null);
            if (onChange) {
                onChange(null);
            }
            // Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                console.log("User Canceled Document Picker");
            } else {
                dispatch(
                    openPopUp({
                        popUpType: "error",
                        popUpText:
                            err.message ||
                            "Terjadi error dalam pengambilan file",
                        outsideClickClosePopUp: true
                    })
                );
            }
        }
    }, [onChange]);

    return (
        <TouchableOpacity disabled={disabled} onPress={selectFile}>
            <View style={[style.container, !value ? style.dashedBorder : null]}>
                <BLabel
                    sizeInNumber={sizeInNumber}
                    bold={titleBold}
                    label={label}
                    isRequired={isRequire}
                />
                {iconState(value, isLoading, isError)}
                {/* <View style={style.row}>
          {isLoading && (
            <>
              <ActivityIndicator size={resScale(15)} color={colors.primary} />
              <BSpacer size={'extraSmall'} />
            </>
          )}
          {value && !isLoading ? (
            <View style={style.greenDot}>
              <Entypo size={13} name="check" color={'#FFFFFF'} />
            </View>
          ) : (
            <AntDesign name="upload" size={resScale(15)} />
          )}
        </View> */}
            </View>
        </TouchableOpacity>
    );
}
