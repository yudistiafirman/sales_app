import { FlashList } from "@shopify/flash-list";
import * as React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ListRenderItem
} from "react-native";
import Pdf from "react-native-pdf";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { resScale } from "@/utils";
import LocalFileType from "@/interfaces/LocalFileType";
import { colors, layout } from "@/constants";
import BText from "../atoms/BText";
import BSpacer from "../atoms/BSpacer";

const style = StyleSheet.create({
    container: {
        width: resScale(104),
        height: resScale(120),
        margin: resScale(5),
        borderRadius: layout.radius.md
    },
    addImage: {
        backgroundColor: colors.tertiary,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        borderRadius: layout.radius.md
    },
    scrollViewContentStyle: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    closeIcon: {
        position: "absolute",
        right: resScale(-3),
        top: resScale(-5),
        backgroundColor: colors.text.medium,
        borderRadius: layout.radius.lg
    },
    imageStyle: {
        borderRadius: layout.radius.md,
        width: "100%",
        height: "100%"
    },
    attachType: {
        position: "absolute",
        bottom: 0,
        marginBottom: -layout.pad.lg
    }
});

type BGalleryType = {
    picts: any[];
    addMorePict?: (attachType?: string) => void;
    removePict?: (index: number, attachType?: string) => void;
};

export default function BGallery({
    picts,
    addMorePict,
    removePict
}: BGalleryType) {
    const renderItem: ListRenderItem<LocalFileType> = React.useCallback(
        ({ item, index }) => (
            <View
                style={[
                    style.container,
                    item?.attachType ? { marginBottom: layout.pad.ml * 2 } : {}
                ]}
            >
                {item?.file === null && addMorePict && (
                    <TouchableOpacity
                        onPress={() => addMorePict(item?.attachType)}
                    >
                        <View style={[style.addImage]}>
                            <Feather
                                name="plus"
                                size={resScale(25)}
                                color="#000000"
                            />
                        </View>
                    </TouchableOpacity>
                )}
                {item?.isFromPicker ? (
                    <View>
                        {item?.file?.type === "image/jpeg" ||
                        item?.file?.type === "image/png" ? (
                            <Image
                                source={item?.file}
                                style={[
                                    style.imageStyle,
                                    {
                                        resizeMode: "cover"
                                    }
                                ]}
                            />
                        ) : (
                            <Pdf
                                source={{ uri: item?.file?.uri }}
                                style={style.imageStyle}
                                page={1}
                            />
                        )}
                    </View>
                ) : (
                    <Image
                        source={item?.file}
                        style={[
                            style.imageStyle,
                            {
                                resizeMode: "cover"
                            }
                        ]}
                    />
                )}
                {item?.type === "GALLERY" && removePict && (
                    <TouchableOpacity
                        style={style.closeIcon}
                        onPress={() => removePict(index - 1, item?.attachType)}
                    >
                        <AntDesign
                            name="close"
                            size={resScale(15)}
                            color={colors.white}
                        />
                    </TouchableOpacity>
                )}
                {item?.attachType !== undefined &&
                    item?.attachType !== null && (
                        <View style={style.attachType}>
                            <BSpacer size="verySmall" />
                            <BText bold="300" sizeInNumber={10}>
                                {item?.attachType}
                            </BText>
                        </View>
                    )}
            </View>
        ),
        []
    );
    return (
        <FlashList
            estimatedItemSize={10}
            data={picts}
            keyExtractor={(item, index) => index?.toString()}
            renderItem={renderItem}
            numColumns={3}
        />
    );
}
