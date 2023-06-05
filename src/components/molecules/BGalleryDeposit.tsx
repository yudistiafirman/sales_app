import * as React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import Pdf from "react-native-pdf";
import { colors, fonts, layout } from "@/constants";
import { resScale } from "@/utils";
import formatCurrency from "@/utils/formatCurrency";
import BText from "../atoms/BText";

const style = StyleSheet.create({
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.black,
        opacity: 0.5
    },
    textOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        color: colors.white,
        justifyContent: "center",
        alignSelf: "center",
        textAlignVertical: "center"
    },
    rightText: {
        alignItems: "flex-end",
        justifyContent: "center"
    },
    summaryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.tertiary,
        borderRadius: layout.radius.sm,
        borderColor: colors.border.default,
        borderWidth: 1,
        padding: layout.pad.md
    },
    flexFull: {
        width: "100%",
        height: "100%"
    }
});

type BGalleryDepositType = {
    picts: any[];
    nominal: number;
    createdAt?: string;
};

export default function BGalleryDeposit({
    picts,
    nominal,
    createdAt
}: BGalleryDepositType) {
    return (
        <View style={style.summaryContainer}>
            {picts && picts.length > 1 && (
                <View
                    style={{
                        width: resScale(40),
                        height: resScale(40),
                        borderRadius: layout.radius.md
                    }}
                >
                    {picts[1]?.isFromPicker ? (
                        <View>
                            {picts[1]?.file?.type === "image/jpeg" ||
                            picts[1]?.file?.type === "image/png" ? (
                                <Image
                                    style={[
                                        style.flexFull,
                                        {
                                            resizeMode: "cover"
                                        }
                                    ]}
                                    source={picts[1]?.file}
                                />
                            ) : (
                                <Pdf
                                    source={{ uri: picts[1]?.file?.uri }}
                                    style={style.flexFull}
                                    page={1}
                                />
                            )}
                        </View>
                    ) : (
                        <Image
                            style={[
                                style.flexFull,
                                {
                                    resizeMode: "cover"
                                }
                            ]}
                            source={picts[1]?.file}
                        />
                    )}
                    {picts.length > 2 && (
                        <>
                            <View style={style.overlay} />
                            <Text style={style.textOverlay}>{`+${
                                picts.length - 2
                            }`}</Text>
                        </>
                    )}
                </View>
            )}
            <View style={style.rightText}>
                <BText bold="500" sizeInNumber={fonts.size.lg}>
                    {formatCurrency(nominal)}
                </BText>
                <BText bold="400" sizeInNumber={fonts.size.md}>
                    {createdAt}
                </BText>
            </View>
        </View>
    );
}
