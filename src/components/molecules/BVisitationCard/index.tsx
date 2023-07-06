import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import React from "react";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import resScale from "@/utils/resScale";
import { colors, fonts, layout } from "@/constants";
import BLocationText from "@/components/atoms/BLocationText";
import { visitationDataType } from "@/interfaces";
import { Text } from "react-native-paper";
import BSpacer from "@/components/atoms/BSpacer";
import BButtonPrimary from "@/components/atoms/BButtonPrimary";
import { safetyCheck } from "@/utils/generalFunc";
import Unit from "./elements/Unit";
import HighlightText from "../../atoms/BHighlightText";
import PillNames from "./elements/PillNames";
import VisitStatus from "./elements/VisitStatus";
import Time from "./elements/Time";
import PillStatus from "./elements/PillStatus";

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderColor: "#EBEBEB",
        borderRadius: layout.radius.md,
        borderWidth: resScale(1),
        padding: layout.pad.md
    },
    subContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    leftSide: {
        flex: 1,
        paddingStart: layout.pad.md,
        justifyContent: "space-between",
        alignSelf: "center"
    },
    rightSide: {
        justifyContent: "center",
        alignItems: "center",
        marginStart: layout.pad.lg
    },
    top: {
        flex: 1,
        // height: resScale(20),
        flexDirection: "row",
        // marginBottom: layout.pad.sm,
        // width: resScale(285),
        alignItems: "center"
    },
    row: {
        flexDirection: "row"
    },
    bottom: {
        marginTop: layout.pad.md
    },
    location: {
        marginTop: layout.pad.lg,
        marginHorizontal: layout.pad.md,
        marginBottom: layout.pad.md
    },
    locationButton: {
        borderRadius: layout.radius.md
    },
    locationTextButton: {
        fontFamily: fonts.family.montserrat[400],
        fontSize: fonts.size.sm
    }
});

function iconRender(
    isRenderIcon: boolean,
    customIcon: (() => JSX.Element) | undefined
) {
    if (!isRenderIcon) {
        return null;
    }
    if (customIcon) {
        return customIcon();
    }
    return <MaterialIcon size={24} name="chevron-right" color="#000000" />;
}

type VisitationCardType = {
    id?: string;
    item: visitationDataType;
    searchQuery?: string;
    onPress?: (data: visitationDataType) => void;
    isRenderIcon?: boolean;
    pillColor?: string;
    nameSize?: number;
    customIcon?: () => JSX.Element;
    customStyle?: ViewStyle;
    locationTextColor?: string;
    onLocationPress?: (lonlat: { longitude: string; latitude: string }) => void;
    disabled?: boolean;
};

export default function BVisitationCard({
    item,
    searchQuery,
    onPress = () => {},
    isRenderIcon = true,
    customIcon,
    pillColor,
    customStyle,
    nameSize = fonts.size.md,
    onLocationPress,
    locationTextColor,
    disabled = false
}: VisitationCardType) {
    const actionButton = onLocationPress || null;
    return (
        <View style={[style.container, customStyle]}>
            <TouchableOpacity
                disabled={disabled}
                style={style.subContainer}
                onPress={() => {
                    onPress(item);
                }}
            >
                <View style={style.leftSide}>
                    <View style={style.top}>
                        <View style={{ flex: 1 }}>
                            <HighlightText
                                fontSize={nameSize}
                                name={item?.name}
                                searchQuery={searchQuery}
                                numberOfLines={2}
                            />
                        </View>
                        <PillStatus
                            pilStatus={item?.pilStatus}
                            color={
                                item?.pilStatus === "Belum Selesai"
                                    ? colors.lightGray
                                    : undefined
                            }
                        />
                    </View>
                    {item?.picOrCompanyName ? (
                        <>
                            <Text>{item?.picOrCompanyName}</Text>
                            <BSpacer size="verySmall" />
                        </>
                    ) : (
                        <BSpacer size="verySmall" />
                    )}
                    <BLocationText
                        color={locationTextColor}
                        location={item?.location}
                    />
                    {item?.pilNames && (
                        <PillNames
                            pillColor={pillColor}
                            pilNames={item?.pilNames}
                            searchQuery={searchQuery}
                        />
                    )}
                    <View
                        style={[
                            style.row,
                            item?.time || item?.unit || item?.status
                                ? style.bottom
                                : null
                        ]}
                    >
                        <Unit unit={item?.unit} />
                        <Time time={item?.time} />
                        <VisitStatus status={item?.status} />
                    </View>
                </View>
                <View style={style.rightSide}>
                    {iconRender(isRenderIcon, customIcon)}
                </View>
            </TouchableOpacity>
            {safetyCheck(item?.lonlat?.latitude) &&
                safetyCheck(item?.lonlat?.longitude) &&
                actionButton !== null && (
                    <View style={style.location}>
                        <BButtonPrimary
                            buttonStyle={style.locationButton}
                            titleStyle={style.locationTextButton}
                            title="Lihat Peta"
                            isOutline
                            onPress={() => actionButton(item?.lonlat)}
                        />
                    </View>
                )}
        </View>
    );
}
